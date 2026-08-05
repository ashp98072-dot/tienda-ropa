"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function linkClass(href: string) {
    const active =
      pathname === href ||
      (href !== "/admin" && pathname.startsWith(href));
    return active
      ? "text-[var(--accent)]"
      : "text-[var(--ink)] hover:opacity-70";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
        <Link href="/admin" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/brand/logo-transparent.png"
            alt="I NEED YOU"
            width={40}
            height={48}
            className="h-9 w-auto object-contain sm:h-10"
          />
          <p className="truncate text-[10px] tracking-[0.18em] text-[var(--muted)] uppercase">
            Panel admin
          </p>
        </Link>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-black/10 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex w-4 flex-col gap-1">
            <span className={`h-px w-full bg-[var(--ink)] transition ${open ? "translate-y-[2.5px] rotate-45" : ""}`} />
            <span className={`h-px w-full bg-[var(--ink)] transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-full bg-[var(--ink)] transition ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
          </div>
        </button>

        <nav className="hidden flex-wrap items-center gap-4 text-xs tracking-[0.14em] uppercase md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          <Link href="/" className="text-[var(--muted)] hover:text-[var(--ink)]">
            Ver tienda
          </Link>
          <button
            type="button"
            onClick={logout}
            className="text-[var(--muted)] hover:text-[var(--accent)]"
          >
            Salir
          </button>
        </nav>
      </div>

      {open && (
        <nav className="border-t border-black/10 bg-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-sm tracking-[0.12em] uppercase">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass(l.href)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" className="text-[var(--muted)]">
                Ver tienda
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={logout}
                className="text-[var(--muted)]"
              >
                Salir
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
