"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TopicPicker } from "@/components/TopicPicker";
import Link from "next/link";

type Topic = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<{ topicId: string; interestLevel: number }[]>([]);
  const [initialSelected, setInitialSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/topics").then((r) => r.json()).then(setTopics);
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((prefs: { topicId: string }[]) => {
        if (Array.isArray(prefs)) {
          setInitialSelected(prefs.map((p) => p.topicId));
          setSelectedTopics(prefs.map((p) => ({ topicId: p.topicId, interestLevel: 3 })));
        }
      });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/user/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topics: selectedTopics }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (status === "loading") return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Account</h2>
        <p className="text-sm text-gray-500 mb-4">Signed in as {session?.user?.email}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-1">Your Topics</h2>
        <p className="text-sm text-gray-500 mb-4">Select the topics you want in your feed.</p>
        <TopicPicker
          topics={topics}
          onSelect={setSelectedTopics}
          initialSelected={initialSelected}
        />
        <div className="flex items-center gap-3 mt-4">
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save preferences"}
          </Button>
          {saved && <span className="text-sm text-emerald-600">Saved!</span>}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">Retake Quiz</h2>
        <p className="text-sm text-gray-500 mb-3">Want to redo your personalization?</p>
        <Button variant="outline" asChild>
          <Link href="/onboarding">Retake onboarding quiz</Link>
        </Button>
      </div>
    </div>
  );
}
