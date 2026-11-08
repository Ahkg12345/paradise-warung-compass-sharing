import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { getStaffAccess } from "@/lib/access.functions";
import { id } from "@/lib/i18n/id";
import { signInWithUsername } from "@/lib/login.functions";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Masuk | Kedai Paradise" },
      { name: "description", content: "Masuk ke sistem Kedai Paradise." },
      { property: "og:title", content: "Masuk | Kedai Paradise" },
      { property: "og:description", content: "Masuk ke sistem Kedai Paradise." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const signIn = useServerFn(signInWithUsername);
  const getStaff = useServerFn(getStaffAccess);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lockSeconds, setLockSeconds] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    const redirectSignedInStaff = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session || !active) return;

        const staff = await getStaff();
        if (active && staff) {
          await navigate({ to: staff.role === "admin" ? "/dasbor" : "/kasir", replace: true });
        }
      } catch {
        // Keep the sign-in form available if the stored session cannot be verified.
      } finally {
        if (active) setCheckingSession(false);
      }
    };

    void redirectSignedInStaff();
    return () => {
      active = false;
    };
  }, [getStaff, navigate]);

  useEffect(() => {
    if (lockedUntil === null) {
      setLockSeconds(0);
      return;
    }

    const updateRemaining = () => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockSeconds(remaining);
      if (remaining === 0) setLockedUntil(null);
    };

    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const isLocked = lockSeconds > 0;

  function handleUsernameChange(value: string) {
    setUsername(value);
    setErrorMessage("");
    setLockedUntil(null);
    setLockSeconds(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || isLocked) return;

    setSubmitting(true);
    setErrorMessage("");
    try {
      const result = await signIn({ data: { username, password } });
      if (!result.ok) {
        setErrorMessage(result.message);
        if (result.lockedSeconds && result.lockedSeconds > 0) {
          setLockSeconds(result.lockedSeconds);
          setLockedUntil(Date.now() + result.lockedSeconds * 1000);
        }
        return;
      }

      const sessionResult = await supabase.auth.setSession(result.session);
      if (sessionResult.error) {
        setErrorMessage(id.login.unavailableError);
        return;
      }

      await navigate({ to: result.role === "admin" ? "/dasbor" : "/kasir", replace: true });
    } catch {
      setErrorMessage(id.login.unavailableError);
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingSession) return <main className="login-page" aria-busy="true" />;

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-brand">
          <img className="login-logo" src="/favicon.png" alt="" />
          <h1 id="login-title">{id.login.title}</h1>
          <p>{id.login.subtitle}</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          {errorMessage ? (
            <div className="login-alert" role="alert" aria-live="polite">
              <AlertTriangle size={20} aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <div className="login-field">
            <label htmlFor="login-username">{id.login.username}</label>
            <div className="login-input-wrap">
              <Input
                id="login-username"
                name="username"
                autoComplete="username"
                autoFocus
                required
                value={username}
                placeholder={id.login.usernamePlaceholder}
                onChange={(event) => handleUsernameChange(event.currentTarget.value)}
                disabled={submitting}
                className="login-input login-input-with-icon"
              />
              <UserRound size={19} aria-hidden="true" />
            </div>
          </div>

          <div className="login-field">
            <div className="login-label-row">
              <label htmlFor="login-password">{id.login.password}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="login-help-trigger" type="button" variant="ghost">
                    {id.login.help}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="login-help-popover" align="end">
                  {id.login.helpDescription}
                </PopoverContent>
              </Popover>
            </div>
            <div className="login-input-wrap">
              <Input
                id="login-password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                placeholder={id.login.passwordPlaceholder}
                onChange={(event) => setPassword(event.currentTarget.value)}
                disabled={submitting}
                className="login-input login-input-with-icon"
              />
              <Button
                className="login-password-toggle"
                type="button"
                variant="ghost"
                size="icon"
                aria-label={passwordVisible ? id.login.hidePassword : id.login.showPassword}
                onClick={() => setPasswordVisible((visible) => !visible)}
              >
                {passwordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </Button>
            </div>
          </div>

          <Button
            className="login-submit"
            type="submit"
            disabled={submitting || isLocked || !username.trim() || !password}
          >
            <span>{id.login.submit}</span>
            {submitting ? null : <ArrowRight size={20} aria-hidden="true" />}
          </Button>

          <p className="login-security-note">
            <LockKeyhole size={15} aria-hidden="true" />
            <span>{id.login.security}</span>
          </p>
        </form>
      </section>
    </main>
  );
}
