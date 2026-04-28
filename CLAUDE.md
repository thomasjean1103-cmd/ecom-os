@AGENTS.md

# Ecom Intelligence OS — Command Edition

Decision-first e-commerce operating system built with Next.js 16 App Router, React 19, Prisma (SQLite), and Tailwind CSS v4. Every screen captures raw business data and returns a structured `StandardModuleOutput` with a single actionable decision (NO_GO / TEST / ITERATE / KEEP / SCALE / NOT_ENOUGH_DATA).

## Stack

- **Next.js 16** (App Router, Server Actions, no API routes)
- **React 19** with server components by default
- **Prisma 6** + SQLite (`prisma/schema.prisma`, db file at `prisma/ecom-os.db`)
- **Tailwind CSS v4** (PostCSS plugin, zinc dark theme)
- **TypeScript 5**

## Running locally

```bash
npm install
# Set DATABASE_URL in .env (see .env.example)
npx prisma migrate deploy
npm run seed        # optional: seed with sample data
npm run dev
```

## Project structure

```
src/
  app/                  # Next.js App Router pages
    page.tsx            # Command Center (home, /)
    [screen]/page.tsx   # Fallback for screens without a dedicated file
    <screen>/page.tsx   # One file per implemented screen
    layout.tsx          # Root layout: Sidebar + MobileNav + OsProvider
    globals.css
  components/
    layout/
      header.tsx        # AppHeader — reads screen label/description from SCREENS
      sidebar.tsx       # Desktop nav (lg:block), links to all 14 screens
      mobile-nav.tsx    # Horizontal scroll nav for mobile
    ui/
      badge.tsx         # DecisionBadge — color-coded NO_GO/TEST/SCALE etc.
      card.tsx          # Card — rounded zinc panel with title/subtitle
      module-output-card.tsx  # ModuleOutputCard — renders StandardModuleOutput
      submit-button.tsx # SubmitButton — client component with pending state
  config/
    screens.ts          # SCREENS array: all 14 ScreenDefinitions with id/label/phase
  context/
    os-context.tsx      # OsProvider (client) — activeScreen state + dashboardData
  lib/
    types.ts            # Decision, StandardModuleOutput, ScreenId, ScreenDefinition
    intelligence.ts     # computeProductScore, productOutput, marketOutput, competitorOutput, vocOutput
    strategy.ts         # avatarOutput, positioningOutput, offerOutput, angleOutput
    module-outputs.ts   # copyLabOutput, creativeLabOutput, pdpOutput, croOutput, experimentOutput, memoryOutput, commandCenterData
    mock-data.ts        # decisionColorMap, dashboardData (demo KPIs), defaultModuleOutput
    json.ts             # safeJsonObject / safeJsonArray helpers
    prisma.ts           # Singleton PrismaClient
prisma/
  schema.prisma         # Full schema — Product, Avatar, Competitor, VocEntry, Experiment, etc.
  seed.mjs              # Optional seed script
  migrations/           # SQLite migration history
```

## The 14 screens

| Screen ID | Route | Phase | Status |
|---|---|---|---|
| command-center | `/` | 2 | Full DB-backed |
| product-scout | `/product-scout` | 3 | Full DB-backed |
| market-intel | `/market-intel` | 3 | Full DB-backed |
| competitor-board | `/competitor-board` | 3 | Full DB-backed |
| voc-vault | `/voc-vault` | 3 | Full DB-backed |
| avatar-studio | `/avatar-studio` | 4 | Full DB-backed |
| positioning | `/positioning` | 4 | Full DB-backed |
| offer-lab | `/offer-lab` | 4 | Full DB-backed |
| copy-lab | `/copy-lab` | 5 | Full DB-backed |
| creative-lab | `/creative-lab` | 5 | Full DB-backed |
| pdp-lab | `/pdp-lab` | 5 | Full DB-backed |
| cro-diagnostic | `/cro-diagnostic` | 6 | Full DB-backed |
| experiment-log | `/experiment-log` | 6 | Full DB-backed |
| learnings-patterns | `/learnings-patterns` | 7 | Full DB-backed |

## Core data contract

Every module returns `StandardModuleOutput` (`src/lib/types.ts`):

```ts
type StandardModuleOutput = {
  summary: string;
  key_findings: string[];
  decision: Decision;      // NO_GO | TEST | ITERATE | KEEP | SCALE | NOT_ENOUGH_DATA
  why: string;
  risks: string[];
  kill_criteria: string[];
  next_move: string;
  assets_to_generate: string[];
  structured_json: Record<string, unknown>;
};
```

## Conventions

- **Server Actions** for all mutations (`"use server"` inside page file, `revalidatePath` after write)
- **No API routes** — use Server Actions exclusively
- **Server components** by default; add `"use client"` only when needed (state, hooks)
- **JSON fields in SQLite** — arrays/objects stored as JSON strings, use `parseCsv` / `safeJsonObject` / `safeJsonArray` helpers
- **SubmitButton** (`src/components/ui/submit-button.tsx`) — always use for form submits (handles pending state)
- **Routing** — `command-center` maps to `/`, all others map to `/<screen-id>`
- **No hallucinated numbers** — all KPI examples in `mock-data.ts` are clearly labelled as demo data

## Adding a new screen

1. Add entry to `SCREENS` in `src/config/screens.ts` (id, label, description, phase)
2. Add the `ScreenId` union in `src/lib/types.ts`
3. Create `src/app/<screen-id>/page.tsx` following the pattern: Server Action → Prisma write → revalidatePath, then render `<AppHeader>` + form `<Card>` + `<ModuleOutputCard>`
4. Add output function in the appropriate lib file (`intelligence.ts`, `strategy.ts`, or `module-outputs.ts`)

## Environment

```
DATABASE_URL=file:./prisma/ecom-os.db
```
