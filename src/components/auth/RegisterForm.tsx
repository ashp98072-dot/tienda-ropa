"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { safeNextPath } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase-browser";

function friendlyAuthError(message: string) {
  if (/invalid api key/i.test(message)) {
    return "Error de configuración: falta la key anónima JWT de Supabase (anon / eyJ…) en Vercel. No uses solo sb_publishable_.";
  }
  if (/already registered|already been registered|user already/i.test(message)) {
    return "Ese correo ya tiene cuenta. Inicia sesión o usa otro correo.";
  }
  return message;
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function goNext() {
    router.push(next);
    router.refresh();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const supabase = createClient();
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: fullName,
          phone,
        },
      },
    });
    if (err) {
      setLoading(false);
      setError(friendlyAuthError(err.message));
      return;
    }

    if (data.session) {
      setLoading(false);
      goNext();
      return;
    }

    const { data: login, error: loginErr } =
      await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (login.session && !loginErr) {
      goNext();
      return;
    }

    setInfo(
      "Cuenta creada. Si no entras solo, inicia sesión. (Desactiva Confirm email en Supabase para entrada automática.)",
    );
  }

  const input =
    "mt-1 w-full border border-[var(--ink)]/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]";

  const loginHref =
    next !== "/cuenta"
      ? `/cuenta/login?next=${encodeURIComponent(next)}`
      : "/cuenta/login";

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      {next === "/checkout" && (
        <p className="border border-black/10 bg-[var(--mist)] px-3 py-2 text-sm">
          Crea tu cuenta para poder finalizar la compra.
        </p>
      )}
      {error && (
        <p className="border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-3 py-2 text-sm text-[var(--accent)]">
          {error}
        </p>
      )}
      {info && (
        <p className="border border-black/10 bg-[var(--mist)] px-3 py-2 text-sm">
          {info}{" "}
          <Link href={loginHref} className="underline">
            Iniciar sesión
          </Link>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Nombre
          <input
            required
            className={input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
        </label>
        <label className="block text-sm">
          Apellido
          <input
            required
            className={input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
          />
        </label>
      </div>
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
        <Link href={loginHref} className="text-[var(--accent)] underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
