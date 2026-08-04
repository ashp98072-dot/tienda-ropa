import Image from "next/image";

type Props = {
  className?: string;
  /** Altura del logo en el header */
  height?: number;
  priority?: boolean;
  /** Para header sobre foto oscura */
  invert?: boolean;
};

export function BrandLogo({
  className = "",
  height = 48,
  priority = false,
  invert = false,
}: Props) {
  // Proporción aproximada del logo vertical
  const width = Math.round(height * 0.85);

  return (
    <Image
      src="/brand/logo.png"
      alt="I NEED YOU — Crea tu estilo"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto object-contain ${invert ? "brightness-0 invert" : ""} ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}
