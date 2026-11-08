import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import { id } from "@/lib/i18n/id";

const loginInput = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-z0-9_]+$/i),
  password: z.string().min(1).max(256),
});

function getTrustedClientIp(): string {
  const request = getRequest();
  return (request.headers.get("cf-connecting-ip") ?? "unknown").trim().slice(0, 45) || "unknown";
}

function createPublishableFetch(apiKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (apiKey.startsWith("sb_") && headers.get("Authorization") === `Bearer ${apiKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", apiKey);
    return fetch(input, { ...init, headers });
  };
}

export const signInWithUsername = createServerFn({ method: "POST" })
  .inputValidator((input) => loginInput.parse(input))
  .handler(async ({ data }) => {
    const username = data.username.toLowerCase();
    const ipAddress = getTrustedClientIp();
    const supabaseUrl = process.env["SUPABASE_URL"];
    const publishableKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!supabaseUrl || !publishableKey) {
      return { ok: false as const, message: id.login.unavailableError };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const authClient = createClient<Database>(supabaseUrl, publishableKey, {
      global: { fetch: createPublishableFetch(publishableKey) },
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });

    const reservation = await supabaseAdmin.rpc("reserve_login_attempt", {
      _username: username,
      _ip_address: ipAddress,
    });
    const attempt = reservation.data?.[0];

    if (reservation.error || !attempt) {
      return { ok: false as const, message: id.login.unavailableError };
    }
    if (attempt.is_locked) {
      return {
        ok: false as const,
        message: id.login.lockedError,
        lockedSeconds: attempt.seconds_remaining,
      };
    }

    const recordFailure = async () => {
      const failureResult = await supabaseAdmin.rpc("record_login_failure", {
        _username: username,
        _ip_address: ipAddress,
      });
      const failure = failureResult.data?.[0];
      if (failureResult.error || !failure) {
        return { ok: false as const, message: id.login.unavailableError };
      }

      return failure.is_locked
        ? {
            ok: false as const,
            message: id.login.lockedError,
            lockedSeconds: failure.seconds_remaining,
          }
        : { ok: false as const, message: id.login.credentialsError };
    };

    const profileResult = await supabaseAdmin
      .from("users")
      .select("auth_id, name, status")
      .eq("username", username)
      .maybeSingle();

    if (profileResult.error) return { ok: false as const, message: id.login.unavailableError };

    const profile = profileResult.data;
    if (!profile || !profile.status) return recordFailure();

    const rolesResult = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", profile.auth_id);

    if (rolesResult.error) return { ok: false as const, message: id.login.unavailableError };

    const role = rolesResult.data?.some(({ role: userRole }) => userRole === "admin")
      ? "admin"
      : rolesResult.data?.some(({ role: userRole }) => userRole === "cashier")
        ? "cashier"
        : null;

    if (!role) return recordFailure();

    const signInResult = await authClient.auth.signInWithPassword({
      email: `${username}@kedaiparadise.local`,
      password: data.password,
    });
    const session = signInResult.data.session;

    if (signInResult.error || !session || session.user.id !== profile.auth_id) {
      return recordFailure();
    }

    const clearResult = await supabaseAdmin.rpc("clear_login_attempts", {
      _username: username,
      _ip_address: ipAddress,
    });

    if (clearResult.error) {
      await supabaseAdmin.rpc("record_login_failure", {
        _username: username,
        _ip_address: ipAddress,
      });
      return { ok: false as const, message: id.login.unavailableError };
    }

    return {
      ok: true as const,
      role,
      name: profile.name,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      },
    };
  });
