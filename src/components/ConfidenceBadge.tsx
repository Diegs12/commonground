import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  score: number;
}

export function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  const percent = Math.round(score * 100);
  const variant = score >= 0.8 ? "default" : score >= 0.5 ? "secondary" : "destructive";

  return (
    <Badge
      variant={variant}
      className={cn(
        "text-xs",
        score >= 0.8 && "bg-emerald-100 text-emerald-700",
        score >= 0.5 && score < 0.8 && "bg-yellow-100 text-yellow-700",
        score < 0.5 && "bg-red-100 text-red-700"
      )}
    >
      {percent}% confidence
    </Badge>
  );
}
