import { parse } from "csv-parse/sync";
import { z } from "zod";
import { importJobPostSchema, type ImportJobPost } from "@/lib/jobs";

const importRowsSchema = z.array(importJobPostSchema);

export function parseJsonJobs(content: string) {
  const parsed = JSON.parse(content) as unknown;
  return importRowsSchema.parse(parsed);
}

export function parseCsvJobs(content: string) {
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<Record<string, string>>;

  return importRowsSchema.parse(
    rows.map((row) => ({
      ...row,
      salaryText: row.salaryText || null,
      postedAt: row.postedAt,
      scrapedAt: row.scrapedAt,
    })),
  );
}

export function parseJobsByExtension(filePath: string, content: string) {
  if (filePath.endsWith(".json")) {
    return parseJsonJobs(content);
  }

  if (filePath.endsWith(".csv")) {
    return parseCsvJobs(content);
  }

  throw new Error("Unsupported import file. Use .json or .csv.");
}

export function normalizeManualJob(input: Record<string, FormDataEntryValue | null>): ImportJobPost {
  const scrapedAt = new Date();

  return importJobPostSchema.parse({
    id: input.id,
    title: input.title,
    company: input.company,
    location: input.location,
    salaryText: input.salaryText || null,
    employmentType: input.employmentType,
    category: input.category,
    sourceName: input.sourceName,
    sourceUrl: input.sourceUrl,
    description: input.description,
    postedAt: input.postedAt,
    scrapedAt,
  });
}
