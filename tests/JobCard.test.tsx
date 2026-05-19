import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JobCard } from "@/components/JobCard";
import { getSampleJobPosts } from "@/lib/jobs";

describe("JobCard", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-05-19T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the job summary and detail link", () => {
    const job = getSampleJobPosts()[0];

    render(<JobCard job={job} />);

    expect(screen.getByRole("heading", { name: job.title })).toBeInTheDocument();
    expect(screen.getByText(`${job.company} · ${job.location}`)).toBeInTheDocument();
    expect(screen.getByText("Baru")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simpan lowongan" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: job.title })).toHaveAttribute("href", `/jobs/${job.id}`);
    expect(screen.getByRole("link", { name: "Lihat detail" })).toHaveAttribute("href", `/jobs/${job.id}`);
    expect(screen.getByRole("link", { name: `Apply di ${job.sourceName}` })).toHaveAttribute("href", job.sourceUrl);
    expect(screen.getByRole("link", { name: `Apply di ${job.sourceName}` })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: `Apply di ${job.sourceName}` })).toHaveAttribute("rel", "noreferrer");
  });
});
