import { notFound } from "next/navigation";
import Link from "next/link";
import { NarrativeSection } from "@/components/NarrativeSection";
import { TopicTag } from "@/components/TopicTag";
import { SourceList } from "@/components/SourceList";
import { BookmarkButton } from "@/components/BookmarkButton";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getStory(slug: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma.story.findUnique({
      where: { slug },
      include: {
        topics: {
          include: { topic: { select: { id: true, name: true, slug: true, icon: true } } },
        },
        sourceArticles: {
          select: { id: true, title: true, url: true, sourceName: true, sourceBias: true },
          orderBy: { sourceBias: "asc" },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Story Not Found" };
  return {
    title: `${story.headline} | CommonGround`,
    description: story.summary,
    openGraph: {
      title: story.headline,
      description: story.summary,
      type: "article",
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const timeAgo = story.publishedAt
    ? formatDistanceToNow(story.publishedAt, { addSuffix: true })
    : "Recently";

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back button + Bookmark */}
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/feed">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <BookmarkButton storyId={story.id} />
      </div>

      {/* Topic tags */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {story.topics.map(({ topic }) => (
          <TopicTag key={topic.slug} topic={topic} />
        ))}
      </div>

      {/* Headline */}
      <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl leading-tight">
        {story.headline}
      </h1>

      {/* Meta */}
      <p className="mb-6 text-sm text-gray-500">
        Published {timeAgo} · {story.sourceArticleCount} source article{story.sourceArticleCount !== 1 ? "s" : ""}
      </p>

      {/* Summary */}
      <p className="mb-8 text-base text-gray-700 leading-relaxed">{story.summary}</p>

      {/* Narrative sections */}
      <div className="space-y-6 mb-8">
        <NarrativeSection
          title="Common Ground"
          content={story.commonGround}
          color="green"
        />
        <NarrativeSection
          title="Left Perspective"
          content={story.leftNarrative}
          color="blue"
        />
        <NarrativeSection
          title="Right Perspective"
          content={story.rightNarrative}
          color="red"
        />
        <NarrativeSection
          title="What This Means for You"
          content={story.implications}
          color="gray"
        />
      </div>

      {/* Source articles */}
      {story.sourceArticles.length > 0 && (
        <div className="border-t pt-6">
          <SourceList sources={story.sourceArticles} />
        </div>
      )}
    </div>
  );
}
