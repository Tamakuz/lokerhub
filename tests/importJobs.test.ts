import { describe, expect, it } from "vitest";
import { parseCsvJobs, parseJsonJobs } from "@/lib/importJobs";

describe("job import parsing", () => {
  it("parses JSON jobs", () => {
    const jobs = parseJsonJobs(JSON.stringify([
      {
        id: "json-job-1",
        title: "JSON Job",
        company: "Import Co",
        location: "Jakarta",
        salaryText: null,
        employmentType: "Full-time",
        category: "Engineering",
        sourceName: "LinkedIn",
        sourceUrl: "https://www.linkedin.com/jobs/view/json-job-1",
        description: "Imported from JSON.",
        postedAt: "2026-05-19T00:00:00.000Z",
        scrapedAt: "2026-05-19T00:00:00.000Z"
      }
    ]));

    expect(jobs[0]?.id).toBe("json-job-1");
    expect(jobs[0]?.postedAt).toBeInstanceOf(Date);
  });

  it("parses CSV jobs", () => {
    const jobs = parseCsvJobs(`id,title,company,location,salaryText,employmentType,category,sourceName,sourceUrl,description,postedAt,scrapedAt
csv-job-1,CSV Job,Import Co,Bandung,,Contract,Data,JobStreet,https://www.jobstreet.co.id/id/job/csv-job-1,Imported from CSV.,2026-05-19T00:00:00.000Z,2026-05-19T00:00:00.000Z`);

    expect(jobs[0]?.id).toBe("csv-job-1");
    expect(jobs[0]?.salaryText).toBeNull();
  });
});
