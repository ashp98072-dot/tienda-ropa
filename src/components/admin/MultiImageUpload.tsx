"use client";

import { useState } from "react";

export function MultiImageUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const images = value.filter(Boolean);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await res.json()) as { url?: string; error?: string };
    setUploading(false);
    if (!res.ok || !data.url) {
      setError(data.error ?? "No se pudo subir");
      return;
    }
    onChange([...images, data.url]);
  }

  function addUrl() {
    const url = urlDraft.trim();
    if (!url) return;
    onChange([...images, url]);
    setUrlDraft("");
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function setPrimary(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--muted)]">
        Solo el panel admin puede subir fotos. En la tienda el cliente solo ve
        las imágenes del producto (sin este formulario ni links de subida).
      </p>

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, i) => (
            <li
              key={`${url}-${i}`}
              className="relative border border-black/10 bg-white p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Foto ${i + 1}`}
                className="h-36 w-full object-cover bg-[var(--mist)]"
              />
              <p className="mt-1 text-[10px] tracking-wide text-[var(--muted)] uppercase">
                {i === 0 ? "Principal" : `Foto ${i + 1}`}
              </p>
              <div className="mt-1 flex flex-wrap gap-2 text-[10px]">
                {i > 0 && (
                  <button
                    type="button"
                    className="underline"
                    onClick={() => setPrimary(i)}
                  >
                    Hacer principal
                  </button>
                )}
                <button
                  type="button"
                  className="text-[var(--accent)] underline"
                  onClick={() => removeAt(i)}
                >
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <label className="block text-sm">
        Subir otra foto (celular o PC)
        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
          JPG/PNG hasta 5 MB. Se guarda en Supabase Storage.
        </span>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          className="mt-2 block w-full text-xs"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm">
          O pegar URL de imagen (opcional)
          <input
            className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://..."
          />
        </label>
        <button
          type="button"
          onClick={addUrl}
          className="border border-black/15 px-4 py-2 text-xs tracking-[0.14em] uppercase"
        >
          Agregar URL
        </button>
      </div>

      {uploading && (
        <p className="text-xs text-[var(--muted)]">Subiendo…</p>
      )}
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
