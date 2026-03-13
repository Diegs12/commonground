import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STORIES_PER_PAGE } from "@/lib/constants";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || String(STORIES_PER_PAGE));

  // Get user's topic preferences
  const userTopics = await prisma.userTopic.findMany({
    where: { userId },
    select: { topicId: true, interestLevel: true },
  });

  const topicIds = userTopics.map((ut) => ut.topicId);

  // If user has no preferences, return all published stories
  const where = topicIds.length > 0
    ? { status: "PUBLISHED" as const, topics: { some: { topicId: { in: topicIds } } } }
    : { status: "PUBLISHED" as const };

  const [stories, total] = await Promise.all([
    prisma.story.findMany({
      where,
      include: {
        topics: { include: { topic: { select: { id: true, name: true, slug: true, icon: true } } } },
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.story.count({ where }),
  ]);

  return NextResponse.json({
    stories,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
