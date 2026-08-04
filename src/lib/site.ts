/** Datos de contacto — preferir variables de entorno en producción */
export const SITE = {
  brand: "I NEED YOU",
  tagline: "Crea tu estilo",
  get whatsapp() {
    return process.env.NEXT_PUBLIC_WHATSAPP || "50200000000";
  },
  whatsappMessage: "Hola, quiero asesoría sobre I NEED YOU",
};

export function whatsappUrl(message: string = SITE.whatsappMessage): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
