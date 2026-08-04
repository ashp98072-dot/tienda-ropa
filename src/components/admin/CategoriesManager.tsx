"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isBuiltinCategory } from "@/lib/products";

type Cat = { slug: string; name: string };

export function CategoriesManager({
  categories: initial,
}: {
  categories: Cat[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    const name = newName.trim();
    if (!name) return;
    setBusy("create");
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = (await res.json()) as { category?: Cat; error?: string };
    setBusy(null);
    if (!res.ok || !data.category) {
      setError(data.error ?? "No se pudo crear");
      return;
    }
    setCategories((prev) =>
      [...prev.filter((c) => c.slug !== data.category!.slug), data.category!].sort(
        (a, b) => a.name.localeCompare(b.name, "es"),
      ),
    );
    setNewName("");
    router.refresh();
  }

  async function save(slug: string) {
    const name = (edits[slug] ?? categories.find((c) => c.slug === slug)?.name ?? "").trim();
    if (!name) return;
    setBusy(slug);
    setError(null);
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = (await res.json()) as { category?: Cat; error?: string };
    setBusy(null);
    if (!res.ok || !data.category) {
      setError(data.error ?? "No se pudo guardar");
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.slug === slug ? data.category! : c)),
    );
    setEdits((e) => {
      const next = { ...e };
      delete next[slug];
      return next;
    });
    router.refresh();
  }

  async function remove(slug: string) {
    if (!confirm("¿Eliminar esta categoría? Los productos que la usan la conservarán en el nombre viejo hasta que los edites.")) {
      return;
    }
    setBusy(slug);
    setError(null);
    const res = await fetch(`/api/admin/categories/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { error?: string };
    setBusy(null);
    if (!res.ok) {
      setError(data.error ?? "No se pudo eliminar");
      return;
    }
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    router.refresh();
  }

  const input =
    "w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";

  return (
    <div className="space-y-6">
      {error && (
        <p className="border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-3 py-2 text-sm text-[var(--accent)]">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2 border border-black/10 bg-white p-4 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm">
          Nueva categoría
          <input
            className={`mt-1 ${input}`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ej. Chaquetas"
          />
        </label>
        <button
          type="button"
          disabled={busy === "create" || !newName.trim()}
          onClick={() => void create()}
          className="bg-[var(--ink)] px-4 py-2 text-xs tracking-[0.14em] text-white uppercase disabled:opacity-50"
        >
          Crear
        </button>
      </div>

      <ul className="divide-y divide-black/10 border border-black/10 bg-white">
        {categories.map((c) => {
          const builtin = isBuiltinCategory(c.slug);
          const value = edits[c.slug] ?? c.name;
          const dirty = value.trim() !== c.name;
          return (
            <li
              key={c.slug}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
            >
              <div className="flex-1">
                <input
                  className={input}
                  value={value}
                  onChange={(e) =>
                    setEdits((prev) => ({ ...prev, [c.slug]: e.target.value }))
                  }
                />
                <p className="mt-1 text-[10px] tracking-wide text-[var(--muted)] uppercase">
                  {builtin ? "Categoría base" : "Personalizada"} · {c.slug}
                </p>
              </div>
              <div className="flex gap-3 text-xs tracking-wide uppercase">
                <button
                  type="button"
                  disabled={!dirty || busy === c.slug}
                  onClick={() => void save(c.slug)}
                  className="text-[var(--accent)] disabled:opacity-40"
                >
                  Guardar
                </button>
                {!builtin && (
                  <button
                    type="button"
                    disabled={busy === c.slug}
                    onClick={() => void remove(c.slug)}
                    className="text-[var(--muted)] hover:text-[var(--accent)]"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
