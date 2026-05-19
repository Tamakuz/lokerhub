import { prisma } from "../lib/prisma";
import { normalizedSampleJobs, upsertJobs } from "../lib/jobs";

async function main() {
  const count = await upsertJobs(normalizedSampleJobs);

  console.log(`Seeded ${count} LokerHub jobs into PostgreSQL.`);
  console.table(
    normalizedSampleJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      source: job.sourceName,
      sourceUrl: job.sourceUrl,
    })),
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
