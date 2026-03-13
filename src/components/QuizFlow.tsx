"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface QuizOption {
  id: string;
  optionText: string;
  order: number;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options: QuizOption[];
}

interface QuizFlowProps {
  questions: QuizQuestion[];
  onComplete: (responses: { questionId: string; selectedOptionId: string }[]) => void;
  onSkip: () => void;
}

export function QuizFlow({ questions, onComplete, onSkip }: QuizFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  function selectOption(optionId: string) {
    setResponses((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function next() {
    if (isLast) {
      onComplete(
        Object.entries(responses).map(([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        }))
      );
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.questionText}</h2>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-8">
        {question.options
          .sort((a, b) => a.order - b.order)
          .map((option) => (
            <button
              key={option.id}
              onClick={() => selectOption(option.id)}
              className={cn(
                "w-full rounded-lg border-2 p-3 text-left text-sm transition-all",
                responses[question.id] === option.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {option.optionText}
            </button>
          ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={isFirst}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <Button onClick={next} disabled={!responses[question.id]}>
          {isLast ? "Finish" : "Next"}
          {!isLast && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <button onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600 underline">
          Skip quiz, pick topics manually
        </button>
      </div>
    </div>
  );
}
