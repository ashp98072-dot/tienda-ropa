"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SeedButton() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function seed() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/seed", { method: "POST" });
    const data = (await res.json()) as {
      seeded?: boolean;
      count?: number;
      error?: string;
    };
    setLoading(false);
    if (!res.ok) {
      setMsg(data.error ?? "Error");
      return;
    }
    setMsg(
      data.seeded
        ? `Se cargaron ${data.count} productos demo.`
        : `Ya había ${data.count} productos. No se duplicó.`,
    );
    router.refresh();
  }

  return (
    <div>
      <button
        type="button"
        onClick={seed}
        disabled={loading}
        className="border border-black/15 px-5 py-3 text-xs tracking-[0.18em] uppercase disabled:opacity-50"
      >
        {loading ? "Cargando…" : "Cargar productos demo"}
      </button>
      {msg && <p className="mt-2 text-xs text-[var(--muted)]">{msg}</p>}
    </div>
  );
}
