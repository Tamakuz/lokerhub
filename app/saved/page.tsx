import Link from "next/link";
import { SavedJobsList } from "@/components/SavedJobsList";
import { getJobs } from "@/lib/jobs";

export const metadata = {
  title: "Lowongan Tersimpan",
  description: "Lihat shortlist lowongan kerja yang kamu simpan secara lokal di browser.",
  alternates: { canonical: "/saved" },
};

export default async function SavedJobsPage() {
  const jobs = await getJobs();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Saved jobs</p>
          <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Lowongan tersimpan</h1>
          <p className="mt-3 max-w-2xl text-ink/70">Shortlist lokal di browser ini. Tidak perlu login, dan tidak dikirim ke server.</p>
        </div>
        <Link href="/jobs" className="rounded-full border border-ink/10 bg-white px-5 py-3 text-center text-sm font-bold text-ink/70 hover:border-leaf/40 hover:text-leaf">Browse jobs</Link>
      </div>
      <SavedJobsList jobs={jobs} />
    </main>
  );
}
