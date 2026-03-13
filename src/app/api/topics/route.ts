import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(topics);
}
