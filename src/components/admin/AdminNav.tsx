"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/brand/logo-transparent.png"
            alt="I NEED YOU"
            width={40}
            height={48}
            className="h-10 w-auto object-contain"
          />
          <div>
            <p className="text-[10px] tracking-[0.18em] text-[var(--muted)] uppercase">
              Panel admin
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-xs tracking-[0.14em] uppercase">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href ||
                (l.href !== "/admin" && pathname.startsWith(l.href))
                  ? "text-[var(--accent)]"
                  : "text-[var(--ink)] hover:opacity-70"
              }
            >
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
    </header>
  );
}
