export type {
  User,
  Topic,
  Story,
  StoryTopic,
  SourceArticle,
  UserTopic,
  QuizQuestion,
  QuizOption,
  UserQuizResponse,
  Bookmark,
  AdminSettings,
} from "@/generated/prisma/client";

export type {
  StoryStatus,
  SourceBias,
  QuestionType,
  AuthProvider,
} from "@/generated/prisma/client";

export interface StoryWithTopics {
  id: string;
  headline: string;
  slug: string;
  summary: string;
  commonGround: string;
  leftNarrative: string;
  rightNarrative: string;
  implications: string;
  status: string;
  confidenceScore: number;
  publishedAt: Date | null;
  sourceArticleCount: number;
  createdAt: Date;
  topics: {
    topic: {
      id: string;
      name: string;
      slug: string;
      icon: string;
    };
    relevanceScore: number;
  }[];
  sourceArticles?: {
    id: string;
    title: string;
    url: string;
    sourceName: string;
    sourceBias: string;
  }[];
}

export interface AIAnalysisResult {
  headline: string;
  summary: string;
  commonGround: string;
  leftNarrative: string;
  rightNarrative: string;
  implications: string;
  confidenceScore: number;
  topics: string[];
}

export interface StoryCluster {
  headline: string;
  articleIds: string[];
}

export interface FeedParams {
  page?: number;
  limit?: number;
  topic?: string;
  search?: string;
}
