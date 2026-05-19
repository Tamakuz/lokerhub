import Link from "next/link";
import { CvMatcher } from "@/components/CvMatcher";
import { getJobs } from "@/lib/jobs";

export const metadata = {
  title: "CV Matcher",
  description: "Cocokkan CV kamu dengan lowongan kerja yang tersedia di LokerHub.",
  alternates: { canonical: "/cv-matcher" },
};

export default async function CvMatcherPage() {
  const jobs = await getJobs();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 rounded-[2rem] bg-ink p-6 text-white sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">CV Matcher</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Cocokkan CV kamu dengan lowongan yang tersedia.</h1>
          <p className="mt-4 text-base leading-7 text-white/70">Upload atau tempel teks CV, lalu LokerHub akan merekomendasikan lowongan yang paling relevan dari daftar terbaru. Hasil ini bantuan awal, bukan jaminan diterima kerja.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/jobs" className="rounded-full bg-leaf px-5 py-3 text-center text-sm font-black text-white hover:bg-leaf/90">Browse lowongan</Link>
            <Link href="/tips-karier" className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-black text-white/80 hover:bg-white/10 hover:text-white">Lihat tips CV</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
          <h2 className="text-lg font-black">Privasi dan batasan</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-white/70">
            <li>CV diproses hanya saat kamu menekan tombol AI match.</li>
            <li>File yang didukung saat ini: teks, markdown, CSV, dan JSON.</li>
            <li>PDF/DOCX belum diparse sampai parser khusus ditambahkan.</li>
          </ul>
        </div>
      </section>
      <CvMatcher jobs={jobs} />
    </main>
  );
}
