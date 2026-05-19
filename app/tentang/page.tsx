import Link from "next/link";

export const metadata = {
  title: "Tentang | LokerHub",
  description: "Tentang LokerHub, agregator lowongan kerja Indonesia.",
  alternates: { canonical: "/tentang" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-ink p-6 text-white sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">Tentang LokerHub</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">Satu tempat untuk menemukan lowongan, lalu melamar di sumber asli.</h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/70">LokerHub adalah agregator lowongan kerja Indonesia. Kami merapikan lowongan dari berbagai sumber agar pencari kerja bisa membandingkan peluang dengan lebih cepat dan transparan.</p>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Discover", "Temukan lowongan berdasarkan keyword, lokasi, kategori, sumber, dan tipe kerja."],
          ["Compare", "Bandingkan info penting seperti perusahaan, gaji, freshness, dan sumber lowongan."],
          ["Apply at source", "Saat siap, LokerHub mengarahkan kamu ke halaman asli lowongan untuk melamar."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">{body}</p>
          </article>
        ))}
      </section>
      <section className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-ink">Batasan produk</h2>
        <p className="mt-3 leading-7 text-ink/70">LokerHub bukan platform lamaran langsung dan bukan pengganti verifikasi mandiri. Kami membantu menemukan dan merapikan informasi lowongan, tetapi proses apply tetap dilakukan di sumber asli.</p>
        <Link href="/jobs" className="mt-6 inline-flex rounded-full bg-leaf px-5 py-3 text-sm font-black text-white hover:bg-leaf/90">Cari Lowongan</Link>
      </section>
    </main>
  );
}
