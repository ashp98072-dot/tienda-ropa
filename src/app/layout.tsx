import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { StoreChrome } from "@/components/StoreChrome";
import { WishlistProvider } from "@/components/WishlistProvider";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "I NEED YOU | Crea tu estilo",
    template: "%s | I NEED YOU",
  },
  description:
    "Tienda de ropa para niños, adolescentes y adultos en Guatemala. Envíos a todo el país. Crea tu estilo con I NEED YOU.",
  keywords: [
    "ropa Guatemala",
    "I NEED YOU",
    "INEEDYOUGT",
    "moda adolescentes",
    "ropa niños",
    "tienda online Guatemala",
  ],
  applicationName: "I NEED YOU",
  authors: [{ name: "I NEED YOU" }],
  creator: "I NEED YOU",
  publisher: "I NEED YOU",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/brand/favicon-32.png"],
  },
  openGraph: {
    type: "website",
    locale: "es_GT",
    siteName: "I NEED YOU",
    title: "I NEED YOU | Crea tu estilo",
    description:
      "Moda para niños, adolescentes y adultos. Envíos a todo Guatemala.",
    url: siteUrl,
    images: [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "I NEED YOU — Crea tu estilo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "I NEED YOU | Crea tu estilo",
    description:
      "Moda para niños, adolescentes y adultos. Envíos a todo Guatemala.",
    images: ["/brand/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <CartProvider>
          <WishlistProvider>
            <StoreChrome>{children}</StoreChrome>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
