import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LokerHub",
  description: "Temukan lowongan kerja Indonesia dari berbagai sumber dalam satu tempat.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="bg-cream text-ink antialiased">
        <header className="border-b border-ink/10 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold text-leaf">LokerHub</Link>
            <Link href="/jobs" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90">Browse Jobs</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
