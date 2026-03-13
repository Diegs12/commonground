import { prisma } from "./prisma";
import { fetchNewsAPIArticles } from "./newsapi";
import { fetchRSSArticles } from "./rss";
import { SourceBias } from "@/generated/prisma/client";

export async function ingestArticles(): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  // Fetch from both sources in parallel
  const [newsApiArticles, rssArticles] = await Promise.allSettled([
    fetchNewsAPIArticles(),
    fetchRSSArticles(),
  ]);

  const allArticles = [
    ...(newsApiArticles.status === "fulfilled" ? newsApiArticles.value : []),
    ...(rssArticles.status === "fulfilled" ? rssArticles.value : []),
  ];

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  for (const article of unique) {
    try {
      const existing = await prisma.sourceArticle.findUnique({
        where: { url: article.url },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.sourceArticle.create({
        data: {
          title: article.title,
          url: article.url,
          sourceName: article.sourceName,
          sourceBias: (article.sourceBias as SourceBias) || "CENTER",
          snippet: article.snippet,
          fetchedAt: article.fetchedAt,
        },
      });
      inserted++;
    } catch {
      skipped++;
    }
  }

  return { inserted, skipped };
}
