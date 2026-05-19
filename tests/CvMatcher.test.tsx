import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CvMatcher } from "@/components/CvMatcher";
import { getSampleJobPosts } from "@/lib/jobs";

describe("CvMatcher", () => {
  it("recommends matching jobs from pasted CV text", async () => {
    render(<CvMatcher jobs={getSampleJobPosts()} />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "React TypeScript frontend SaaS dashboard" } });

    expect(screen.getByRole("heading", { name: "Frontend Developer" })).toBeInTheDocument();
    expect(screen.getAllByText(/Matched:/).length).toBeGreaterThan(0);
  });
});
