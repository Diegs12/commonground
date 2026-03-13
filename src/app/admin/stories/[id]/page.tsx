"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";

interface StoryData {
  id: string;
  headline: string;
  summary: string;
  commonGround: string;
  leftNarrative: string;
  rightNarrative: string;
  implications: string;
  status: string;
  confidenceScore: number;
  sourceArticleCount: number;
  sourceArticles: { id: string; title: string; url: string; sourceName: string; sourceBias: string }[];
}

export default function AdminStoryEditPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<StoryData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/stories/${params.id}`)
      .then((r) => r.json())
      .then(setStory);
  }, [params.id]);

  async function save(overrides?: Partial<StoryData>) {
    if (!story) return;
    setSaving(true);
    await fetch(`/api/admin/stories/${story.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...story, ...overrides }),
    });
    setSaving(false);
    if (overrides?.status) router.push("/admin/stories");
  }

  if (!story) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/stories">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{story.status}</Badge>
          <ConfidenceBadge score={story.confidenceScore} />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label>Headline</Label>
          <Input
            value={story.headline}
            onChange={(e) => setStory({ ...story, headline: e.target.value })}
          />
        </div>

        <div>
          <Label>Summary</Label>
          <Textarea
            value={story.summary}
            onChange={(e) => setStory({ ...story, summary: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <Label className="text-emerald-700">Common Ground</Label>
          <Textarea
            value={story.commonGround}
            onChange={(e) => setStory({ ...story, commonGround: e.target.value })}
            rows={6}
            className="border-emerald-200 focus:border-emerald-400"
          />
        </div>

        <div>
          <Label className="text-blue-700">Left Narrative</Label>
          <Textarea
            value={story.leftNarrative}
            onChange={(e) => setStory({ ...story, leftNarrative: e.target.value })}
            rows={6}
            className="border-blue-200 focus:border-blue-400"
          />
        </div>

        <div>
          <Label className="text-red-700">Right Narrative</Label>
          <Textarea
            value={story.rightNarrative}
            onChange={(e) => setStory({ ...story, rightNarrative: e.target.value })}
            rows={6}
            className="border-red-200 focus:border-red-400"
          />
        </div>

        <div>
          <Label>Implications</Label>
          <Textarea
            value={story.implications}
            onChange={(e) => setStory({ ...story, implications: e.target.value })}
            rows={4}
          />
        </div>

        {/* Source articles */}
        {story.sourceArticles?.length > 0 && (
          <div>
            <Label>Source Articles ({story.sourceArticles.length})</Label>
            <div className="mt-2 space-y-1 text-sm">
              {story.sourceArticles.map((sa) => (
                <a
                  key={sa.id}
                  href={sa.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  [{sa.sourceBias}] {sa.sourceName}: {sa.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t">
        <Button onClick={() => save()} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        {story.status !== "PUBLISHED" && (
          <Button
            variant="default"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => save({ status: "PUBLISHED" })}
            disabled={saving}
          >
            <Check className="mr-1 h-4 w-4" />
            Publish
          </Button>
        )}
        {story.status !== "REJECTED" && (
          <Button
            variant="destructive"
            onClick={() => save({ status: "REJECTED" })}
            disabled={saving}
          >
            <X className="mr-1 h-4 w-4" />
            Reject
          </Button>
        )}
      </div>
    </div>
  );
}
