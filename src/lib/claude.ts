import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ClusterResult {
  stories: {
    headline: string;
    articleIds: string[];
  }[];
}

export interface AnalysisResult {
  headline: string;
  summary: string;
  common_ground: string;
  left_narrative: string;
  right_narrative: string;
  implications: string;
  confidence_score: number;
  topics: string[];
}

export async function clusterArticles(
  articles: { id: string; title: string; snippet: string; sourceName: string; sourceBias: string }[]
): Promise<ClusterResult> {
  const articlesText = articles
    .map((a) => `[ID: ${a.id}] [${a.sourceName} - ${a.sourceBias}] ${a.title}\n${a.snippet || ""}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a news editor. Given these articles, identify distinct news stories/events.
Group the articles by which story they belong to. A story is a single event or
development that multiple outlets are covering.

Only include stories that are relevant to US policy, systemic issues (education,
healthcare, economy, technology, environment), or significant national developments.
Exclude local crime, celebrity news, fear-bait, and small-scale incidents.

Return ONLY valid JSON with this structure:
{
  "stories": [
    {
      "headline": "Neutral factual headline",
      "articleIds": ["id1", "id2"]
    }
  ]
}

Articles:
${articlesText}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse clustering response");
  return JSON.parse(jsonMatch[0]);
}

export async function analyzeStory(
  articles: { title: string; snippet: string; sourceName: string; sourceBias: string }[]
): Promise<AnalysisResult> {
  const articlesText = articles
    .map((a) => `[${a.sourceName} - ${a.sourceBias}] ${a.title}\n${a.snippet || ""}`)
    .join("\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are a balanced news analyst. Given these articles about the same story from
various outlets, produce the following analysis.

IMPORTANT: Never use em dashes in your writing. Use commas, periods, or semicolons instead.

1. HEADLINE: A neutral, factual headline. No spin, no emotional language.

2. SUMMARY: 2-3 sentences summarizing the story neutrally.

3. COMMON GROUND: Write a factual, neutral account of what actually happened.
   No spin, no emotional language, no connotation about whether this is good or bad.
   Just the facts that all sources agree on.

4. LEFT NARRATIVE: Summarize how left-leaning sources (Democratic voices, progressive
   outlets) are framing this story. What do they emphasize? What concerns do they raise?
   What policy positions do they advocate? Be fair and accurate in representing their view.

5. RIGHT NARRATIVE: Summarize how right-leaning sources (Republican voices, conservative
   outlets) are framing this story. What do they emphasize? What concerns do they raise?
   What policy positions do they advocate? Be fair and accurate in representing their view.

6. IMPLICATIONS: What could this realistically mean for US citizens? Do not use
   fear-based language. Do not predict doom. Simply state what outcomes are worth
   considering and why an informed citizen should be aware of this development.

7. CONFIDENCE SCORE: Rate your confidence (0.0-1.0) in the quality and balance of
   this analysis. Lower confidence if: you only have sources from one side, the story
   is ambiguous, or you are unsure about factual claims.

8. TOPICS: Assign one or more topic slugs from this list:
   [us-policy, education, healthcare, ai-tech, economy, environment,
   national-security, foreign-policy, civil-rights, infrastructure, immigration,
   criminal-justice, housing, labor]

Return ONLY valid JSON:
{
  "headline": "...",
  "summary": "...",
  "common_ground": "...",
  "left_narrative": "...",
  "right_narrative": "...",
  "implications": "...",
  "confidence_score": 0.85,
  "topics": ["us-policy", "economy"]
}

Articles:
${articlesText}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse analysis response");
  return JSON.parse(jsonMatch[0]);
}
