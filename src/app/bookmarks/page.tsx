import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StoryCard } from "@/components/StoryCard";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as { id: string }).id;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      story: {
        include: {
          topics: { include: { topic: { select: { id: true, name: true, slug: true, icon: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookmarks</h1>

      {bookmarks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {bookmarks.map((bm) => (
            <StoryCard key={bm.id} story={JSON.parse(JSON.stringify(bm.story))} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No bookmarked stories yet. Tap the bookmark icon on any story to save it.</p>
        </div>
      )}
    </div>
  );
}
