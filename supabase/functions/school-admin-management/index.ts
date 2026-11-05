import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("ADMIN_ALLOWED_ORIGIN") ?? "https://dach1980.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "POST required" });

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return json(500, { error: "Server secrets are not configured" });

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json(401, { error: "Authentication required" });

  const caller = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: userError } = await caller.auth.getUser();
  if (userError || !user || !user.email_confirmed_at) return json(401, { error: "A verified account is required" });

  const { data: role, error: roleError } = await caller.from("school_admins")
    .select("role,is_active").eq("user_id", user.id).maybeSingle();
  if (roleError || !role?.is_active || role.role !== "owner") return json(403, { error: "School owner permission required" });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON body" }); }

  const audit = async (action: string, entityId: string, before: unknown, after: unknown) => {
    await admin.from("school_admin_audit").insert({
      actor_user_id: user.id, action, entity_type: "auth_user", entity_id: entityId,
      before_data: before ?? null, after_data: after ?? null
    });
  };

  if (body.action === "list_users") {
    const page = Math.max(1, Math.min(100, Number(body.page ?? 1)));
    const perPage = Math.max(1, Math.min(100, Number(body.per_page ?? 50)));
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) return json(400, { error: error.message });
    return json(200, { users: (data.users ?? []).map((u) => ({
      id: u.id, email: u.email, created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at, email_confirmed_at: u.email_confirmed_at,
      banned_until: u.banned_until
    })) });
  }

  if (body.action === "set_user_status") {
    const targetId = String(body.user_id ?? "");
    const active = body.active === true;
    if (!/^[0-9a-f-]{36}$/i.test(targetId)) return json(400, { error: "Valid user_id is required" });
    if (targetId === user.id && !active) return json(400, { error: "You cannot suspend your own owner account" });
    const { data: target, error: lookupError } = await admin.auth.admin.getUserById(targetId);
    if (lookupError || !target.user) return json(404, { error: "User not found" });
    const { data, error } = await admin.auth.admin.updateUserById(targetId, {
      ban_duration: active ? "none" : "876000h"
    });
    if (error) return json(400, { error: error.message });
    await audit(active ? "auth_user_activated" : "auth_user_suspended", targetId,
      { banned_until: target.user.banned_until }, { banned_until: data.user?.banned_until ?? null });
    return json(200, { success: true, user_id: targetId, active });
  }

  if (body.action === "grant_admin") {
    const targetId = String(body.user_id ?? "");
    const newRole = String(body.role ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(targetId) || !["owner", "editor"].includes(newRole))
      return json(400, { error: "Valid user_id and role are required" });
    const { data: target, error: lookupError } = await admin.auth.admin.getUserById(targetId);
    if (lookupError || !target.user || !target.user.email_confirmed_at)
      return json(400, { error: "Target must be an existing email-verified user" });
    const { data: previous } = await admin.from("school_admins").select("*").eq("user_id", targetId).maybeSingle();
    const { error } = await admin.from("school_admins").upsert({
      user_id: targetId, role: newRole, is_active: true, granted_by: user.id
    }, { onConflict: "user_id" });
    if (error) return json(400, { error: error.message });
    await audit("admin_role_granted", targetId, previous, { role: newRole, is_active: true });
    return json(200, { success: true, user_id: targetId, role: newRole });
  }

  if (body.action === "revoke_admin") {
    const targetId = String(body.user_id ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(targetId)) return json(400, { error: "Valid user_id is required" });
    if (targetId === user.id) return json(400, { error: "You cannot revoke your own owner role" });
    const { data: previous } = await admin.from("school_admins").select("*").eq("user_id", targetId).maybeSingle();
    const { error } = await admin.from("school_admins").update({ is_active: false }).eq("user_id", targetId);
    if (error) return json(400, { error: error.message });
    await audit("admin_role_revoked", targetId, previous, { is_active: false });
    return json(200, { success: true, user_id: targetId });
  }

  return json(400, { error: "Unknown action" });
});
