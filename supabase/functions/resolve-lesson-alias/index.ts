import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  Deno.env.get("ADMIN_ALLOWED_ORIGIN") ?? "https://dach1980.github.io"
]);
const json = (status: number, body: unknown, origin: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
      "Vary": "Origin"
    }
  });

Deno.serve(async (req: Request) => {
  const requestOrigin = req.headers.get("Origin") ?? "";
  const origin = allowedOrigins.has(requestOrigin) ? requestOrigin : [...allowedOrigins][0];
  if (req.method === "OPTIONS") return new Response("ok", {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin"
    }
  });
  if (req.method !== "POST") return json(405, { error: "POST required" }, origin);
  if (requestOrigin && !allowedOrigins.has(requestOrigin)) return json(403, { error: "Origin not allowed" }, origin);

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) return json(500, { error: "Server secrets are not configured" }, origin);

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json(401, { error: "Authentication required" }, origin);

  const caller = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: userError } = await caller.auth.getUser();
  if (userError || !user || !user.email_confirmed_at) return json(401, { error: "A verified account is required" }, origin);

  const { data: role, error: roleError } = await caller.from("school_admins")
    .select("role,is_active").eq("user_id", user.id).maybeSingle();
  if (roleError || !role?.is_active || !["owner", "editor"].includes(role.role))
    return json(403, { error: "Active school administrator permission required" }, origin);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json(400, { error: "Invalid JSON body" }, origin); }
  const sourceSystem = String(body.source_system ?? "");
  const aliasKind = String(body.alias_kind ?? "");
  const aliasValue = String(body.alias_value ?? "").trim();
  const locale = body.locale == null || body.locale === "" ? null : String(body.locale);
  const sources = ["catalog_v2", "static_site", "supabase.lesson_catalog"];
  const kinds = ["legacy_id", "v2_id", "localized_url", "lesson_id"];
  if (!sources.includes(sourceSystem) || !kinds.includes(aliasKind) ||
      !aliasValue || aliasValue.length > 512 ||
      (locale !== null && !["ru", "en", "zh"].includes(locale)))
    return json(400, { error: "Invalid alias lookup parameters" }, origin);
  if ((sourceSystem === "static_site") !== (aliasKind === "localized_url") ||
      (sourceSystem === "supabase.lesson_catalog") !== (aliasKind === "lesson_id") ||
      (sourceSystem === "catalog_v2" && !["legacy_id", "v2_id"].includes(aliasKind)))
    return json(400, { error: "Alias source and kind do not match" }, origin);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await admin.rpc("resolve_lesson_uid_aliases", {
    p_source_system: sourceSystem,
    p_alias_kind: aliasKind,
    p_alias_value: aliasValue,
    p_locale: locale
  });
  if (error) {
    // Do not expose database details. A missing migration is reported as unavailable.
    return json(503, { error: "Alias registry is unavailable. Confirm migration 008 is applied to this Supabase project." }, origin);
  }
  return json(200, {
    alias: { source_system: sourceSystem, alias_kind: aliasKind, alias_value: aliasValue, locale },
    matches: (data ?? []).map((row: Record<string, unknown>) => ({
      lesson_uid: row.lesson_uid,
      display_code: row.display_code,
      mapping_state: row.mapping_state,
      is_published: row.is_published,
      access_behavior: "resolve_only"
    }))
  }, origin);
});
