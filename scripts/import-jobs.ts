import { readFile } from "node:fs/promises";
import { prisma } from "../lib/prisma";
import { upsertJobs } from "../lib/jobs";
import { parseJobsByExtension } from "../lib/importJobs";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    throw new Error("Usage: npm run import:json or npm run import:csv, or tsx scripts/import-jobs.ts <file.json|file.csv>");
  }

  const content = await readFile(filePath, "utf8");
  const jobs = parseJobsByExtension(filePath, content);
  const count = await upsertJobs(jobs);

  console.log(`Imported ${count} jobs from ${filePath}.`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
