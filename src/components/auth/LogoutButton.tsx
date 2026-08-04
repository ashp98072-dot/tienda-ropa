"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="text-xs tracking-[0.16em] uppercase text-[var(--muted)] hover:text-[var(--accent)]"
    >
      Cerrar sesión
    </button>
  );
}
