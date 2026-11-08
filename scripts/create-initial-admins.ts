import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env["SUPABASE_URL"];
const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const fajarPassword = process.env["KEDAI_ADMIN_FAJAR_PASSWORD"];
const fitriPassword = process.env["KEDAI_ADMIN_FITRI_PASSWORD"];

if (
  !supabaseUrl ||
  !serviceRoleKey ||
  !fajarPassword ||
  !fitriPassword ||
  fajarPassword.length < 8 ||
  fitriPassword.length < 8
) {
  throw new Error(
    "Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, KEDAI_ADMIN_FAJAR_PASSWORD, and KEDAI_ADMIN_FITRI_PASSWORD; each password must be at least 8 characters.",
  );
}

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, flowType: "implicit" },
  global: {
    fetch: (input, init) => {
      const headers = new Headers(
        typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
      );
      if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
      if (serviceRoleKey.startsWith("sb_")) {
        if (headers.get("Authorization") === `Bearer ${serviceRoleKey}`)
          headers.delete("Authorization");
        headers.set("apikey", serviceRoleKey);
      }
      return fetch(input, { ...init, headers });
    },
  },
});

const admins = [
  { username: "fajar", name: "Bapak Fajar", password: fajarPassword },
  { username: "fitri", name: "Ibu Fitri", password: fitriPassword },
] as const;

async function ensureAdminAccount(username: string, name: string, password: string) {
  const email = `${username}@kedaiparadise.local`;
  const existingProfile = await adminClient
    .from("users")
    .select("auth_id")
    .eq("username", username)
    .maybeSingle();

  if (existingProfile.error) throw existingProfile.error;

  let authId = existingProfile.data?.auth_id;
  if (!authId) {
    const existingAccounts = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (existingAccounts.error) throw existingAccounts.error;
    authId = existingAccounts.data.users.find((user) => user.email?.toLowerCase() === email)?.id;

    if (!authId) {
      const created = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (created.error) throw created.error;
      authId = created.data.user.id;
    } else {
      const passwordUpdate = await adminClient.auth.admin.updateUserById(authId, { password });
      if (passwordUpdate.error) throw passwordUpdate.error;
    }

    const profileInsert = await adminClient.from("users").insert({
      auth_id: authId,
      username,
      name,
      status: true,
    });
    if (profileInsert.error) throw profileInsert.error;
  } else {
    const passwordUpdate = await adminClient.auth.admin.updateUserById(authId, { password });
    if (passwordUpdate.error) throw passwordUpdate.error;

    const profileUpdate = await adminClient
      .from("users")
      .update({ name, status: true })
      .eq("username", username);
    if (profileUpdate.error) throw profileUpdate.error;
  }

  const roleResult = await adminClient
    .from("user_roles")
    .upsert({ user_id: authId, role: "admin" }, { onConflict: "user_id,role" });
  if (roleResult.error) throw roleResult.error;
}

for (const admin of admins) {
  await ensureAdminAccount(admin.username, admin.name, admin.password);
  console.log(`Ready: ${admin.username}`);
}

console.log(
  "Initial administrator setup is complete. Remove access to the setup environment after use.",
);
