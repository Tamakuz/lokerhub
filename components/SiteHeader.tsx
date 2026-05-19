"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/jobs", label: "Browse Lowongan" },
  { href: "/cv-matcher", label: "CV Matcher" },
  { href: "/saved", label: "Tersimpan" },
  { href: "/tips-karier", label: "Tips Karier" },
  { href: "/tentang", label: "Tentang" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-ink/95 text-white shadow-lg shadow-ink/10 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-leaf text-lg text-white shadow-sm">LH</span>
            <span className="text-xl">LokerHub</span>
          </Link>
          <Link href="/jobs" className="rounded-full bg-leaf px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-leaf/90 lg:hidden">Cari</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 lg:items-center lg:overflow-visible lg:pb-0">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${active ? "bg-white text-ink" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <Link href="/jobs" className="hidden rounded-full bg-leaf px-5 py-3 text-sm font-black text-white shadow-sm shadow-leaf/20 hover:bg-leaf/90 lg:inline-flex">Cari Lowongan</Link>
      </nav>
    </header>
  );
}
