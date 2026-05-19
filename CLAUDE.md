# LokerHub Project Context

LokerHub is an Indonesian job-post aggregator/router built with Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

## Product Goal

Help Indonesian job seekers discover job posts from multiple sources in one place, then route them to the original source to apply.

## MVP Direction

Build a simple job aggregation web app with:

- Landing page
- Job listing page
- Job detail page
- Search/filter by keyword, location, category, and source
- Basic admin/import flow via seed script, CSV/JSON import, and manual admin form
- PostgreSQL database for normalized job posts
- Source URL routing to original job post

## Commands

- `npm install` — install dependencies
- `docker compose up -d postgres` — start local PostgreSQL
- `cp .env.example .env` — create local database env file if missing
- `npm run db:generate` — generate Prisma client
- `npm run db:push` — push Prisma schema to local PostgreSQL
- `npm run db:studio` — open Prisma Studio
- `npm run seed` — upsert bundled sample jobs into PostgreSQL
- `npm run import:json` — import `data/imports/jobs.json`
- `npm run import:csv` — import `data/imports/jobs.csv`
- `tsx scripts/import-jobs.ts <file.json|file.csv>` — import a specific JSON or CSV file
- `npm run dev` — start the local Next.js development server
- `npm run build` — build the production app
- `npm run start` — run the built production app
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks without emitting files
- `npm run test` — run automated tests once
- `npm run test:watch` — run tests in watch mode
- `npm run test -- tests/jobs.test.ts` — run a single test file

## Architecture

- `prisma/schema.prisma` defines the PostgreSQL `JobPost` model.
- `docker-compose.yml` provides a local PostgreSQL service using the credentials in `.env.example`.
- `lib/prisma.ts` owns the shared Prisma client.
- `lib/jobs.ts` is the backend/data contract. It defines the Zod `JobPost` schema, Prisma-backed listing/detail/facet queries, import upserts, sample data, and pure filtering helpers used by tests.
- `lib/importJobs.ts` parses and validates JSON, CSV, and manual form imports before database upsert.
- `app/page.tsx` is the landing page and reads aggregate job counts/facets from PostgreSQL.
- `app/jobs/page.tsx` is the browse page. It uses server-side `searchParams` and calls `getJobs()` with keyword/location/category/source filters.
- `app/jobs/[id]/page.tsx` is the job detail page and links users to `sourceUrl` for applying.
- `app/admin/import/page.tsx` is a small internal manual import form; it is intentionally not a full admin dashboard.
- `app/api/jobs/route.ts` and `app/api/jobs/[id]/route.ts` expose the same listing/detail contract for future client-side or external use.
- `components/JobCard.tsx` is the reusable listing card component.
- `scripts/seed.ts` loads bundled sample jobs into PostgreSQL.
- `scripts/import-jobs.ts` imports normalized JSON/CSV files into PostgreSQL.
- `tests/` covers filtering, import parsing, and job card rendering with Vitest and Testing Library.

## Agent Team

Use these agents:

- @orchestrator: coordinates the whole team.
- @owner: defines product direction, user value, positioning, MVP scope.
- @pm: breaks work into milestones, tasks, acceptance criteria.
- @frontend: builds Next.js UI, components, pages, UX.
- @backend: builds API, database schema, scraping/import logic, integrations.

## Working Style

For large tasks, always use @orchestrator first.

The orchestrator should:
1. Consult @owner for product direction.
2. Consult @pm for task breakdown.
3. Coordinate @frontend and @backend.
4. Make frontend/backend agree on API contracts.
5. Ask @pm to verify the result.

## Technical Preferences

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma with PostgreSQL for normalized job storage
- Zod for validation when useful
- Simple architecture first
- Avoid over-engineering

## LokerHub Data Model

A job post includes:

- id
- title
- company
- location
- salaryText
- employmentType
- category
- sourceName
- sourceUrl
- description
- postedAt
- scrapedAt
- createdAt
- updatedAt

## Rules

- Keep the MVP small.
- Do not implement complex scraping before the core web app works.
- Prioritize clean job listing, search, and source routing.
- Document assumptions.
- Run build/lint when possible.
