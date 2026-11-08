import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getStaffAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [adminResult, cashierResult, profileResult] = await Promise.all([
      context.supabase.rpc("has_role", {
        _user_id: context.userId,
        _role: "admin",
      }),
      context.supabase.rpc("has_role", {
        _user_id: context.userId,
        _role: "cashier",
      }),
      context.supabase
        .from("users")
        .select("username, name, status")
        .eq("auth_id", context.userId)
        .maybeSingle(),
    ]);

    if (adminResult.error || cashierResult.error || profileResult.error) {
      throw new Error("Tidak dapat memverifikasi akses akun.");
    }

    const admin = adminResult.data;
    const cashier = cashierResult.data;
    const profile = profileResult.data;
    if ((!admin && !cashier) || !profile || !profile.status) return null;

    return {
      role: admin ? ("admin" as const) : ("cashier" as const),
      name: profile.name,
      username: profile.username,
    };
  });
