import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      topics: { include: { topic: true } },
      sourceArticles: true,
    },
  });

  if (!story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  return NextResponse.json(story);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "headline", "summary", "commonGround", "leftNarrative",
    "rightNarrative", "implications", "status",
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (data.status === "PUBLISHED" && !data.publishedAt) {
    updateData.publishedAt = new Date();
  }

  const story = await prisma.story.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(story);
}
