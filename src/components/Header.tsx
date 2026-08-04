"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { SearchBar } from "./SearchBar";
import { useWishlist } from "./WishlistProvider";

const nav = [
  { href: "/tienda", label: "Tienda" },
  { href: "/tienda?segmento=ninos", label: "Niños" },
  { href: "/tienda?segmento=adolescentes", label: "Adolescentes" },
  { href: "/tienda?segmento=adultos", label: "Adultos" },
];

export function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { count: wishCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const solid = !isHome || scrolled || open || searchOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "border-b border-[var(--ink)]/10 bg-[var(--paper)]/95 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <button
          type="button"
          className={`relative z-10 flex h-10 w-10 items-center justify-center lg:hidden ${
            solid ? "text-[var(--ink)]" : "text-white"
          }`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menú</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </div>
        </button>

        <Link
          href="/"
          className={`font-[family-name:var(--font-display)] text-xl tracking-[0.12em] uppercase sm:text-2xl ${
            solid ? "text-[var(--ink)]" : "text-white"
          }`}
        >
          I Need You
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-medium tracking-[0.18em] uppercase transition hover:opacity-70 ${
                solid ? "text-[var(--ink)]" : "text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className={`relative z-10 flex items-center gap-3 sm:gap-4 ${
            solid ? "text-[var(--ink)]" : "text-white"
          }`}
        >
          <button
            type="button"
            aria-label="Buscar"
            className="hidden text-xs font-medium tracking-[0.14em] uppercase sm:inline"
            onClick={() => setSearchOpen((v) => !v)}
          >
            Buscar
          </button>
          <Link
            href="/deseos"
            className="relative text-xs font-medium tracking-[0.14em] uppercase"
          >
            Deseos
            {wishCount > 0 && (
              <span
                className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[10px] ${
                  solid
                    ? "bg-[var(--accent)] text-white"
                    : "bg-white text-[var(--ink)]"
                }`}
              >
                {wishCount}
              </span>
            )}
          </Link>
          <Link
            href="/carrito"
            className="relative flex h-10 items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase"
          >
            Bolsa
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[10px] ${
                solid
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "bg-white text-[var(--ink)]"
              }`}
            >
              {itemCount}
            </span>
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={null}>
              <SearchBar className="max-w-md" />
            </Suspense>
          </div>
        </div>
      )}

      {open && (
        <div className="border-t border-[var(--ink)]/10 bg-[var(--paper)] px-4 py-6 lg:hidden">
          <Suspense fallback={null}>
            <SearchBar className="mb-5" />
          </Suspense>
          <nav className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/deseos"
              className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]"
            >
              Lista de deseos
            </Link>
            <Link
              href="/checkout"
              className="mt-2 text-sm tracking-[0.14em] uppercase text-[var(--accent)]"
            >
              Finalizar compra
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
