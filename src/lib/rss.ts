import Parser from "rss-parser";
import { RSS_FEEDS, SOURCE_BIAS_MAP } from "./constants";

const parser = new Parser({
  timeout: 10000,
});

interface FeedArticle {
  title: string;
  url: string;
  sourceName: string;
  sourceBias: string;
  snippet: string;
  fetchedAt: Date;
}

export async function fetchRSSArticles(): Promise<FeedArticle[]> {
  const results: FeedArticle[] = [];

  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url);
      const articles = (parsed.items || []).slice(0, 20).map((item) => ({
        title: item.title || "",
        url: item.link || "",
        sourceName: feed.name,
        sourceBias: feed.bias,
        snippet: item.contentSnippet?.slice(0, 500) || item.content?.slice(0, 500) || "",
        fetchedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      }));
      return articles.filter((a) => a.title && a.url);
    } catch {
      console.error(`Failed to fetch RSS feed: ${feed.name} (${feed.url})`);
      return [];
    }
  });

  const feedResults = await Promise.allSettled(feedPromises);
  for (const result of feedResults) {
    if (result.status === "fulfilled") {
      results.push(...result.value);
    }
  }

  return results;
}
