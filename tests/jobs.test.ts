import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { filterJobs, formatJobFreshness, getJobFacetsFromJobs, getSampleJobPosts, isFreshJob, isNewJob } from "@/lib/jobs";

const jobs = getSampleJobPosts();

describe("job filtering", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-05-19T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("filters by keyword across title and company", () => {
    expect(filterJobs(jobs, { keyword: "frontend" })).toHaveLength(1);
    expect(filterJobs(jobs, { keyword: "KaryaCloud" })[0]?.id).toBe("backend-engineer-bandung-1");
  });

  it("filters by location, category, source, and employment type", () => {
    expect(filterJobs(jobs, { location: "Jakarta" })).toHaveLength(1);
    expect(filterJobs(jobs, { category: "Engineering" })).toHaveLength(2);
    expect(filterJobs(jobs, { source: "Glints" })[0]?.id).toBe("backend-engineer-bandung-1");
    expect(filterJobs(jobs, { employmentType: "Contract" })[0]?.id).toBe("product-designer-remote-1");
  });

  it("builds sorted facets", () => {
    const facets = getJobFacetsFromJobs(jobs);

    expect(facets.categories).toContain("Engineering");
    expect(facets.sources).toContain("LinkedIn");
    expect(facets.locations).toContain("Jakarta Selatan");
    expect(facets.employmentTypes).toContain("Full-time");
  });

  it("excludes stale jobs by default and includes them when requested", () => {
    const staleJob = {
      ...jobs[0],
      id: "stale-frontend-job",
      postedAt: new Date("2026-01-01T00:00:00.000Z"),
      scrapedAt: new Date("2026-01-02T00:00:00.000Z"),
    };

    expect(filterJobs([...jobs, staleJob]).map((job) => job.id)).not.toContain("stale-frontend-job");
    expect(filterJobs([...jobs, staleJob], { includeStale: true }).map((job) => job.id)).toContain("stale-frontend-job");
  });

  it("formats freshness and new job signals", () => {
    const referenceDate = new Date("2026-05-19T00:00:00.000Z");

    expect(isFreshJob(jobs[0], referenceDate)).toBe(true);
    expect(isNewJob(jobs[0], referenceDate)).toBe(true);
    expect(formatJobFreshness(jobs[0], referenceDate)).toBe("2 hari lalu");
    expect(isFreshJob({ ...jobs[0], postedAt: new Date("2026-03-01T00:00:00.000Z") }, referenceDate)).toBe(false);
  });
});
