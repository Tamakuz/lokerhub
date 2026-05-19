import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CvMatcher } from "@/components/CvMatcher";
import { getSampleJobPosts } from "@/lib/jobs";

describe("CvMatcher", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("recommends matching jobs from pasted CV text", async () => {
    render(<CvMatcher jobs={getSampleJobPosts()} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "React TypeScript frontend SaaS dashboard" } });

    expect(screen.getByRole("heading", { name: "Frontend Developer" })).toBeInTheDocument();
    expect(screen.getAllByText(/Matched:/).length).toBeGreaterThan(0);
  });

  it("loads text CV files into the matcher", async () => {
    render(<CvMatcher jobs={getSampleJobPosts()} />);

    const file = new File(["React TypeScript frontend SaaS dashboard"], "cv.txt", { type: "text/plain" });
    const input = screen.getByLabelText(/Upload CV teks/i);

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(screen.getByRole("textbox")).toHaveValue("React TypeScript frontend SaaS dashboard"));
    expect(screen.getByRole("heading", { name: "Frontend Developer" })).toBeInTheDocument();
  });

  it("runs AI matching through the API", async () => {
    vi.spyOn(window, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        source: "ai",
        matches: [{ jobId: "frontend-developer-jakarta-1", score: 91, matched: ["react"], reason: "Pengalaman React cocok dengan kebutuhan role." }],
      }),
    } as Response);

    render(<CvMatcher jobs={getSampleJobPosts()} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "React TypeScript frontend SaaS dashboard" } });
    fireEvent.click(screen.getByRole("button", { name: "AI match via 9router" }));

    await waitFor(() => expect(screen.getByText("Sumber hasil: 9router AI")).toBeInTheDocument());
    expect(screen.getByText("Pengalaman React cocok dengan kebutuhan role.")).toBeInTheDocument();
  });
});
