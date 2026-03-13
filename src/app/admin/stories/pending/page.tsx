import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function PendingStoriesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) redirect("/");

  const stories = await prisma.story.findMany({
    where: { status: "PENDING_REVIEW" },
    include: {
      topics: { include: { topic: { select: { name: true, icon: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Queue</h1>
      <p className="text-gray-500 mb-6">
        {stories.length} {stories.length === 1 ? "story" : "stories"} pending review
      </p>

      <div className="space-y-3">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/admin/stories/${story.id}`}
            className="block rounded-lg border border-yellow-200 bg-yellow-50/50 p-4 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium text-gray-900">{story.headline}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{story.summary}</p>
            <div className="flex items-center gap-3 mt-2">
              <ConfidenceBadge score={story.confidenceScore} />
              <span className="text-xs text-gray-400">
                {story.sourceArticleCount} sources
              </span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(story.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
        ))}

        {stories.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-500">No stories pending review. All clear!</p>
          </div>
        )}
      </div>
    </div>
  );
}
