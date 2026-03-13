"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface StoryCardProps {
  story: {
    slug: string;
    headline: string;
    summary: string;
    publishedAt: string | null;
    sourceArticleCount: number;
    topics: {
      topic: { name: string; slug: string; icon: string };
    }[];
  };
}

export function StoryCard({ story }: StoryCardProps) {
  const timeAgo = story.publishedAt
    ? formatDistanceToNow(new Date(story.publishedAt), { addSuffix: true })
    : "Recently";

  return (
    <Link href={`/story/${story.slug}`}>
      <Card className="transition-all hover:shadow-md hover:border-gray-300 cursor-pointer">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1.5 flex-wrap">
              {story.topics.slice(0, 3).map(({ topic }) => (
                <Badge key={topic.slug} variant="secondary" className="text-xs font-normal">
                  {topic.icon} {topic.name}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{timeAgo}</span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug mb-2">
            {story.headline}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
            {story.summary}
          </p>

          {/* Narrative bars */}
          <div className="flex gap-1 mb-2">
            <div className="h-1 flex-1 rounded-full bg-blue-500" />
            <div className="h-1 flex-1 rounded-full bg-emerald-500" />
            <div className="h-1 flex-1 rounded-full bg-red-500" />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-3">
            <span>Left</span>
            <span>Common Ground</span>
            <span>Right</span>
          </div>

          <p className="text-xs text-gray-400">
            Based on {story.sourceArticleCount} source article{story.sourceArticleCount !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
