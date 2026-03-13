# CommonGround

Balanced news platform. Shows left perspective, right perspective, and factual common ground for every story.

## Tech Stack
- Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui (base-ui variant)
- Prisma 7 with PostgreSQL (via `@prisma/adapter-pg`), config in `prisma.config.ts`
- NextAuth v4 (JWT strategy, credentials + Google OAuth)
- Claude API (claude-sonnet-4-20250514) for article analysis
- NewsAPI + RSS feeds for article ingestion

## Key Commands
- `npm run dev` - Start dev server
- `npx next build` - Build (will fail without DATABASE_URL)
- `npx tsc --noEmit` - Type check only
- `npx prisma generate` - Regenerate Prisma client
- `npx prisma db push` - Push schema to database
- `npx tsx prisma/seed.ts` - Seed topics, quiz questions, admin user

## Prisma 7 Notes
- No `url` in schema.prisma datasource block; connection string is in `prisma.config.ts`
- PrismaClient requires `adapter` argument (using `PrismaPg`)
- Generated client is at `src/generated/prisma/client` (not index)
- Seed file is excluded from tsconfig (runs via tsx)

## Rules
- Never use em dashes in any content, including AI-generated text
- All AI analysis prompts explicitly instruct against em dashes
- shadcn components are base-ui v4 variant; use `render` prop instead of `asChild` on non-Button components
- Button component uses Radix Slot for `asChild` support
