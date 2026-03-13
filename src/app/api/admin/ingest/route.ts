import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ingestArticles } from "@/lib/ingestion";
import { runAnalysisPipeline } from "@/lib/analysis";

export async function POST() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id: string; isAdmin?: boolean } | undefined;
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ingestionResult = await ingestArticles();
  const analysisResult = await runAnalysisPipeline();

  return NextResponse.json({ ingestion: ingestionResult, analysis: analysisResult });
}
