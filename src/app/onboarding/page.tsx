"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { QuizFlow } from "@/components/QuizFlow";
import { TopicPicker } from "@/components/TopicPicker";

type QuizQuestion = {
  id: string;
  questionText: string;
  questionType: string;
  options: { id: string; optionText: string; order: number }[];
};

type Topic = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "quiz" | "topics">("choose");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/topics").then((r) => r.json()).then(setTopics);
  }, []);

  async function handleQuizComplete(responses: { questionId: string; selectedOptionId: string }[]) {
    setLoading(true);
    await fetch("/api/user/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses }),
    });
    router.push("/feed");
  }

  async function handleTopicSelect(selected: { topicId: string; interestLevel: number }[]) {
    // Just store temporarily, submit on button click
    setTopics((prev) => {
      (prev as unknown as { _selected: typeof selected })._selected = selected;
      return prev;
    });
  }

  async function submitTopics() {
    setLoading(true);
    const selected = (topics as unknown as { _selected: { topicId: string; interestLevel: number }[] })._selected;
    if (!selected?.length) {
      // Skip with defaults
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics: [] }),
      });
    } else {
      await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics: selected }),
      });
    }
    router.push("/feed");
  }

  if (status === "loading") return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {mode === "choose" && (
        <div className="text-center">
          <div className="flex justify-center gap-1.5 mb-6">
            <div className="h-8 w-2 rounded-full bg-blue-500" />
            <div className="h-8 w-2 rounded-full bg-emerald-500" />
            <div className="h-8 w-2 rounded-full bg-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Let&apos;s personalize your news
          </h1>
          <p className="text-gray-600 mb-8">
            Choose how you want to set up your feed. You can always change this later.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
            <button
              onClick={() => setMode("quiz")}
              className="rounded-xl border-2 border-gray-200 p-6 text-left hover:border-emerald-500 hover:bg-emerald-50 transition-all"
            >
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold mb-1">Take the Quiz</h3>
              <p className="text-sm text-gray-500">
                Answer a few questions and we will figure out what matters to you.
              </p>
            </button>

            <button
              onClick={() => setMode("topics")}
              className="rounded-xl border-2 border-gray-200 p-6 text-left hover:border-emerald-500 hover:bg-emerald-50 transition-all"
            >
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold mb-1">Pick Topics</h3>
              <p className="text-sm text-gray-500">
                Select the policy areas you want to follow directly.
              </p>
            </button>
          </div>

          <button
            onClick={submitTopics}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline"
          >
            Skip for now, show me everything
          </button>
        </div>
      )}

      {mode === "quiz" && (
        <QuizFlow
          questions={questions.length > 0 ? questions : []}
          onComplete={handleQuizComplete}
          onSkip={() => setMode("topics")}
        />
      )}

      {mode === "topics" && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pick your topics</h1>
          <p className="text-gray-600 mb-6">Select the areas you want to follow. Tap to toggle.</p>
          <TopicPicker topics={topics} onSelect={handleTopicSelect} />
          <div className="flex justify-center mt-8">
            <Button onClick={submitTopics} disabled={loading} size="lg">
              {loading ? "Saving..." : "Start reading"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
