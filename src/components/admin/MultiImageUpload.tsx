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
        Subir foto
        <span className="mt-1 block text-xs font-normal text-[var(--muted)]">
          Desde tu celular o PC · JPG/PNG hasta 5 MB. Todas se muestran en la
          ficha del producto (el cliente puede cambiar entre ellas).
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

      {uploading && (
        <p className="text-xs text-[var(--muted)]">Subiendo…</p>
      )}
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
