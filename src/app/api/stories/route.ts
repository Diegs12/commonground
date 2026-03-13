import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STORIES_PER_PAGE } from "@/lib/constants";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || String(STORIES_PER_PAGE));
  const topic = searchParams.get("topic");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = { status: "PUBLISHED" };

  if (topic) {
    where.topics = { some: { topic: { slug: topic } } };
  }

  if (search) {
    where.OR = [
      { headline: { contains: search, mode: "insensitive" } },
      { summary: { contains: search, mode: "insensitive" } },
    ];
  }

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
