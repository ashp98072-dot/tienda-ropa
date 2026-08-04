import Image from "next/image";

type Props = {
  className?: string;
  height?: number;
  priority?: boolean;
  /** Versión blanca para fondos oscuros */
  variant?: "dark" | "light";
};

export function BrandLogo({
  className = "",
  height = 48,
  priority = false,
  variant = "dark",
}: Props) {
  const src =
    variant === "light" ? "/brand/logo-white.png" : "/brand/logo-transparent.png";

  return (
    <Image
      src={src}
      alt="I NEED YOU — Crea tu estilo"
      width={Math.round(height * 0.85)}
      height={height}
      priority={priority}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}
