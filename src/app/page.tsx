import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/StoryCard";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // ISR: revalidate every 5 minutes

async function getLatestStories() {
  const stories = await prisma.story.findMany({
    where: { status: "PUBLISHED" },
    include: {
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true, icon: true } } },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });
  return stories;
}

export default async function HomePage() {
  const stories = await getLatestStories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Hero */}
      <section className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="h-8 w-2 rounded-full bg-blue-500" />
          <div className="h-8 w-2 rounded-full bg-emerald-500" />
          <div className="h-8 w-2 rounded-full bg-red-500" />
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          News Without the Spin
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-base text-gray-600 sm:text-lg">
          Every story shows you what happened, how the left frames it, how the right frames it,
          and what it actually means for you. No fear-bait. No outrage. Just clarity.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/about">How It Works</Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-blue-50 p-5 text-center">
          <div className="mb-2 text-2xl">📘</div>
          <h3 className="mb-1 font-semibold text-blue-700">Left Perspective</h3>
          <p className="text-sm text-gray-600">
            How progressive and Democratic voices are framing the story.
          </p>
        </div>
        <div className="rounded-xl border bg-emerald-50 p-5 text-center">
          <div className="mb-2 text-2xl">✅</div>
          <h3 className="mb-1 font-semibold text-emerald-700">Common Ground</h3>
          <p className="text-sm text-gray-600">
            The facts both sides agree on. No spin, no connotation.
          </p>
        </div>
        <div className="rounded-xl border bg-red-50 p-5 text-center">
          <div className="mb-2 text-2xl">📕</div>
          <h3 className="mb-1 font-semibold text-red-700">Right Perspective</h3>
          <p className="text-sm text-gray-600">
            How conservative and Republican voices are framing the story.
          </p>
        </div>
      </section>

      {/* Latest Stories */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Latest Stories</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/feed">View all</Link>
          </Button>
        </div>
        {stories.length > 0 ? (
          <div className="grid gap-4">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={{
                  ...story,
                  publishedAt: story.publishedAt?.toISOString() ?? null,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-12 text-center">
            <p className="text-gray-500">
              Stories are being analyzed. Check back soon for balanced coverage.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
