import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getJobs, jobFiltersSchema } from "@/lib/jobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const filters = jobFiltersSchema.parse({
      keyword: searchParams.get("q") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      source: searchParams.get("source") ?? undefined,
      employmentType: searchParams.get("employmentType") ?? undefined,
      includeStale: searchParams.get("includeStale") === "true" ? true : undefined,
    });
    const jobs = await getJobs(filters);

    return NextResponse.json({ jobs });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid job filters", issues: error.issues }, { status: 400 });
    }

    throw error;
  }
}
