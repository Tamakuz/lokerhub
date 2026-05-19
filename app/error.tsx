"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Terjadi gangguan</p>
      <h1 className="mt-3 text-3xl font-black text-ink">LokerHub belum bisa memuat data.</h1>
      <p className="mt-3 text-ink/65">Coba lagi sebentar. Jika masih gagal, kemungkinan koneksi database atau layanan sedang tidak tersedia.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-leaf px-6 py-3 text-sm font-bold text-white hover:bg-leaf/90">Coba lagi</button>
    </main>
  );
}
