import Link from "next/link";
import { getJobFacets, getJobs } from "@/lib/jobs";

export default async function HomePage() {
  const jobs = await getJobs();
  const facets = await getJobFacets();
  const discoveryGroups = [
    { title: "Kategori populer", queryKey: "category", values: facets.categories },
    { title: "Lokasi aktif", queryKey: "location", values: facets.locations },
    { title: "Sumber lowongan", queryKey: "source", values: facets.sources },
  ];

  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-leaf">Loker Indonesia, satu pintu</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-ink sm:text-6xl">Temukan lowongan dari banyak sumber tanpa buka banyak tab.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/75">LokerHub mengumpulkan job post Indonesia dalam format yang rapi, membantu kamu membandingkan peluang, lalu mengarahkan langsung ke sumber asli untuk melamar.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/jobs" className="rounded-full bg-leaf px-6 py-3 text-center font-bold text-white shadow-sm hover:bg-leaf/90">Browse Jobs</Link>
            <a href="#how-it-works" className="rounded-full border border-ink/15 bg-white px-6 py-3 text-center font-bold text-ink hover:border-leaf/40">Lihat cara kerja</a>
          </div>
        </div>
        <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-ink/60">MVP snapshot</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-cream p-4"><p className="text-3xl font-black text-leaf">{jobs.length}</p><p className="mt-1 text-sm text-ink/65">sample jobs</p></div>
            <div className="rounded-2xl bg-cream p-4"><p className="text-3xl font-black text-leaf">{facets.sources.length}</p><p className="mt-1 text-sm text-ink/65">sources</p></div>
            <div className="rounded-2xl bg-cream p-4"><p className="text-3xl font-black text-leaf">{facets.categories.length}</p><p className="mt-1 text-sm text-ink/65">categories</p></div>
            <div className="rounded-2xl bg-cream p-4"><p className="text-3xl font-black text-leaf">{facets.locations.length}</p><p className="mt-1 text-sm text-ink/65">locations</p></div>
          </div>
        </div>
      </section>
      <section className="border-y border-ink/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Mulai eksplorasi</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Temukan pola pasar kerja lebih cepat</h2>
            </div>
            <Link href="/jobs" className="text-sm font-bold text-leaf hover:text-leaf/80">Lihat semua lowongan</Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {discoveryGroups.map((group) => (
              <article key={group.title} className="rounded-3xl bg-cream p-5">
                <h3 className="font-black text-ink">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.values.slice(0, 6).map((value) => (
                    <Link key={value} href={`/jobs?${group.queryKey}=${encodeURIComponent(value)}`} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-ink/70 hover:text-leaf">
                      {value}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="how-it-works" className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {["Cari", "Bandingkan", "Lamar di sumber"].map((title, index) => (
            <div key={title} className="rounded-3xl bg-cream p-6">
              <p className="text-sm font-bold text-leaf">0{index + 1}</p>
              <h2 className="mt-3 text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/70">{index === 0 ? "Gunakan keyword dan filter untuk menemukan peluang relevan." : index === 1 ? "Lihat informasi inti dalam format job card yang konsisten." : "Klik tombol sumber asli untuk melanjutkan proses apply."}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
