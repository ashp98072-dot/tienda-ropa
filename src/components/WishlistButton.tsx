"use client";

import { useWishlist } from "./WishlistProvider";

export function WishlistButton({
  productId,
  className = "",
  variant = "icon",
}: {
  productId: string;
  className?: string;
  variant?: "icon" | "text";
}) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={() => toggle(productId)}
        className={`text-xs tracking-[0.16em] uppercase transition ${
          active ? "text-[var(--accent)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
        } ${className}`}
      >
        {active ? "En tu lista de deseos" : "Añadir a la lista de deseos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={active ? "Quitar de deseos" : "Añadir a deseos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={`flex h-9 w-9 items-center justify-center bg-white/90 text-[var(--ink)] shadow-sm backdrop-blur transition hover:bg-white ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        <path
          d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.65-7 10-7 10z"
          className={active ? "text-[var(--accent)]" : ""}
        />
      </svg>
    </button>
  );
}
