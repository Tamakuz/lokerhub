import { z } from "zod";
import type { JobPost } from "@/lib/jobs";

const stopWords = new Set([
  "yang",
  "dan",
  "atau",
  "untuk",
  "dengan",
  "dari",
  "pada",
  "dalam",
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
]);

export const cvMatchResultSchema = z.object({
  jobId: z.string().min(1),
  score: z.number().min(0).max(100),
  matched: z.array(z.string()).default([]),
  reason: z.string().optional(),
});

export type CvMatchResult = z.infer<typeof cvMatchResultSchema>;

export function tokenizeCvText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !stopWords.has(token));
}

export function scoreJobAgainstCv(job: JobPost, cvText: string): CvMatchResult {
  const cvTokens = new Set(tokenizeCvText(cvText));
  const jobTokens = new Set(tokenizeCvText(`${job.title} ${job.company} ${job.category} ${job.location} ${job.employmentType} ${job.description}`));
  const matched = Array.from(jobTokens).filter((token) => cvTokens.has(token));
  const score = jobTokens.size > 0 ? Math.round((matched.length / Math.min(jobTokens.size, 18)) * 100) : 0;

  return {
    jobId: job.id,
    matched: matched.slice(0, 8),
    score: Math.min(score, 100),
  };
}

export function getLocalCvMatches(jobs: JobPost[], cvText: string, limit = 3) {
  return jobs
    .map((job) => scoreJobAgainstCv(job, cvText))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
