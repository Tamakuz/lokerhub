import Link from "next/link";
import { CvMatcher } from "@/components/CvMatcher";
import { JobCard } from "@/components/JobCard";
import { getJobFacets, getJobs, jobFiltersSchema } from "@/lib/jobs";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
    source?: string;
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const rawFilters = await searchParams;
  const filters = jobFiltersSchema.parse({
    keyword: rawFilters.q,
    location: rawFilters.location,
    category: rawFilters.category,
    source: rawFilters.source,
  });
  const jobs = await getJobs(filters);
  const facets = await getJobFacets();

  const activeFilters = [
    filters.keyword ? `keyword “${filters.keyword}”` : null,
    filters.location ? `lokasi ${filters.location}` : null,
    filters.category ? `kategori ${filters.category}` : null,
    filters.source ? `sumber ${filters.source}` : null,
  ].filter(Boolean);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Browse jobs</p>
          <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Lowongan kerja terbaru</h1>
          <p className="mt-3 text-ink/70">Cari lowongan berdasarkan keyword, lokasi, kategori, atau sumber.</p>
        </div>
        <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70">{jobs.length} result{jobs.length === 1 ? "" : "s"}</p>
      </div>

      <form className="mt-8 grid gap-3 rounded-3xl border border-ink/10 bg-white p-4 shadow-sm md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <input name="q" defaultValue={filters.keyword} placeholder="Cari title, company, skill..." className="rounded-2xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-leaf" />
        <select name="location" defaultValue={filters.location ?? ""} className="rounded-2xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-leaf">
          <option value="">Semua lokasi</option>
          {facets.locations.map((location) => <option key={location} value={location}>{location}</option>)}
        </select>
        <select name="category" defaultValue={filters.category ?? ""} className="rounded-2xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-leaf">
          <option value="">Semua kategori</option>
          {facets.categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <select name="source" defaultValue={filters.source ?? ""} className="rounded-2xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-leaf">
          <option value="">Semua sumber</option>
          {facets.sources.map((source) => <option key={source} value={source}>{source}</option>)}
        </select>
        <div className="flex gap-2">
          <button className="flex-1 rounded-2xl bg-leaf px-5 py-3 text-sm font-bold text-white hover:bg-leaf/90">Search</button>
          <Link href="/jobs" className="rounded-2xl border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70 hover:border-leaf/40">Reset</Link>
        </div>
      </form>

      {activeFilters.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-leaf/15 bg-leaf/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-ink/70">Menampilkan {jobs.length} lowongan untuk {activeFilters.join(", ")}.</p>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf">URL ini bisa dibagikan</p>
        </div>
      ) : null}

      {jobs.length > 0 ? (
        <>
          <CvMatcher jobs={jobs} />
          <div className="mt-8 grid gap-4">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">Belum ada lowongan yang cocok</h2>
          <p className="mt-2 text-sm text-ink/65">Coba hapus filter atau gunakan keyword yang lebih umum.</p>
        </div>
      )}
    </main>
  );
}
