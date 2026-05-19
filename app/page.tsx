import Link from "next/link";
import { formatJobFreshness, getJobFacets, getJobs } from "@/lib/jobs";

export default async function HomePage() {
  const jobs = await getJobs();
  const facets = await getJobFacets();
  const latestJobs = jobs.slice(0, 3);
  const discoveryGroups = [
    { title: "Kategori populer", queryKey: "category", values: facets.categories },
    { title: "Lokasi aktif", queryKey: "location", values: facets.locations },
    { title: "Tipe kerja", queryKey: "employmentType", values: facets.employmentTypes },
  ];

  return (
    <main>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(75,181,112,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,248,237,0.16),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-leaf">Job aggregator Indonesia</p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">Cari lowongan kerja dari berbagai sumber, lebih cepat.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">LokerHub mengumpulkan lowongan dari berbagai platform, membantu kamu menyaring berdasarkan posisi, lokasi, kategori, dan sumber, lalu mengarahkan kamu ke halaman asli untuk melamar.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" className="rounded-full bg-leaf px-7 py-4 text-center text-sm font-black text-white shadow-lg shadow-leaf/20 hover:bg-leaf/90">Browse Lowongan</Link>
              <Link href="/cv-matcher" className="rounded-full border border-white/20 bg-white px-7 py-4 text-center text-sm font-black text-ink hover:bg-cream">Coba CV Matcher</Link>
            </div>
            <p className="mt-5 text-sm font-semibold text-white/50">Discover here, apply at the source. Tidak ada lamaran langsung di LokerHub.</p>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl shadow-ink/30 backdrop-blur sm:p-6">
            <div className="rounded-[1.5rem] bg-white p-5 text-ink shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-leaf">Preview lowongan</p>
                  <h2 className="mt-1 text-2xl font-black">Relevan dan terbaru</h2>
                </div>
                <span className="rounded-full bg-leaf/10 px-3 py-2 text-xs font-black text-leaf">{jobs.length} jobs</span>
              </div>
              <div className="mt-5 grid gap-3">
                {latestJobs.map((job) => (
                  <article key={job.id} className="rounded-2xl border border-ink/10 bg-cream p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black">{job.title}</h3>
                        <p className="mt-1 text-sm font-semibold text-ink/65">{job.company} · {job.location}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-leaf">{formatJobFreshness(job)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-ink/55">
                      <span className="rounded-full bg-white px-3 py-1">{job.employmentType}</span>
                      <span className="rounded-full bg-white px-3 py-1">{job.category}</span>
                      <span className="rounded-full bg-white px-3 py-1">{job.sourceName}</span>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-ink px-3 py-4 text-white"><p className="text-2xl font-black">{facets.sources.length}</p><p className="text-xs font-bold text-white/55">sumber</p></div>
                <div className="rounded-2xl bg-leaf px-3 py-4 text-white"><p className="text-2xl font-black">{facets.categories.length}</p><p className="text-xs font-bold text-white/70">kategori</p></div>
                <div className="rounded-2xl bg-cream px-3 py-4"><p className="text-2xl font-black text-ink">AI</p><p className="text-xs font-bold text-ink/55">CV match</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">Kenapa LokerHub?</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Dibuat untuk pencari kerja yang ingin cepat paham, bukan makin bingung.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["Banyak sumber", "Lowongan dari berbagai platform dirapikan dalam format yang mudah dibandingkan."],
              ["Filter praktis", "Cari berdasarkan keyword, lokasi, kategori, sumber, dan tipe kerja."],
              ["Simpan lokal", "Shortlist lowongan di browser tanpa harus membuat akun."],
              ["CV Matcher", "Cocokkan CV dengan lowongan yang tersedia sebagai bantuan awal."],
            ].map(([title, body]) => (
              <article key={title} className="rounded-3xl border border-ink/10 bg-cream p-5">
                <h3 className="text-lg font-black text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-leaf">Mulai eksplorasi</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Pilih jalur pencarian yang paling dekat dengan kebutuhanmu.</h2>
            </div>
            <Link href="/jobs" className="text-sm font-black text-leaf hover:text-leaf/80">Lihat semua lowongan</Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {discoveryGroups.map((group) => (
              <article key={group.title} className="rounded-3xl bg-white p-5 shadow-sm">
                <h3 className="font-black text-ink">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.values.slice(0, 6).map((value) => (
                    <Link key={value} href={`/jobs?${group.queryKey}=${encodeURIComponent(value)}`} className="rounded-full bg-cream px-3 py-2 text-xs font-bold text-ink/70 hover:text-leaf">
                      {value}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-ink/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Cari", "Gunakan keyword dan filter untuk menemukan peluang relevan dari berbagai sumber."],
            ["Bandingkan", "Lihat sumber, tanggal, tipe kerja, gaji, dan detail penting dalam format konsisten."],
            ["Lamar di sumber", "Saat siap, LokerHub mengarahkan kamu ke halaman asli lowongan."],
          ].map(([title, body], index) => (
            <div key={title} className="rounded-3xl bg-cream p-6">
              <p className="text-sm font-black text-leaf">0{index + 1}</p>
              <h2 className="mt-3 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/70">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
