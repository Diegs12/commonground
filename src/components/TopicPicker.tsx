"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TopicPickerProps {
  topics: { id: string; name: string; slug: string; icon: string; description: string }[];
  onSelect: (selected: { topicId: string; interestLevel: number }[]) => void;
  initialSelected?: string[];
}

export function TopicPicker({ topics, onSelect, initialSelected = [] }: TopicPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  function toggle(topicId: string) {
    const next = new Set(selected);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
    }
    setSelected(next);
    onSelect(Array.from(next).map((id) => ({ topicId: id, interestLevel: 3 })));
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => toggle(topic.id)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
            selected.has(topic.id)
              ? "border-emerald-500 bg-emerald-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <span className="text-2xl">{topic.icon}</span>
          <span className="text-sm font-medium">{topic.name}</span>
        </button>
      ))}
    </div>
  );
}
