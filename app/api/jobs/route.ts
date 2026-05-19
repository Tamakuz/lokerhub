import { NextResponse } from "next/server";
import { getJobs } from "@/lib/jobs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobs = await getJobs({
    keyword: searchParams.get("q") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    source: searchParams.get("source") ?? undefined,
  });

  return NextResponse.json({ jobs });
}
