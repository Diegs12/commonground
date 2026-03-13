import { prisma } from "./prisma";
import { clusterArticles, analyzeStory } from "./claude";
import { DEFAULT_CONFIDENCE_THRESHOLD, AUTO_REJECT_THRESHOLD } from "./constants";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export async function runAnalysisPipeline(): Promise<{
  storiesCreated: number;
  storiesPublished: number;
  storiesRejected: number;
}> {
  let storiesCreated = 0;
  let storiesPublished = 0;
  let storiesRejected = 0;

  // Get admin settings for threshold
  const settings = await prisma.adminSettings.findFirst({
    where: { id: "default" },
  });
  const threshold = settings?.confidenceThreshold ?? DEFAULT_CONFIDENCE_THRESHOLD;

  // Get ungrouped articles (no story_id assigned)
  const ungroupedArticles = await prisma.sourceArticle.findMany({
    where: { storyId: null },
    orderBy: { fetchedAt: "desc" },
    take: 200,
  });

  if (ungroupedArticles.length < 3) {
    return { storiesCreated: 0, storiesPublished: 0, storiesRejected: 0 };
  }

  // Step 1: Cluster articles into stories
  const clusters = await clusterArticles(
    ungroupedArticles.map((a) => ({
      id: a.id,
      title: a.title,
      snippet: a.snippet || "",
      sourceName: a.sourceName,
      sourceBias: a.sourceBias,
    }))
  );

  // Step 2: Analyze each cluster
  for (const cluster of clusters.stories) {
    if (cluster.articleIds.length < 2) continue;

    const clusterArticleData = ungroupedArticles.filter((a) =>
      cluster.articleIds.includes(a.id)
    );

    if (clusterArticleData.length < 2) continue;

    try {
      const analysis = await analyzeStory(
        clusterArticleData.map((a) => ({
          title: a.title,
          snippet: a.snippet || "",
          sourceName: a.sourceName,
          sourceBias: a.sourceBias,
        }))
      );

      // Determine status based on confidence
      let status: "PUBLISHED" | "PENDING_REVIEW" | "REJECTED";
      if (analysis.confidence_score >= threshold) {
        status = "PUBLISHED";
        storiesPublished++;
      } else if (analysis.confidence_score < AUTO_REJECT_THRESHOLD) {
        status = "REJECTED";
        storiesRejected++;
      } else {
        status = "PENDING_REVIEW";
      }

      // Generate unique slug
      let slug = slugify(analysis.headline);
      const existingSlug = await prisma.story.findUnique({ where: { slug } });
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }

      // Create the story
      const story = await prisma.story.create({
        data: {
          headline: analysis.headline,
          slug,
          summary: analysis.summary,
          commonGround: analysis.common_ground,
          leftNarrative: analysis.left_narrative,
          rightNarrative: analysis.right_narrative,
          implications: analysis.implications,
          status,
          confidenceScore: analysis.confidence_score,
          confidenceThresholdMet: analysis.confidence_score >= threshold,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          sourceArticleCount: clusterArticleData.length,
        },
      });

      // Link topics
      for (const topicSlug of analysis.topics) {
        const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
        if (topic) {
          await prisma.storyTopic.create({
            data: {
              storyId: story.id,
              topicId: topic.id,
              relevanceScore: 1.0,
            },
          });
        }
      }

      // Link source articles to this story
      await prisma.sourceArticle.updateMany({
        where: { id: { in: clusterArticleData.map((a) => a.id) } },
        data: { storyId: story.id },
      });

      storiesCreated++;
    } catch (err) {
      console.error("Failed to analyze story cluster:", err);
    }
  }

  return { storiesCreated, storiesPublished, storiesRejected };
}
