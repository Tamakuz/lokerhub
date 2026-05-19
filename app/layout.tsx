import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lokerhub.vercel.app"),
  title: {
    default: "LokerHub | Lowongan Kerja Indonesia dari Banyak Sumber",
    template: "%s | LokerHub",
  },
  description: "Temukan lowongan kerja Indonesia dari berbagai sumber dalam satu tempat.",
  openGraph: {
    title: "LokerHub",
    description: "Cari, filter, simpan, dan cocokkan CV dengan lowongan kerja Indonesia dari berbagai sumber.",
    siteName: "LokerHub",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LokerHub",
    description: "Temukan lowongan kerja Indonesia dari berbagai sumber dalam satu tempat.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="bg-cream text-ink antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
