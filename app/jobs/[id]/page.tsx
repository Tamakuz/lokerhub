import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SaveJobButton } from "@/components/SaveJobButton";
import { formatJobFreshness, getJobById, getJobs, isNewJob } from "@/lib/jobs";

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

  if (!job) {
    return {
      title: "Lowongan tidak ditemukan",
    } satisfies Metadata;
  }

  const description = `${job.title} di ${job.company}, ${job.location}. ${job.employmentType}${job.salaryText ? `, ${job.salaryText}` : ""}. Lamar melalui sumber asli ${job.sourceName}.`;

  return {
    title: `${job.title} di ${job.company}`,
    description,
    alternates: { canonical: `/jobs/${job.id}` },
    openGraph: {
      title: `${job.title} di ${job.company}`,
      description,
      type: "article",
      url: `/jobs/${job.id}`,
    },
    twitter: {
      card: "summary",
      title: `${job.title} di ${job.company}`,
      description,
    },
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const sourceHost = new URL(job.sourceUrl).hostname.replace(/^www\./, "");
  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt.toISOString(),
    employmentType: job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "ID",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Indonesia",
    },
    directApply: false,
    url: job.sourceUrl,
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }} />
      <Link href="/jobs" className="text-sm font-bold text-leaf hover:text-leaf/80">← Kembali ke browse lowongan</Link>
      <article className="mt-6 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">{job.sourceName}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-ink sm:text-5xl">{job.title}</h1>
            <p className="mt-4 text-lg text-ink/70">{job.company} · {job.location}</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {isNewJob(job) ? <span className="w-fit rounded-full bg-leaf px-4 py-2 text-sm font-black text-white">Baru</span> : null}
            <span className="w-fit rounded-full bg-leaf/10 px-4 py-2 text-sm font-bold text-leaf">{job.category}</span>
            <SaveJobButton jobId={job.id} variant="detail" />
          </div>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">Tipe kerja</dt><dd className="mt-2 font-semibold">{job.employmentType}</dd></div>
          <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">Gaji</dt><dd className="mt-2 font-semibold">{job.salaryText ?? "Gaji tidak dicantumkan"}</dd></div>
          <div className="rounded-2xl bg-cream p-4"><dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">Diposting</dt><dd className="mt-2 font-semibold">{formatJobFreshness(job)}</dd><dd className="mt-1 text-xs font-semibold text-ink/50">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(job.postedAt)}</dd></div>
        </dl>

        <section className="mt-8 rounded-3xl border border-leaf/15 bg-leaf/10 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf">Sumber asli</p>
              <h2 className="mt-2 text-xl font-black text-ink">Kamu akan diarahkan ke {job.sourceName}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">LokerHub tidak menerima lamaran langsung. Tombol apply membuka {sourceHost} di tab baru agar kamu bisa melamar melalui halaman asli lowongan.</p>
            </div>
            <a href={job.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full bg-leaf px-5 py-3 text-center text-sm font-black text-white hover:bg-leaf/90">Lamar di sumber asli</a>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">Deskripsi</h2>
          <p className="mt-3 leading-8 text-ink/75">{job.description}</p>
        </section>

        <section className="mt-8 grid gap-4 rounded-3xl bg-cream p-5 sm:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf">Apply readiness</p>
            <h2 className="mt-2 text-xl font-black text-ink">Siapkan sebelum lanjut melamar</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">Gunakan ringkasan ini untuk cek cepat agar apply di sumber asli lebih lancar.</p>
          </div>
          <ul className="grid gap-2 text-sm font-semibold text-ink/70">
            <li className="rounded-2xl bg-white px-4 py-3">CV sudah menonjolkan pengalaman {job.category.toLowerCase()}.</li>
            <li className="rounded-2xl bg-white px-4 py-3">Lokasi atau mode kerja cocok dengan {job.location}.</li>
            <li className="rounded-2xl bg-white px-4 py-3">Ekspektasi gaji sudah dibandingkan dengan {job.salaryText ?? "informasi yang tersedia"}.</li>
          </ul>
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white/65">Lanjutkan di sumber asli</p>
            <p className="mt-1 font-bold">Lamar via {job.sourceName}</p>
            <p className="mt-1 text-xs font-semibold text-white/50">Membuka {sourceHost} di tab baru.</p>
          </div>
          <a href={job.sourceUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-3 text-center text-sm font-black text-ink hover:bg-cream">Buka lowongan asli</a>
        </div>
      </article>
    </main>
  );
}
