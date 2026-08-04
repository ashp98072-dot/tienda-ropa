import type { Category, Gender, Segment } from "./types";

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

export const CATEGORY_LABELS: Record<Category, string> = {
  blusas: "Blusas",
  jeans: "Jeans",
  sets: "Sets",
  vestidos: "Vestidos",
  shorts: "Shorts",
  accesorios: "Accesorios",
  tops: "Tops",
};

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
