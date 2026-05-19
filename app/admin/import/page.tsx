import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeManualJob } from "@/lib/importJobs";
import { upsertJobs } from "@/lib/jobs";

async function importManualJob(formData: FormData) {
  "use server";

  const job = normalizeManualJob({
    id: formData.get("id"),
    title: formData.get("title"),
    company: formData.get("company"),
    location: formData.get("location"),
    salaryText: formData.get("salaryText"),
    employmentType: formData.get("employmentType"),
    category: formData.get("category"),
    sourceName: formData.get("sourceName"),
    sourceUrl: formData.get("sourceUrl"),
    description: formData.get("description"),
    postedAt: formData.get("postedAt"),
  });

  await upsertJobs([job]);
  revalidatePath("/");
  revalidatePath("/jobs");
  redirect(`/admin/import?imported=${encodeURIComponent(job.id)}`);
}

const fields = [
  ["id", "ID", "mobile-developer-medan-1"],
  ["title", "Title", "Mobile Developer"],
  ["company", "Company", "Contoh Teknologi"],
  ["location", "Location", "Medan"],
  ["salaryText", "Salary", "Rp8.000.000 - Rp13.000.000"],
  ["employmentType", "Employment type", "Full-time"],
  ["category", "Category", "Engineering"],
  ["sourceName", "Source name", "LinkedIn"],
  ["sourceUrl", "Source URL", "https://www.linkedin.com/jobs/view/mobile-developer-contoh-teknologi-410000009"],
  ["postedAt", "Posted at", "2026-05-19T00:00:00.000Z"],
] as const;

type AdminImportPageProps = {
  searchParams: Promise<{ imported?: string }>;
};

export default async function AdminImportPage({ searchParams }: AdminImportPageProps) {
  const { imported } = await searchParams;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-leaf">Admin import</p>
      <h1 className="mt-2 text-3xl font-black text-ink">Manual job import</h1>
      <p className="mt-3 text-ink/70">Add one normalized job post. Use CSV/JSON scripts for batch imports.</p>
      {imported ? <p className="mt-4 rounded-2xl bg-leaf/10 px-4 py-3 text-sm font-semibold text-leaf">Imported job {imported}. It is now visible in browse and API results.</p> : null}

      <form action={importManualJob} className="mt-8 grid gap-4 rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
        {fields.map(([name, label, placeholder]) => (
          <label key={name} className="grid gap-2 text-sm font-semibold text-ink/70">
            {label}
            <input name={name} placeholder={placeholder} required={name !== "salaryText"} className="rounded-2xl border border-ink/10 px-4 py-3 text-sm font-normal text-ink outline-none focus:border-leaf" />
          </label>
        ))}
        <label className="grid gap-2 text-sm font-semibold text-ink/70">
          Description
          <textarea name="description" required rows={5} placeholder="Describe the role, responsibilities, and requirements." className="rounded-2xl border border-ink/10 px-4 py-3 text-sm font-normal text-ink outline-none focus:border-leaf" />
        </label>
        <button className="rounded-2xl bg-leaf px-5 py-3 text-sm font-bold text-white hover:bg-leaf/90">Import job</button>
      </form>
    </main>
  );
}
