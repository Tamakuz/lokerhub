import { NextResponse } from "next/server";
import { z } from "zod";
import { cvMatchResultSchema, getLocalCvMatches } from "@/lib/cvMatch";
import { jobPostSchema } from "@/lib/jobs";

const requestSchema = z.object({
  cvText: z.string().trim().min(20).max(20_000),
  jobs: z.array(jobPostSchema).min(1).max(30),
});

function ninerouterEndpoint() {
  const rawUrl = process.env.NINEROUTER_URL?.replace(/\/$/, "");
  if (!rawUrl) return null;

  return rawUrl.endsWith("/v1") ? `${rawUrl}/chat/completions` : `${rawUrl}/v1/chat/completions`;
}

function extractJson(text: string) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain a JSON array");
  }

  return JSON.parse(text.slice(start, end + 1));
}

async function getAiMatches(cvText: string, jobs: z.infer<typeof jobPostSchema>[]) {
  const endpoint = ninerouterEndpoint();
  const apiKey = process.env.NINEROUTER_KEY;

  if (!endpoint) return null;

  const jobSummaries = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    category: job.category,
    employmentType: job.employmentType,
    description: job.description,
  }));

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: process.env.NINEROUTER_MODEL ?? "openai/gpt-5",
      stream: false,
      messages: [
        {
          role: "system",
          content: "Kamu adalah career matching assistant untuk job seeker Indonesia. Balas hanya JSON array valid, tanpa markdown.",
        },
        {
          role: "user",
          content: `Cocokkan CV berikut dengan daftar lowongan. Pilih maksimal 3 lowongan paling relevan. Format JSON array: [{"jobId":"...","score":0-100,"matched":["skill"],"reason":"alasan singkat bahasa Indonesia"}].\n\nCV:\n${cvText}\n\nLOWONGAN:\n${JSON.stringify(jobSummaries)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`9router request failed with ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("9router response was missing message content");
  }

  const parsed = z.array(cvMatchResultSchema).parse(extractJson(content));
  const jobIds = new Set(jobs.map((job) => job.id));

  return parsed.filter((match) => jobIds.has(match.jobId)).sort((a, b) => b.score - a.score).slice(0, 3);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = requestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid CV match request", issues: parsedBody.error.issues }, { status: 400 });
  }

  const { cvText, jobs } = parsedBody.data;

  try {
    const aiMatches = await getAiMatches(cvText, jobs);

    if (aiMatches) {
      return NextResponse.json({ source: "ai", matches: aiMatches });
    }
  } catch (error) {
    console.error("CV AI matching failed", error);
  }

  return NextResponse.json({ source: "local", matches: getLocalCvMatches(jobs, cvText) });
}
