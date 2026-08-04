"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/cuenta");
    router.refresh();
  }

  const input =
    "mt-1 w-full border border-[var(--ink)]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      {error && (
        <p className="border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-3 py-2 text-sm text-[var(--accent)]">
          {error}
        </p>
      )}
      <label className="block text-sm">
        Correo
        <input
          type="email"
          required
          className={input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <label className="block text-sm">
        Contraseña
        <input
          type="password"
          required
          minLength={6}
          className={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--ink)] px-4 py-3 text-xs tracking-[0.18em] text-white uppercase disabled:opacity-50"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
      <p className="text-center text-sm text-[var(--muted)]">
        ¿No tienes cuenta?{" "}
        <Link href="/cuenta/registro" className="text-[var(--accent)] underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
