import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/catalog";

const benefits = [
  {
    title: "Envíos a todo el país",
    text: "Recibe tu pedido en Guatemala.",
  },
  {
    title: "Pago seguro",
    text: "Tarjeta, contra entrega o transferencia.",
  },
  {
    title: "Por edad y talla",
    text: "Niños, adolescentes y adultos.",
  },
  {
    title: "Asesoría",
    text: "Te ayudamos por WhatsApp.",
  },
];

const segments = [
  {
    href: "/tienda?segmento=ninos",
    title: "Niños",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=900&q=80",
  },
  {
    href: "/tienda?segmento=adolescentes",
    title: "Adolescentes",
    image:
      "https://images.unsplash.com/photo-1523381212134-53a2d8c598bb?w=900&q=80",
  },
  {
    href: "/tienda?segmento=adultos",
    title: "Adultos",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80",
  },
];

export default async function HomePage() {
  const products = await listProducts();
  const featured = products.filter((p) => p.featured);
  const news = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      <Hero />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {benefits.map((b, i) => (
          <div
            key={b.title}
            className="animate-[fade-up_0.7s_ease_both]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
              {b.title}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{b.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
              Categorías
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              Encuentra tu segmento
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {segments.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group relative block aspect-[4/5] overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute bottom-6 left-6 font-[family-name:var(--font-display)] text-3xl text-white">
                {s.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
              Nuevo ingreso
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              Recién llegado
            </h2>
          </div>
          <Link
            href="/tienda"
            className="hidden text-xs tracking-[0.18em] uppercase text-[var(--accent)] sm:inline"
          >
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {news.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--ink)]/10 bg-[var(--mist)]/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
              Destacados
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              Los más pedidos
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-[var(--ink)]/70" />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
          <p className="font-[family-name:var(--font-display)] text-4xl text-white sm:text-5xl">
            Crea tu estilo
          </p>
          <p className="mx-auto mt-4 max-w-md text-white/75">
            Pequeños detalles, gran impacto. Descubre prendas para cada etapa.
          </p>
          <Link
            href="/tienda"
            className="mt-8 inline-flex bg-white px-7 py-3.5 text-xs font-semibold tracking-[0.22em] text-[var(--ink)] uppercase transition hover:bg-[var(--accent)] hover:text-white"
          >
            Explorar tienda
          </Link>
        </div>
      </section>
    </>
  );
}
