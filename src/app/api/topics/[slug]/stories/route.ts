import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STORIES_PER_PAGE } from "@/lib/constants";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || String(STORIES_PER_PAGE));

  const topic = await prisma.topic.findUnique({ where: { slug } });
  if (!topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const where = {
    status: "PUBLISHED" as const,
    topics: { some: { topicId: topic.id } },
  };

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
    topic,
    stories,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
