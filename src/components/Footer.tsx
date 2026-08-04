import Image from "next/image";
import Link from "next/link";
import { SITE, whatsappUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--ink)]/10 bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <Image
            src="/brand/logo-white.png"
            alt="I NEED YOU — Crea tu estilo"
            width={120}
            height={140}
            className="h-24 w-auto object-contain"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Moda para niños, adolescentes y adultos. Envíos a todo Guatemala.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
            Explorar
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/tienda" className="hover:text-[var(--accent-soft)]">
                Toda la tienda
              </Link>
            </li>
            <li>
              <Link
                href="/tienda?segmento=ninos"
                className="hover:text-[var(--accent-soft)]"
              >
                Niños
              </Link>
            </li>
            <li>
              <Link
                href="/tienda?segmento=adolescentes"
                className="hover:text-[var(--accent-soft)]"
              >
                Adolescentes
              </Link>
            </li>
            <li>
              <Link
                href="/tienda?segmento=adultos"
                className="hover:text-[var(--accent-soft)]"
              >
                Adultos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
            Ayuda
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/envios" className="hover:text-[var(--accent-soft)]">
                Envíos
              </Link>
            </li>
            <li>
              <Link
                href="/devoluciones"
                className="hover:text-[var(--accent-soft)]"
              >
                Cambios y devoluciones
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="hover:text-[var(--accent-soft)]"
              >
                Contacto
              </Link>
            </li>
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent-soft)]"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] text-white/50 uppercase">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/privacidad"
                className="hover:text-[var(--accent-soft)]"
              >
                Privacidad
              </Link>
            </li>
            <li className="text-white/70">
              Pago seguro con QPayPro / VisaNet
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} INEEDYOUGT · Guatemala
      </div>
    </footer>
  );
}
