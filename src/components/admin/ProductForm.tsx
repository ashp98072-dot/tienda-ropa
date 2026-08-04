"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  CATEGORY_LABELS,
  GENDER_LABELS,
  SEGMENT_LABELS,
} from "@/lib/products";
import type { Category, Gender, Product, Segment } from "@/lib/types";
import { ImageUpload } from "./ImageUpload";

const empty: Omit<Product, "id"> = {
  slug: "",
  name: "",
  price: 0,
  description: "",
  category: "tops",
  segment: "adultos",
  gender: "mujer",
  sizes: ["S", "M", "L"],
  colors: ["Negro"],
  image: "",
  isNew: true,
  featured: false,
  active: true,
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Product, "id"> | Product>(
    product ?? empty,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      price: Number(form.price),
      sizes:
        typeof form.sizes === "string"
          ? String(form.sizes)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : form.sizes,
      colors:
        typeof form.colors === "string"
          ? String(form.colors)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : form.colors,
    };

    const res = await fetch(
      product ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const data = (await res.json()) as { error?: string; product?: Product };
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo guardar");
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  const input =
    "mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {error && (
        <p className="border border-[var(--accent)]/40 bg-[var(--accent)]/5 px-3 py-2 text-sm text-[var(--accent)]">
          {error}
        </p>
      )}

      <label className="block text-sm">
        Nombre
        <input
          className={input}
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Precio (Q)
          <input
            type="number"
            min={0}
            step="0.01"
            className={input}
            required
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </label>
        <label className="block text-sm">
          Slug (URL)
          <input
            className={input}
            placeholder="auto si lo dejas vacío"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </label>
      </div>

      <label className="block text-sm">
        Descripción
        <textarea
          className={input}
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>

      <ImageUpload
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          Segmento
          <select
            className={input}
            value={form.segment}
            onChange={(e) =>
              setForm({ ...form, segment: e.target.value as Segment })
            }
          >
            {(Object.keys(SEGMENT_LABELS) as Segment[]).map((k) => (
              <option key={k} value={k}>
                {SEGMENT_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Género
          <select
            className={input}
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value as Gender })
            }
          >
            {(Object.keys(GENDER_LABELS) as Gender[]).map((k) => (
              <option key={k} value={k}>
                {GENDER_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Categoría
          <select
            className={input}
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as Category })
            }
          >
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((k) => (
              <option key={k} value={k}>
                {CATEGORY_LABELS[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        Tallas (separadas por coma)
        <input
          className={input}
          value={form.sizes.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              sizes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </label>

      <label className="block text-sm">
        Colores (separados por coma)
        <input
          className={input}
          value={form.colors.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              colors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </label>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(form.isNew)}
            onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
          />
          Nuevo
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Destacado
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active !== false}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Visible en tienda
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-[var(--ink)] px-5 py-3 text-xs tracking-[0.18em] text-white uppercase disabled:opacity-50"
      >
        {saving ? "Guardando…" : "Guardar producto"}
      </button>
    </form>
  );
}
