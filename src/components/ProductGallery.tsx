"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  name,
  images,
  isNew,
  soldOut,
}: {
  name: string;
  images: string[];
  isNew?: boolean;
  soldOut?: boolean;
}) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const current = list[active] ?? list[0] ?? "";
  const hasMany = list.length > 1;

  if (!current) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--mist)]" />
    );
  }

  function go(delta: number) {
    if (!hasMany) return;
    setActive((i) => (i + delta + list.length) % list.length);
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--mist)]">
        <Image
          src={current}
          alt={`${name}${hasMany ? ` — foto ${active + 1}` : ""}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {soldOut ? (
          <span className="absolute top-4 left-4 z-[1] bg-[var(--accent)] px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
            Agotado
          </span>
        ) : isNew ? (
          <span className="absolute top-4 left-4 z-[1] bg-[var(--ink)] px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
            Nuevo
          </span>
        ) : null}

        {hasMany && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-2 z-[1] -translate-y-1/2 bg-white/90 px-2 py-3 text-sm text-[var(--ink)]"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={() => go(1)}
              className="absolute top-1/2 right-2 z-[1] -translate-y-1/2 bg-white/90 px-2 py-3 text-sm text-[var(--ink)]"
            >
              ›
            </button>
            <span className="absolute right-3 bottom-3 z-[1] bg-black/55 px-2 py-1 text-[10px] tracking-wide text-white uppercase">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--mist)] ${
                i === active
                  ? "ring-2 ring-[var(--ink)]"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Ver foto ${i + 1}`}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
