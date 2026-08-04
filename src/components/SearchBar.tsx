"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export function SearchBar({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    const value = q.trim();
    if (value) next.set("q", value);
    else next.delete("q");
    router.push(`/tienda?${next.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar…"
        aria-label="Buscar productos"
        className={`w-full border bg-transparent py-2 pr-9 pl-3 text-sm outline-none placeholder:opacity-60 focus:border-[var(--accent)] ${
          light
            ? "border-white/40 text-white placeholder:text-white/60"
            : "border-[var(--ink)]/15 text-[var(--ink)]"
        }`}
      />
      <button
        type="submit"
        className={`absolute top-1/2 right-2 -translate-y-1/2 ${
          light ? "text-white/80" : "text-[var(--muted)]"
        }`}
        aria-label="Buscar"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4 4" />
        </svg>
      </button>
    </form>
  );
}
