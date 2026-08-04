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

  if (!current) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--mist)]" />
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--mist)]">
        <Image
          src={current}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {soldOut ? (
          <span className="absolute top-4 left-4 bg-[var(--accent)] px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
            Agotado
          </span>
        ) : isNew ? (
          <span className="absolute top-4 left-4 bg-[var(--ink)] px-2 py-1 text-[10px] tracking-[0.16em] text-white uppercase">
            Nuevo
          </span>
        ) : null}
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
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
