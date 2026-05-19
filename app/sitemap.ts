import type { MetadataRoute } from "next";
import { getJobs } from "@/lib/jobs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lokerhub.vercel.app";
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/jobs",
    "/cv-matcher",
    "/saved",
    "/tips-karier",
    "/tentang",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/jobs" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/jobs" ? 0.9 : 0.6,
  }));

  const jobs = await getJobs();
  const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${siteUrl}/jobs/${job.id}`,
    lastModified: job.updatedAt ?? job.scrapedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...jobRoutes];
}
