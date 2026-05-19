import Link from "next/link";
import type { JobPost } from "@/lib/jobs";

export function JobCard({ job }: { job: JobPost }) {
  return (
    <article className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-leaf">{job.sourceName}</p>
          <h2 className="mt-1 text-xl font-bold text-ink">
            <Link href={`/jobs/${job.id}`} className="hover:text-leaf">{job.title}</Link>
          </h2>
          <p className="mt-2 text-sm text-ink/70">{job.company} · {job.location}</p>
        </div>
        <span className="w-fit rounded-full bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">{job.category}</span>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-ink/75">{job.description}</p>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-ink/60">
        <span>{job.employmentType}</span>
        {job.salaryText ? <span>· {job.salaryText}</span> : null}
        <span>· Posted {new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(job.postedAt))}</span>
      </div>
    </article>
  );
}
