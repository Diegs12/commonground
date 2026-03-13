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

  let settings = await prisma.adminSettings.findFirst({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.adminSettings.create({
      data: { id: "default" },
    });
  }

  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data = await req.json();

  const settings = await prisma.adminSettings.upsert({
    where: { id: "default" },
    update: {
      confidenceThreshold: data.confidenceThreshold,
      autoPublishEnabled: data.autoPublishEnabled,
      ingestionIntervalMin: data.ingestionIntervalMin,
    },
    create: {
      id: "default",
      confidenceThreshold: data.confidenceThreshold ?? 0.8,
      autoPublishEnabled: data.autoPublishEnabled ?? true,
      ingestionIntervalMin: data.ingestionIntervalMin ?? 60,
    },
  });

  return NextResponse.json(settings);
}
