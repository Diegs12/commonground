import { SOURCE_BIAS_MAP } from "./constants";

interface NewsAPIArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export async function fetchNewsAPIArticles(query?: string): Promise<
  {
    title: string;
    url: string;
    sourceName: string;
    sourceBias: string;
    snippet: string;
    fetchedAt: Date;
  }[]
> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error("NEWS_API_KEY not configured");

  const params = new URLSearchParams({
    apiKey,
    language: "en",
    country: "us",
    pageSize: "100",
  });

  if (query) {
    params.set("q", query);
  }

  const res = await fetch(`https://newsapi.org/v2/top-headlines?${params}`);
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);

  const data: NewsAPIResponse = await res.json();

  return data.articles
    .filter((a) => a.title && a.url && a.title !== "[Removed]")
    .map((a) => ({
      title: a.title,
      url: a.url,
      sourceName: a.source.name,
      sourceBias: SOURCE_BIAS_MAP[a.source.name] || "CENTER",
      snippet: a.description || "",
      fetchedAt: new Date(a.publishedAt),
    }));
}
