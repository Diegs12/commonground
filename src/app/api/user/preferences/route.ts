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

  const preferences = await prisma.userTopic.findMany({
    where: { userId },
    include: { topic: true },
  });

  return NextResponse.json(preferences);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const { topics } = await req.json();
  // topics: [{ topicId: string, interestLevel: number }]

  // Delete existing preferences
  await prisma.userTopic.deleteMany({ where: { userId } });

  // Create new ones
  if (topics && topics.length > 0) {
    await prisma.userTopic.createMany({
      data: topics.map((t: { topicId: string; interestLevel: number }) => ({
        userId,
        topicId: t.topicId,
        interestLevel: t.interestLevel || 3,
      })),
    });
  }

  // Mark onboarding as completed
  await prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  });

  return NextResponse.json({ success: true });
}
