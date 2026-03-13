import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  let topics: { id: string; slug: string; icon: string | null; name: string; description: string | null }[] = [];
  try {
    const { prisma } = await import("@/lib/prisma");
    topics = await prisma.topic.findMany({
      where: { parentTopicId: null },
      orderBy: { name: "asc" },
    });
  } catch {
    // Database unavailable — render empty state
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Topics</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="flex flex-col items-center gap-2 rounded-xl border bg-white p-5 text-center transition-all hover:shadow-md hover:border-gray-300"
          >
            <span className="text-3xl">{topic.icon}</span>
            <span className="text-sm font-medium text-gray-900">{topic.name}</span>
            <span className="text-xs text-gray-500 line-clamp-2">{topic.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
