import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { SaveJobButton, savedJobsStorageKey } from "@/components/SaveJobButton";

describe("SaveJobButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and removes a job id", () => {
    render(<SaveJobButton jobId="frontend-developer-jakarta-1" />);

    fireEvent.click(screen.getByRole("button", { name: "Simpan lowongan" }));

    expect(JSON.parse(window.localStorage.getItem(savedJobsStorageKey) ?? "[]")).toEqual(["frontend-developer-jakarta-1"]);
    expect(screen.getByRole("button", { name: "Hapus dari lowongan tersimpan" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hapus dari lowongan tersimpan" }));

    expect(JSON.parse(window.localStorage.getItem(savedJobsStorageKey) ?? "[]")).toEqual([]);
    expect(screen.getByRole("button", { name: "Simpan lowongan" })).toBeInTheDocument();
  });

  it("initializes from localStorage", async () => {
    window.localStorage.setItem(savedJobsStorageKey, JSON.stringify(["backend-engineer-bandung-1"]));

    render(<SaveJobButton jobId="backend-engineer-bandung-1" />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Hapus dari lowongan tersimpan" })).toBeInTheDocument());
  });
});
