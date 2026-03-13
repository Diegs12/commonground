import { Badge } from "@/components/ui/badge";

interface Source {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  sourceBias: string;
}

interface SourceListProps {
  sources: Source[];
}

const biasLabels: Record<string, string> = {
  LEFT: "Left",
  CENTER_LEFT: "Center-Left",
  CENTER: "Center",
  CENTER_RIGHT: "Center-Right",
  RIGHT: "Right",
};

const biasColors: Record<string, string> = {
  LEFT: "bg-blue-100 text-blue-700",
  CENTER_LEFT: "bg-blue-50 text-blue-600",
  CENTER: "bg-gray-100 text-gray-700",
  CENTER_RIGHT: "bg-red-50 text-red-600",
  RIGHT: "bg-red-100 text-red-700",
};

export function SourceList({ sources }: SourceListProps) {
  const grouped: Record<string, Source[]> = {};
  for (const source of sources) {
    const bias = source.sourceBias || "CENTER";
    if (!grouped[bias]) grouped[bias] = [];
    grouped[bias].push(source);
  }

  const order = ["LEFT", "CENTER_LEFT", "CENTER", "CENTER_RIGHT", "RIGHT"];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Source Articles</h3>
      {order.map((bias) => {
        const group = grouped[bias];
        if (!group?.length) return null;
        return (
          <div key={bias}>
            <Badge className={`mb-2 ${biasColors[bias] || ""}`} variant="secondary">
              {biasLabels[bias] || bias}
            </Badge>
            <ul className="space-y-1.5">
              {group.map((source) => (
                <li key={source.id}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {source.sourceName}: {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
