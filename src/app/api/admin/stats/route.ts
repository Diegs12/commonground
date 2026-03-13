import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalStories,
    publishedStories,
    pendingStories,
    rejectedStories,
    totalUsers,
    totalArticles,
  ] = await Promise.all([
    prisma.story.count(),
    prisma.story.count({ where: { status: "PUBLISHED" } }),
    prisma.story.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.story.count({ where: { status: "REJECTED" } }),
    prisma.user.count(),
    prisma.sourceArticle.count(),
  ]);

  return NextResponse.json({
    totalStories,
    publishedStories,
    pendingStories,
    rejectedStories,
    totalUsers,
    totalArticles,
    approvalRate: totalStories > 0 ? publishedStories / totalStories : 0,
  });
}
