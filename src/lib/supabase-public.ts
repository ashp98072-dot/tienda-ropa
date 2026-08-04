export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
}

/**
 * Key pública para el browser.
 * Auth (signup/login) necesita la key JWT legacy `anon` (empieza con eyJ...).
 * Las nuevas `sb_publishable_...` suelen devolver "Invalid API key" con el cliente actual.
 */
export function getSupabasePublishableKey() {
  const publishable =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  if (anon.startsWith("eyJ")) return anon;
  if (publishable.startsWith("eyJ")) return publishable;
  if (anon) return anon;
  return publishable;
}

export function isSupabasePublicConfigured() {
  return Boolean(getSupabaseUrl() && getSupabasePublishableKey());
}

export function isLegacyAnonKeyConfigured() {
  return getSupabasePublishableKey().startsWith("eyJ");
}
