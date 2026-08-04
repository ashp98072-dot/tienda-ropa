import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isSupabasePublicConfigured,
} from "./supabase-public";

export async function createServerSupabase() {
  if (!isSupabasePublicConfigured()) {
    throw new Error("Supabase public keys no configuradas");
  }

  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* set desde Server Component a veces falla; el middleware refresca sesión */
        }
      },
    },
  });
}

export async function getSessionUser() {
  if (!isSupabasePublicConfigured()) return null;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}
