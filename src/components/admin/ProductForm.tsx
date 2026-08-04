"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { GENDER_LABELS, SEGMENT_LABELS } from "@/lib/products";
import type { Gender, Product, Segment } from "@/lib/types";
import { MultiImageUpload } from "./MultiImageUpload";

function parseList(value: string) {
  return value
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function productImages(product?: Product) {
  if (!product) return [];
  if (product.images?.length) return product.images.filter(Boolean);
  return product.image ? [product.image] : [];
}

type Cat = { slug: string; name: string };

const empty = {
  name: "",
  price: 0,
  description: "",
  category: "tops",
  segment: "adultos" as Segment,
  gender: "mujer" as Gender,
  isNew: true,
  featured: false,
  active: true,
  inStock: true,
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...empty,
    ...(product
      ? {
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          segment: product.segment,
          gender: product.gender,
          isNew: Boolean(product.isNew),
          featured: Boolean(product.featured),
          active: product.active !== false,
          inStock: product.inStock !== false,
        }
      : null),
  });
  const [sizesText, setSizesText] = useState(
    product?.sizes?.join(", ") ?? "S, M, L",
  );
  const [colorsText, setColorsText] = useState(
    product?.colors?.join(", ") ?? "Negro",
  );
  const [images, setImages] = useState<string[]>(productImages(product));
  const [categories, setCategories] = useState<Cat[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingCat, setAddingCat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d: { categories?: Cat[] }) => {
        setCategories(d.categories ?? []);
      })
      .catch(() => undefined);
  }, []);

  async function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    setAddingCat(true);
    setError(null);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = (await res.json()) as { category?: Cat; error?: string };
    setAddingCat(false);
    if (!res.ok || !data.category) {
      setError(data.error ?? "No se pudo crear la categoría");
      return;
    }
    setCategories((prev) => {
      const next = prev.filter((c) => c.slug !== data.category!.slug);
      return [...next, data.category!].sort((a, b) =>
        a.name.localeCompare(b.name, "es"),
      );
    });
    setForm((f) => ({ ...f, category: data.category!.slug }));
    setNewCategory("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const sizes = parseList(sizesText);
    const colors = parseList(colorsText);
    const gallery = images.filter(Boolean);

    const payload = {
      ...form,
      // slug lo genera el servidor con el nombre
      slug: product?.slug ?? "",
      price: Number(form.price),
      sizes: sizes.length ? sizes : ["S", "M", "L"],
      colors: colors.length ? colors : ["Negro"],
      images: gallery,
      image: gallery[0] ?? "",
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

      <label className="block text-sm">
        Precio (Q)
        <input
          type="number"
          min={0}
          step="0.01"
          className={input}
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
      </label>

      <label className="block text-sm">
        Descripción
        <textarea
          className={input}
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>

      <div className="rounded border border-black/10 bg-[var(--mist)]/40 p-4">
        <p className="mb-1 text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
          Fotos del producto
        </p>
        <p className="mb-3 text-xs text-[var(--muted)]">
          Puedes subir varias. La primera es la principal en el catálogo.
        </p>
        <MultiImageUpload value={images} onChange={setImages} />
      </div>

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
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2 border border-black/10 bg-white p-3 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm">
          Nueva categoría
          <input
            className={input}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Ej. Chaquetas, Faldas…"
          />
        </label>
        <button
          type="button"
          disabled={addingCat || !newCategory.trim()}
          onClick={() => void addCategory()}
          className="border border-black/15 px-4 py-2 text-xs tracking-[0.14em] uppercase disabled:opacity-50"
        >
          {addingCat ? "Creando…" : "Crear categoría"}
        </button>
      </div>

      <label className="block text-sm">
        Tallas
        <input
          className={input}
          value={sizesText}
          onChange={(e) => setSizesText(e.target.value)}
          placeholder="S, M, L, XL"
        />
        <span className="mt-1 block text-xs text-[var(--muted)]">
          Sepáralas con coma. Ejemplo: S, M, L
        </span>
      </label>

      <label className="block text-sm">
        Colores
        <input
          className={input}
          value={colorsText}
          onChange={(e) => setColorsText(e.target.value)}
          placeholder="Negro, Blanco, Rojo"
        />
        <span className="mt-1 block text-xs text-[var(--muted)]">
          Escribe todos juntos separados por coma. Ejemplo: Negro, Blanco
        </span>
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
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.inStock !== false}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
          />
          En existencia
        </label>
      </div>
      <p className="text-xs text-[var(--muted)]">
        Si quitas «En existencia», el producto se muestra como{" "}
        <strong>Agotado</strong> y no se puede añadir a la bolsa.
      </p>

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
