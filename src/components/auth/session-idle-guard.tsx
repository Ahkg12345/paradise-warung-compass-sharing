import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { hasSessionExpiredFromInactivity, SESSION_IDLE_TIMEOUT_MS } from "@/lib/session-timeout";

const activityStorageKey = "kedai-paradise:last-activity";

export function SessionIdleGuard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    let authenticated = false;
    let signingOut = false;
    let lastActivityAt = Date.now();
    let lastStorageWriteAt = 0;

    const setActivityTimestamp = (timestamp: number) => {
      lastActivityAt = timestamp;
      lastStorageWriteAt = timestamp;
      window.localStorage.setItem(activityStorageKey, String(timestamp));
    };

    const restoreActivityTimestamp = () => {
      const stored = Number(window.localStorage.getItem(activityStorageKey));
      const now = Date.now();
      if (Number.isFinite(stored) && stored > 0 && stored <= now) {
        lastActivityAt = stored;
      } else {
        setActivityTimestamp(now);
      }
    };

    const signOutForInactivity = async () => {
      if (!authenticated || signingOut) return;
      signingOut = true;
      authenticated = false;
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      window.localStorage.removeItem(activityStorageKey);
      await navigate({ to: "/login", replace: true });
    };

    const checkExpiry = () => {
      if (authenticated && hasSessionExpiredFromInactivity(lastActivityAt, Date.now())) {
        void signOutForInactivity();
        return true;
      }
      return false;
    };

    const recordActivity = () => {
      if (!authenticated || checkExpiry()) return;
      const now = Date.now();
      lastActivityAt = now;
      if (now - lastStorageWriteAt >= 1_000) {
        lastStorageWriteAt = now;
        window.localStorage.setItem(activityStorageKey, String(now));
      }
    };

    const handleResume = () => {
      if (document.visibilityState !== "visible") return;
      if (!checkExpiry()) recordActivity();
    };

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      authenticated = session !== null;
      if (!session) {
        window.localStorage.removeItem(activityStorageKey);
      } else if (event === "SIGNED_IN") {
        setActivityTimestamp(Date.now());
      } else {
        restoreActivityTimestamp();
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      authenticated = data.session !== null;
      if (authenticated) restoreActivityTimestamp();
    });

    const interval = window.setInterval(checkExpiry, Math.min(30_000, SESSION_IDLE_TIMEOUT_MS));
    const activityEvents: Array<keyof WindowEventMap> = [
      "pointerdown",
      "pointermove",
      "keydown",
      "touchstart",
      "scroll",
    ];
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, recordActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("focus", handleResume);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === activityStorageKey && event.newValue) {
        const timestamp = Number(event.newValue);
        if (Number.isFinite(timestamp) && timestamp > lastActivityAt) lastActivityAt = timestamp;
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearInterval(interval);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity));
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("focus", handleResume);
      window.removeEventListener("storage", handleStorage);
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  return null;
}
