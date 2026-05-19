import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobById, getJobs } from "@/lib/jobs";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  return {
    title: job ? `${job.title} at ${job.company} | LokerHub` : "Job not found | LokerHub",
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/jobs" className="text-sm font-bold text-leaf hover:text-leaf/80">← Back to jobs</Link>
      <article className="mt-6 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">{job.sourceName}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">{job.title}</h1>
            <p className="mt-4 text-lg text-ink/70">{job.company} · {job.location}</p>
          </div>
          <span className="w-fit rounded-full bg-leaf/10 px-4 py-2 text-sm font-bold text-leaf">{job.category}</span>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">Type</dt><dd className="mt-2 font-semibold">{job.employmentType}</dd></div>
          <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">Salary</dt><dd className="mt-2 font-semibold">{job.salaryText ?? "Not listed"}</dd></div>
          <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">Posted</dt><dd className="mt-2 font-semibold">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(job.postedAt)}</dd></div>
        </dl>

        <section className="mt-8">
          <h2 className="text-xl font-bold">Deskripsi</h2>
          <p className="mt-3 leading-8 text-ink/75">{job.description}</p>
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/65">Lanjutkan di sumber asli</p>
            <p className="mt-1 font-bold">Apply via {job.sourceName}</p>
          </div>
          <a href={job.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-ink hover:bg-cream">Open source job</a>
        </div>
      </article>
    </main>
  );
}
