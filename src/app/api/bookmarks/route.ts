import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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

  return NextResponse.json(bookmarks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const { storyId } = await req.json();
  if (!storyId) {
    return NextResponse.json({ error: "storyId required" }, { status: 400 });
  }

  const existing = await prisma.bookmark.findUnique({
    where: { userId_storyId: { userId, storyId } },
  });

  if (existing) {
    // Toggle off - remove bookmark
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({ data: { userId, storyId } });
  return NextResponse.json({ bookmarked: true }, { status: 201 });
}
