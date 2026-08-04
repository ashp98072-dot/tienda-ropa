import type { Gender, Segment } from "./types";

export const SEGMENT_LABELS: Record<Segment, string> = {
  ninos: "Niños",
  adolescentes: "Adolescentes",
  adultos: "Adultos",
};

export const GENDER_LABELS: Record<Gender, string> = {
  mujer: "Mujer",
  hombre: "Hombre",
  unisex: "Unisex",
  nina: "Niña",
  nino: "Niño",
};

export const CATEGORY_LABELS = {
  blusas: "Blusas",
  jeans: "Jeans",
  sets: "Sets",
  vestidos: "Vestidos",
  shorts: "Shorts",
  accesorios: "Accesorios",
  tops: "Tops",
} as const satisfies Record<string, string>;

export function slugifyCategory(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export const DEPARTMENTS_GT = [
  "Guatemala",
  "Sacatepéquez",
  "Escuintla",
  "Quetzaltenango",
  "Huehuetenango",
  "Alta Verapaz",
  "Baja Verapaz",
  "Chimaltenango",
  "Chiquimula",
  "El Progreso",
  "Izabal",
  "Jalapa",
  "Jutiapa",
  "Petén",
  "Quiché",
  "Retalhuleu",
  "San Marcos",
  "Santa Rosa",
  "Sololá",
  "Suchitepéquez",
  "Totonicapán",
  "Zacapa",
] as const;

export function formatPrice(amount: number): string {
  return `Q${amount.toFixed(2)}`;
}

/** Fecha/hora en zona Guatemala — estable entre servidor y navegador (evita error de hidratación). */
export function formatDateTimeGT(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-GT", {
    timeZone: "America/Guatemala",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}
