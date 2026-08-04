"use client";

import { useState } from "react";

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    onChange(data.url);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm">
        URL de imagen
        <input
          className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... o sube un archivo abajo"
        />
      </label>
      <label className="block text-sm">
        Subir imagen (Supabase Storage)
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          className="mt-1 block w-full text-xs"
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </label>
      {uploading && (
        <p className="text-xs text-[var(--muted)]">Subiendo…</p>
      )}
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Vista previa"
          className="mt-2 h-40 w-32 object-cover bg-[var(--mist)]"
        />
      )}
    </div>
  );
}
