import { describe, expect, it } from "vitest";
import { filterJobs, getJobFacetsFromJobs, getSampleJobPosts } from "@/lib/jobs";

const jobs = getSampleJobPosts();

describe("job filtering", () => {
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
});
