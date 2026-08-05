import { whatsappUrl } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-2 bg-[#1f6b45] px-3 py-3 text-xs font-medium tracking-[0.14em] text-white uppercase shadow-lg transition hover:bg-[#185536] sm:right-6 sm:bottom-6 sm:px-4"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.93.52 3.72 1.43 5.28L2 22l5.07-1.52a9.86 9.86 0 0 0 4.97 1.35h.01c5.46 0 9.89-4.4 9.89-9.83S17.5 2 12.04 2zm5.76 13.9c-.24.67-1.4 1.23-1.93 1.31-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.82-4.2-4.96-4.4-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.54c.17 0 .4-.06.63.48.24.56.81 1.94.88 2.08.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.37-.42.5-.14.14-.28.29-.12.56.16.28.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.37-.23.63-.14.26.1 1.66.78 1.95.92.28.14.47.21.54.33.07.12.07.69-.17 1.36z" />
      </svg>
      <span className="hidden min-[380px]:inline">Ayuda</span>
    </a>
  );
}
