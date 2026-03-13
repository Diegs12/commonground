import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/StoryCard";

export const dynamic = "force-dynamic";

async function getLatestStories() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.story.findMany({
      where: { status: "PUBLISHED" },
      include: {
        topics: {
          include: { topic: { select: { id: true, name: true, slug: true, icon: true } } },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 10,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const stories = await getLatestStories();

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-8 w-2 rounded-full bg-blue-500" />
            <div className="h-8 w-2 rounded-full bg-emerald-500" />
            <div className="h-8 w-2 rounded-full bg-red-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            News without the spin.
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            For every story, see what the left says, what the right says, and the facts both sides
            agree on. No fear. No manipulation. Just clarity.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          How CommonGround works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          <div className="rounded-xl border bg-blue-50 p-6 text-center">
            <div className="text-3xl mb-3">📘</div>
            <h3 className="font-semibold text-blue-700 mb-2">Left Perspective</h3>
            <p className="text-sm text-gray-600">
              How progressive and Democratic voices are framing the story. What they emphasize and
              what concerns they raise.
            </p>
          </div>
          <div className="rounded-xl border bg-emerald-50 p-6 text-center">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="font-semibold text-emerald-700 mb-2">Common Ground</h3>
            <p className="text-sm text-gray-600">
              The facts both sides agree on. No spin, no connotation, no emotional framing. Just
              what happened.
            </p>
          </div>
          <div className="rounded-xl border bg-red-50 p-6 text-center">
            <div className="text-3xl mb-3">📕</div>
            <h3 className="font-semibold text-red-700 mb-2">Right Perspective</h3>
            <p className="text-sm text-gray-600">
              How conservative and Republican voices are framing the story. What they emphasize and
              what concerns they raise.
            </p>
          </div>
        </div>
      </section>

      {/* Latest stories */}
      {stories.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Stories</h2>
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
        </section>
      )}

      {/* Empty state */}
      {stories.length === 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 text-center">
          <div className="rounded-xl border bg-white p-12">
            <p className="text-gray-500 text-lg mb-2">
              Stories are being gathered and analyzed.
            </p>
            <p className="text-gray-400 text-sm">
              Check back soon for balanced news coverage across the political spectrum.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t bg-white mt-8">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <div className="h-4 w-1 rounded-full bg-blue-500" />
                <div className="h-4 w-1 rounded-full bg-emerald-500" />
                <div className="h-4 w-1 rounded-full bg-red-500" />
              </div>
              <span className="text-sm font-semibold text-gray-700">CommonGround</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/about" className="hover:text-gray-700">About</Link>
              <Link href="/topics" className="hover:text-gray-700">Topics</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
