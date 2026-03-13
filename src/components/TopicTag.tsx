import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TopicTagProps {
  topic: { name: string; slug: string; icon: string };
  clickable?: boolean;
}

export function TopicTag({ topic, clickable = true }: TopicTagProps) {
  const badge = (
    <Badge variant="secondary" className="text-xs font-normal cursor-pointer hover:bg-gray-200 transition-colors">
      {topic.icon} {topic.name}
    </Badge>
  );

  if (clickable) {
    return <Link href={`/topics/${topic.slug}`}>{badge}</Link>;
  }

  return badge;
}
