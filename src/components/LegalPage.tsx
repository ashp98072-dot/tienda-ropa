import type { ReactNode } from "react";

export function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <header className="mb-10">
        <p className="text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-4xl sm:text-5xl">
          {title}
        </h1>
      </header>
      <div className="space-y-6 text-sm leading-relaxed text-[var(--muted)] [&_h2]:mt-10 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-2xl [&_h2]:text-[var(--ink)] [&_strong]:text-[var(--ink)] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
