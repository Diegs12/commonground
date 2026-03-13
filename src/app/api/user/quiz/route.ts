import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const { responses } = await req.json();
  // responses: [{ questionId: string, selectedOptionId: string }]

  // Save quiz responses
  for (const response of responses) {
    await prisma.userQuizResponse.upsert({
      where: { userId_questionId: { userId, questionId: response.questionId } },
      update: { selectedOptionId: response.selectedOptionId },
      create: {
        userId,
        questionId: response.questionId,
        selectedOptionId: response.selectedOptionId,
      },
    });
  }

  // Calculate topic preferences from quiz responses
  const savedResponses = await prisma.userQuizResponse.findMany({
    where: { userId },
    include: { selectedOption: true },
  });

  const topicScores: Record<string, number> = {};
  for (const resp of savedResponses) {
    const mappings = resp.selectedOption.topicMappings as Record<string, number>;
    if (mappings && typeof mappings === "object") {
      for (const [topicId, weight] of Object.entries(mappings)) {
        topicScores[topicId] = (topicScores[topicId] || 0) + weight;
      }
    }
  }

  // Normalize scores to 1-5 and save as preferences
  const maxScore = Math.max(...Object.values(topicScores), 1);
  await prisma.userTopic.deleteMany({ where: { userId } });

  const topicEntries = Object.entries(topicScores)
    .filter(([, score]) => score > 0)
    .map(([topicId, score]) => ({
      userId,
      topicId,
      interestLevel: Math.max(1, Math.round((score / maxScore) * 5)),
    }));

  if (topicEntries.length > 0) {
    await prisma.userTopic.createMany({ data: topicEntries });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { onboardingCompleted: true },
  });

  return NextResponse.json({ success: true, topicsAssigned: topicEntries.length });
}
