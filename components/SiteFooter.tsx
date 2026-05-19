import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Beranda" },
  { href: "/jobs", label: "Browse Lowongan" },
  { href: "/cv-matcher", label: "CV Matcher" },
  { href: "/saved", label: "Tersimpan" },
  { href: "/tips-karier", label: "Tips Karier" },
  { href: "/tentang", label: "Tentang" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3 font-black">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-leaf text-white">LH</span>
            <span className="text-xl">LokerHub</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/65">Agregator lowongan kerja Indonesia untuk menemukan peluang dari berbagai sumber, membandingkan detail penting, dan lanjut melamar di sumber asli.</p>
        </div>
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white/45">Navigasi</h2>
          <div className="mt-4 grid gap-2">
            {footerLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-semibold text-white/70 hover:text-white">{link.label}</Link>)}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white/45">Catatan</h2>
          <p className="mt-3 text-sm leading-6 text-white/70">LokerHub bukan tempat melamar langsung. Kami mengarahkan pelamar ke sumber asli lowongan. Selalu cek detail dan kredibilitas sumber sebelum mengirim data pribadi.</p>
          <p className="mt-5 text-xs font-semibold text-white/40">© 2026 LokerHub. Built for Indonesian job seekers.</p>
        </div>
      </div>
    </footer>
  );
}
