import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const jobPostSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  salaryText: z.string().nullable(),
  employmentType: z.string().min(1),
  category: z.string().min(1),
  sourceName: z.string().min(1),
  sourceUrl: z.string().url(),
  description: z.string().min(1),
  postedAt: z.coerce.date(),
  scrapedAt: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const importJobPostSchema = jobPostSchema.omit({ createdAt: true, updatedAt: true });

export type JobPost = z.infer<typeof jobPostSchema>;
export type ImportJobPost = z.infer<typeof importJobPostSchema>;

export const jobFiltersSchema = z.object({
  keyword: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  source: z.string().trim().max(100).optional(),
  employmentType: z.string().trim().max(100).optional(),
  includeStale: z.boolean().optional(),
});

export type JobFilters = z.infer<typeof jobFiltersSchema>;

const now = new Date("2026-05-19T00:00:00.000Z");
const dayInMs = 24 * 60 * 60 * 1000;
export const freshJobWindowDays = 30;
export const newJobWindowDays = 7;

export const sampleJobs: ImportJobPost[] = [
  {
    id: "frontend-developer-jakarta-1",
    title: "Frontend Developer",
    company: "Nusantara Digital",
    location: "Jakarta Selatan",
    salaryText: "Rp8.000.000 - Rp14.000.000",
    employmentType: "Full-time",
    category: "Engineering",
    sourceName: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/jobs/view/frontend-developer-nusantara-digital-jakarta-410000001",
    description: "Bangun antarmuka web responsif untuk produk SaaS lokal menggunakan React, TypeScript, dan desain sistem internal.",
    postedAt: new Date("2026-05-17T00:00:00.000Z"),
    scrapedAt: now,
  },
  {
    id: "backend-engineer-bandung-1",
    title: "Backend Engineer",
    company: "KaryaCloud",
    location: "Bandung",
    salaryText: "Rp10.000.000 - Rp18.000.000",
    employmentType: "Full-time",
    category: "Engineering",
    sourceName: "Glints",
    sourceUrl: "https://glints.com/id/opportunities/jobs/backend-engineer-karyacloud/410000002",
    description: "Kembangkan API, integrasi pembayaran, dan pipeline data untuk platform operasional UMKM Indonesia.",
    postedAt: new Date("2026-05-15T00:00:00.000Z"),
    scrapedAt: now,
  },
  {
    id: "product-designer-remote-1",
    title: "Product Designer",
    company: "RuangTalenta",
    location: "Remote Indonesia",
    salaryText: null,
    employmentType: "Contract",
    category: "Design",
    sourceName: "Kalibrr",
    sourceUrl: "https://www.kalibrr.id/c/ruangtalenta/jobs/product-designer-410000003",
    description: "Rancang pengalaman pengguna mobile-first untuk marketplace karier dengan riset pengguna ringan dan prototyping cepat.",
    postedAt: new Date("2026-05-14T00:00:00.000Z"),
    scrapedAt: now,
  },
  {
    id: "digital-marketing-surabaya-1",
    title: "Digital Marketing Specialist",
    company: "Sinar Retail Group",
    location: "Surabaya",
    salaryText: "Rp6.000.000 - Rp9.000.000",
    employmentType: "Full-time",
    category: "Marketing",
    sourceName: "JobStreet",
    sourceUrl: "https://www.jobstreet.co.id/id/job/digital-marketing-specialist-sinar-retail-group-410000004",
    description: "Kelola kampanye performance marketing, konten sosial, dan laporan pertumbuhan untuk jaringan retail nasional.",
    postedAt: new Date("2026-05-12T00:00:00.000Z"),
    scrapedAt: now,
  },
  {
    id: "data-analyst-yogyakarta-1",
    title: "Data Analyst",
    company: "Ladang Pintar",
    location: "Yogyakarta",
    salaryText: "Rp7.000.000 - Rp11.000.000",
    employmentType: "Full-time",
    category: "Data",
    sourceName: "Tech in Asia Jobs",
    sourceUrl: "https://www.techinasia.com/jobs/data-analyst-ladang-pintar-410000005",
    description: "Analisis metrik produk, bangun dashboard operasional, dan bantu tim mengambil keputusan berbasis data.",
    postedAt: new Date("2026-05-10T00:00:00.000Z"),
    scrapedAt: now,
  },
  {
    id: "customer-success-bali-1",
    title: "Customer Success Associate",
    company: "Bali TravelTech",
    location: "Denpasar",
    salaryText: "Rp5.000.000 - Rp7.500.000",
    employmentType: "Full-time",
    category: "Operations",
    sourceName: "Dealls",
    sourceUrl: "https://dealls.com/loker/customer-success-associate-bali-traveltech-410000006",
    description: "Bantu pelanggan B2B onboarding, jawab pertanyaan produk, dan koordinasi dengan tim operasional perjalanan.",
    postedAt: new Date("2026-05-09T00:00:00.000Z"),
    scrapedAt: now,
  },
];

export const normalizedSampleJobs = z.array(importJobPostSchema).parse(sampleJobs);

function jobFreshnessDate(job: Pick<JobPost, "postedAt" | "scrapedAt">) {
  return job.postedAt ?? job.scrapedAt;
}

export function getFreshJobCutoff(referenceDate = new Date()) {
  return new Date(referenceDate.getTime() - freshJobWindowDays * dayInMs);
}

export function getJobAgeInDays(job: Pick<JobPost, "postedAt" | "scrapedAt">, referenceDate = new Date()) {
  return Math.max(0, Math.floor((referenceDate.getTime() - jobFreshnessDate(job).getTime()) / dayInMs));
}

export function isFreshJob(job: Pick<JobPost, "postedAt" | "scrapedAt">, referenceDate = new Date()) {
  return jobFreshnessDate(job) >= getFreshJobCutoff(referenceDate);
}

export function isNewJob(job: Pick<JobPost, "postedAt" | "scrapedAt">, referenceDate = new Date()) {
  return getJobAgeInDays(job, referenceDate) <= newJobWindowDays;
}

export function formatJobFreshness(job: Pick<JobPost, "postedAt" | "scrapedAt">, referenceDate = new Date()) {
  const ageInDays = getJobAgeInDays(job, referenceDate);

  if (ageInDays === 0) return "Hari ini";
  if (ageInDays === 1) return "1 hari lalu";
  return `${ageInDays} hari lalu`;
}

export function filterJobs(jobs: JobPost[], filters: JobFilters = {}) {
  const keyword = filters.keyword?.trim().toLowerCase();
  const location = filters.location?.trim().toLowerCase();
  const category = filters.category?.trim().toLowerCase();
  const source = filters.source?.trim().toLowerCase();
  const employmentType = filters.employmentType?.trim().toLowerCase();

  return jobs.filter((job) => {
    const keywordText = `${job.title} ${job.company} ${job.location} ${job.category} ${job.description}`.toLowerCase();

    return (
      (!keyword || keywordText.includes(keyword)) &&
      (!location || job.location.toLowerCase().includes(location)) &&
      (!category || job.category.toLowerCase() === category) &&
      (!source || job.sourceName.toLowerCase() === source) &&
      (!employmentType || job.employmentType.toLowerCase() === employmentType) &&
      (filters.includeStale || isFreshJob(job))
    );
  });
}

export function getJobFacetsFromJobs(jobs: JobPost[]) {
  return {
    locations: Array.from(new Set(jobs.map((job) => job.location))).sort(),
    categories: Array.from(new Set(jobs.map((job) => job.category))).sort(),
    sources: Array.from(new Set(jobs.map((job) => job.sourceName))).sort(),
    employmentTypes: Array.from(new Set(jobs.map((job) => job.employmentType))).sort(),
  };
}

function toJobPost(job: ImportJobPost & { createdAt?: Date; updatedAt?: Date }): JobPost {
  return jobPostSchema.parse({
    ...job,
    createdAt: job.createdAt ?? job.scrapedAt,
    updatedAt: job.updatedAt ?? job.scrapedAt,
  });
}

function whereFromFilters(filters: JobFilters = {}): Prisma.JobPostWhereInput {
  const where: Prisma.JobPostWhereInput = {};
  const and: Prisma.JobPostWhereInput[] = [];

  if (!filters.includeStale) {
    const cutoff = getFreshJobCutoff();

    and.push({
      postedAt: { gte: cutoff },
    });
  }

  if (filters.keyword?.trim()) {
    const keyword = filters.keyword.trim();
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { company: { contains: keyword, mode: "insensitive" } },
      { location: { contains: keyword, mode: "insensitive" } },
      { category: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  if (filters.location?.trim()) {
    where.location = { contains: filters.location.trim(), mode: "insensitive" };
  }

  if (filters.category?.trim()) {
    where.category = { equals: filters.category.trim(), mode: "insensitive" };
  }

  if (filters.source?.trim()) {
    where.sourceName = { equals: filters.source.trim(), mode: "insensitive" };
  }

  if (filters.employmentType?.trim()) {
    where.employmentType = { equals: filters.employmentType.trim(), mode: "insensitive" };
  }

  if (and.length > 0) {
    where.AND = and;
  }

  return where;
}

export async function getJobs(filters: JobFilters = {}) {
  const normalizedFilters = jobFiltersSchema.parse(filters);
  const jobs = await prisma.jobPost.findMany({
    where: whereFromFilters(normalizedFilters),
    orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }, { id: "asc" }],
  });

  return z.array(jobPostSchema).parse(jobs);
}

export async function getJobById(id: string) {
  const job = await prisma.jobPost.findUnique({ where: { id } });
  return job ? jobPostSchema.parse(job) : null;
}

export async function getJobFacets() {
  return getJobFacetsFromJobs(await getJobs());
}

export async function upsertJobs(jobs: ImportJobPost[]) {
  const normalizedJobs = z.array(importJobPostSchema).parse(jobs);

  for (const job of normalizedJobs) {
    await prisma.jobPost.upsert({
      where: { id: job.id },
      update: job,
      create: job,
    });
  }

  return normalizedJobs.length;
}

export function getSampleJobPosts() {
  return normalizedSampleJobs.map(toJobPost);
}
