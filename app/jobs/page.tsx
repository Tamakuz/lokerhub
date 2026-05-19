import Link from "next/link";
import { CopySearchLink } from "@/components/CopySearchLink";
import { CvMatcher } from "@/components/CvMatcher";
import { JobCard } from "@/components/JobCard";
import { getJobFacets, getJobs, jobFiltersSchema } from "@/lib/jobs";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    category?: string;
    source?: string;
    employmentType?: string;
    includeStale?: string;
  }>;
};

function filterHref(filters: { q?: string; location?: string; category?: string; source?: string; employmentType?: string; includeStale?: boolean }, removeKey?: keyof typeof filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && key !== removeKey) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `/jobs?${query}` : "/jobs";
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const rawFilters = await searchParams;
  const filters = jobFiltersSchema.parse({
    keyword: rawFilters.q,
    location: rawFilters.location,
    category: rawFilters.category,
    source: rawFilters.source,
    employmentType: rawFilters.employmentType,
    includeStale: rawFilters.includeStale === "true" ? true : undefined,
  });
  const jobs = await getJobs(filters);
  const facets = await getJobFacets();
  const fallbackJobs = jobs.length === 0 ? (await getJobs()).slice(0, 3) : [];
  const currentFilterParams = {
    q: filters.keyword,
    location: filters.location,
    category: filters.category,
    source: filters.source,
    employmentType: filters.employmentType,
    includeStale: filters.includeStale,
  };

  const activeFilters: Array<{ key: keyof typeof currentFilterParams; label: string; value: string }> = [];

  if (filters.keyword) activeFilters.push({ key: "q", label: "Keyword", value: filters.keyword });
  if (filters.location) activeFilters.push({ key: "location", label: "Lokasi", value: filters.location });
  if (filters.category) activeFilters.push({ key: "category", label: "Kategori", value: filters.category });
  if (filters.source) activeFilters.push({ key: "source", label: "Sumber", value: filters.source });
  if (filters.employmentType) activeFilters.push({ key: "employmentType", label: "Tipe", value: filters.employmentType });
  if (filters.includeStale) activeFilters.push({ key: "includeStale", label: "Arsip", value: "Termasuk lowongan lama" });

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

      <form className="mt-8 grid gap-3 rounded-3xl border border-ink/10 bg-white p-4 shadow-sm md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
        {filters.includeStale ? <input type="hidden" name="includeStale" value="true" /> : null}
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
        <select name="employmentType" defaultValue={filters.employmentType ?? ""} className="rounded-2xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-leaf">
          <option value="">Semua tipe</option>
          {facets.employmentTypes.map((employmentType) => <option key={employmentType} value={employmentType}>{employmentType}</option>)}
        </select>
        <div className="flex gap-2">
          <button className="flex-1 rounded-2xl bg-leaf px-5 py-3 text-sm font-bold text-white hover:bg-leaf/90">Search</button>
          <Link href="/jobs" className="rounded-2xl border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70 hover:border-leaf/40">Reset</Link>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {!filters.includeStale ? <Link href={filterHref({ ...currentFilterParams, includeStale: true })} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-ink/60 shadow-sm transition hover:text-leaf">Lihat termasuk lowongan lama</Link> : null}
        {filters.includeStale ? <Link href={filterHref(currentFilterParams, "includeStale")} className="rounded-full border border-leaf/20 px-4 py-2 text-xs font-bold text-leaf transition hover:bg-white">Sembunyikan lowongan lama</Link> : null}
      </div>

      {activeFilters.length > 0 ? (
        <div className="mt-4 rounded-3xl border border-leaf/15 bg-leaf/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-ink/70">Menampilkan {jobs.length} lowongan dengan filter aktif. URL ini bisa dibagikan ke teman atau disimpan.</p>
            <CopySearchLink />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Link
                key={filter.key}
                href={filterHref(currentFilterParams, filter.key)}
                className="rounded-full bg-white px-3 py-2 text-xs font-bold text-ink/65 shadow-sm transition hover:text-leaf"
                title={`Hapus filter ${filter.label.toLowerCase()}`}
              >
                {filter.label}: {filter.value} ×
              </Link>
            ))}
            <Link href="/jobs" className="rounded-full border border-ink/10 px-3 py-2 text-xs font-bold text-ink/55 transition hover:border-leaf/40 hover:text-leaf">Reset semua</Link>
          </div>
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
        <div className="mt-8 rounded-3xl border border-dashed border-ink/20 bg-white p-6 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Search recovery</p>
            <h2 className="mt-2 text-2xl font-black text-ink">Belum ada lowongan yang cocok</h2>
            <p className="mt-3 text-sm leading-6 text-ink/65">Coba hapus salah satu filter, gunakan keyword yang lebih umum, atau mulai dari lowongan terbaru di bawah.</p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/jobs" className="rounded-full bg-leaf px-5 py-3 text-sm font-bold text-white hover:bg-leaf/90">Lihat semua lowongan</Link>
              {filters.keyword ? <Link href={filterHref(currentFilterParams, "q")} className="rounded-full border border-ink/10 px-5 py-3 text-sm font-bold text-ink/70 hover:border-leaf/40 hover:text-leaf">Hapus keyword</Link> : null}
            </div>
          </div>
          {fallbackJobs.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-ink/45">Lowongan terbaru</h3>
              <div className="mt-4 grid gap-4">
                {fallbackJobs.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </main>
  );
}
