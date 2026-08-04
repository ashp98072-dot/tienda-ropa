"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Contraseña incorrecta");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center">
      <p className="text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
        I Need You
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
        Admin
      </h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </label>
        {error && <p className="text-sm text-[var(--accent)]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--ink)] px-4 py-3 text-xs tracking-[0.18em] text-white uppercase disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-xs text-[var(--muted)]">
        Por defecto en local: <code>ineedyou-admin</code> (cambia{" "}
        <code>ADMIN_PASSWORD</code> en .env)
      </p>
    </div>
  );
}
