import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StoryCard } from "@/components/StoryCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) return { title: "Topic Not Found" };
  return {
    title: `${topic.name} | CommonGround`,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) notFound();

  const stories = await prisma.story.findMany({
    where: {
      status: "PUBLISHED",
      topics: { some: { topicId: topic.id } },
    },
    include: {
      topics: {
        include: { topic: { select: { id: true, name: true, slug: true, icon: true } } },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/topics">
          <ArrowLeft className="mr-1 h-4 w-4" />
          All Topics
        </Link>
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{topic.icon}</span>
          <h1 className="text-2xl font-bold text-gray-900">{topic.name}</h1>
        </div>
        <p className="text-sm text-gray-500">{topic.description}</p>
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
          <p className="text-gray-500">No stories in this topic yet.</p>
        </div>
      )}
    </div>
  );
}
