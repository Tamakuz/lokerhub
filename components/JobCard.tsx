import Link from "next/link";
import { SaveJobButton } from "@/components/SaveJobButton";
import { formatJobFreshness, isNewJob, type JobPost } from "@/lib/jobs";

export function JobCard({ job }: { job: JobPost }) {
  return (
    <article className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf/20 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">Sumber: {job.sourceName}</p>
          <h2 className="mt-2 text-xl font-black leading-snug text-ink sm:text-2xl">
            <Link href={`/jobs/${job.id}`} className="outline-none transition hover:text-leaf focus:text-leaf">{job.title}</Link>
          </h2>
          <p className="mt-2 text-base font-semibold text-ink/75">{job.company}</p>
          <p className="mt-1 text-sm font-medium text-ink/60">{job.location}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {isNewJob(job) ? <span className="w-fit rounded-full bg-leaf px-3 py-1 text-xs font-black text-white">Baru</span> : null}
          <span className="w-fit rounded-full bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">{job.category}</span>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-ink/75">{job.description}</p>
      <div className="mt-5 grid gap-3 rounded-2xl bg-cream p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">Tipe</p>
          <p className="mt-1 text-sm font-bold text-ink/75">{job.employmentType}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">Gaji</p>
          <p className="mt-1 text-sm font-bold text-ink/75">{job.salaryText ?? "Gaji tidak dicantumkan"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">Diposting</p>
          <p className="mt-1 text-sm font-bold text-ink/75">{formatJobFreshness(job)}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold leading-5 text-ink/50">LokerHub akan mengarahkan kamu ke sumber asli saat melamar.</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SaveJobButton jobId={job.id} />
          <Link href={`/jobs/${job.id}`} className="rounded-full border border-ink/10 px-4 py-2 text-center text-sm font-bold text-ink/70 transition hover:border-leaf/40 hover:text-leaf">Lihat detail</Link>
          <a href={job.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full bg-leaf px-4 py-2 text-center text-sm font-bold text-white transition hover:bg-leaf/90">Lamar di sumber asli</a>
        </div>
      </div>
    </article>
  );
}
