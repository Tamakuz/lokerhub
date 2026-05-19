import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JobCard } from "@/components/JobCard";
import { getSampleJobPosts } from "@/lib/jobs";

describe("JobCard", () => {
  it("renders the job summary and detail link", () => {
    const job = getSampleJobPosts()[0];

    render(<JobCard job={job} />);

    expect(screen.getByRole("heading", { name: job.title })).toBeInTheDocument();
    expect(screen.getByText(`${job.company} · ${job.location}`)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: job.title })).toHaveAttribute("href", `/jobs/${job.id}`);
  });
});
