import Link from "next/link";

export const metadata = {
  title: "Tips Karier | LokerHub",
  description: "Tips sederhana untuk membantu pencari kerja Indonesia menyiapkan CV dan melamar di sumber asli.",
  alternates: { canonical: "/tips-karier" },
};

const tips = [
  ["Rapikan CV sebelum apply", "Pastikan role, skill utama, pengalaman, dan kontak mudah ditemukan dalam 10 detik pertama."],
  ["Cek sumber lowongan", "Selalu buka sumber asli, baca detail perusahaan, dan hindari memberikan data sensitif terlalu awal."],
  ["Gunakan filter dengan bijak", "Mulai dari keyword umum, lalu persempit dengan lokasi, kategori, tipe kerja, atau sumber."],
];

export default function CareerTipsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">Tips Karier</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black text-ink sm:text-5xl">Panduan singkat agar pencarian kerja lebih terarah.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-ink/70">Halaman ini berisi tips praktis. Ke depan, bagian ini bisa berkembang menjadi panduan CV, keamanan melamar, dan cara membaca lowongan.</p>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {tips.map(([title, body]) => (
          <article key={title} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">{body}</p>
          </article>
        ))}
      </section>
      <div className="mt-8 rounded-3xl bg-ink p-6 text-white sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black">Siap mulai cari lowongan?</h2>
          <p className="mt-2 text-sm text-white/65">Gunakan LokerHub untuk menemukan peluang dari berbagai sumber.</p>
        </div>
        <Link href="/jobs" className="mt-5 inline-flex rounded-full bg-leaf px-5 py-3 text-sm font-black text-white hover:bg-leaf/90 sm:mt-0">Browse Lowongan</Link>
      </div>
    </main>
  );
}
