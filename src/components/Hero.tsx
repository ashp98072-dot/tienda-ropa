import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center animate-[hero-zoom_18s_ease-out_forwards]"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(ellipse_at_20%_20%,rgba(185,28,60,0.35),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(0,0,0,0.4),transparent_45%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <p className="animate-[fade-up_0.9s_ease_both] font-[family-name:var(--font-display)] text-[2.75rem] leading-none tracking-[0.08em] text-white uppercase sm:text-7xl md:text-8xl lg:text-9xl">
          I Need You
        </p>
        <p className="mt-4 max-w-md animate-[fade-up_0.9s_0.15s_ease_both] text-base text-white/85 sm:text-lg">
          Crea tu estilo. Ropa para niños, adolescentes y adultos — hecha para
          cómo vives.
        </p>
        <div className="mt-8 animate-[fade-up_0.9s_0.28s_ease_both]">
          <Link
            href="/tienda"
            className="inline-flex items-center bg-white px-7 py-3.5 text-xs font-semibold tracking-[0.22em] text-[var(--ink)] uppercase transition hover:bg-[var(--accent)] hover:text-white"
          >
            Ir a tienda
          </Link>
        </div>
      </div>
    </section>
  );
}
