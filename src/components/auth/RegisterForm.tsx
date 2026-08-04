"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase-browser";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (data.session) {
      router.push("/cuenta");
      router.refresh();
      return;
    }
    setInfo(
      "Cuenta creada. Si tu proyecto pide confirmar correo, revisa tu bandeja. Si no, inicia sesión.",
    );
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
      {info && (
        <p className="border border-black/10 bg-[var(--mist)] px-3 py-2 text-sm">
          {info}{" "}
          <Link href="/cuenta/login" className="underline">
            Ir a login
          </Link>
        </p>
      )}
      <label className="block text-sm">
        Nombre completo
        <input
          required
          className={input}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label className="block text-sm">
        Teléfono / WhatsApp
        <input
          required
          className={input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
      </label>
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
        Contraseña (mín. 6)
        <input
          type="password"
          required
          minLength={6}
          className={input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--ink)] px-4 py-3 text-xs tracking-[0.18em] text-white uppercase disabled:opacity-50"
      >
        {loading ? "Creando…" : "Crear cuenta"}
      </button>
      <p className="text-center text-sm text-[var(--muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link href="/cuenta/login" className="text-[var(--accent)] underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
