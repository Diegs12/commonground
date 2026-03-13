import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  PENDING_REVIEW: "bg-yellow-100 text-yellow-700",
  DRAFT: "bg-gray-100 text-gray-700",
  REJECTED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default async function AdminStoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) redirect("/");

  const sp = await searchParams;
  const where: Record<string, unknown> = {};
  if (sp.status) where.status = sp.status;

  let stories: { id: string; headline: string; summary: string; status: string; confidenceScore: number; createdAt: Date; topics: { topic: { name: string; slug: string } }[] }[] = [];
  try {
    const { prisma } = await import("@/lib/prisma");
    stories = await prisma.story.findMany({
      where,
      include: {
        topics: { include: { topic: { select: { name: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    // Database unavailable — render empty state
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">All Stories</h1>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["All", "PUBLISHED", "PENDING_REVIEW", "DRAFT", "REJECTED"].map((s) => (
          <Link
            key={s}
            href={s === "All" ? "/admin/stories" : `/admin/stories?status=${s}`}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              (s === "All" && !sp.status) || sp.status === s
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {s === "PENDING_REVIEW" ? "Pending" : s === "All" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/admin/stories/${story.id}`}
            className="block rounded-lg border bg-white p-4 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{story.headline}</h3>
                <p className="text-sm text-gray-500 truncate">{story.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={statusColors[story.status]} variant="secondary">
                    {story.status === "PENDING_REVIEW" ? "Pending" : story.status}
                  </Badge>
                  <ConfidenceBadge score={story.confidenceScore} />
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(story.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {stories.length === 0 && (
          <p className="text-center text-gray-500 py-8">No stories found.</p>
        )}
      </div>
    </div>
  );
}
