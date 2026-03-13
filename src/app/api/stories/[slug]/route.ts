import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await prisma.story.findUnique({
    where: { slug },
    include: {
      topics: { include: { topic: { select: { id: true, name: true, slug: true, icon: true } } } },
      sourceArticles: {
        select: { id: true, title: true, url: true, sourceName: true, sourceBias: true },
        orderBy: { sourceBias: "asc" },
      },
    },
  });

  if (!story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  return NextResponse.json(story);
}
