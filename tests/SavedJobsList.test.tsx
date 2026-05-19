import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SavedJobsList } from "@/components/SavedJobsList";
import { savedJobsStorageKey } from "@/components/SaveJobButton";
import { getSampleJobPosts } from "@/lib/jobs";

const jobs = getSampleJobPosts();

describe("SavedJobsList", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders saved jobs from localStorage", async () => {
    window.localStorage.setItem(savedJobsStorageKey, JSON.stringify(["frontend-developer-jakarta-1"]));

    render(<SavedJobsList jobs={jobs} />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Frontend Developer" })).toBeInTheDocument());
    expect(screen.queryByRole("heading", { name: "Backend Engineer" })).not.toBeInTheDocument();
  });

  it("shows an empty state and ignores stale ids", async () => {
    window.localStorage.setItem(savedJobsStorageKey, JSON.stringify(["missing-job-id"]));

    render(<SavedJobsList jobs={jobs} />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Belum ada lowongan tersimpan" })).toBeInTheDocument());
    expect(JSON.parse(window.localStorage.getItem(savedJobsStorageKey) ?? "[]")).toEqual([]);
    expect(screen.getByRole("link", { name: "Cari lowongan" })).toHaveAttribute("href", "/jobs");
  });

  it("removes a job from the saved list after unsaving", async () => {
    window.localStorage.setItem(savedJobsStorageKey, JSON.stringify(["frontend-developer-jakarta-1"]));

    render(<SavedJobsList jobs={jobs} />);

    await waitFor(() => expect(screen.getByRole("heading", { name: "Frontend Developer" })).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Hapus dari lowongan tersimpan" }));

    await waitFor(() => expect(screen.getByRole("heading", { name: "Belum ada lowongan tersimpan" })).toBeInTheDocument());
  });
});
