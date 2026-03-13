interface NarrativeSectionProps {
  title: string;
  content: string;
  color: "green" | "blue" | "red" | "gray";
}

const colorMap = {
  green: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-50",
    title: "text-emerald-700",
  },
  blue: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    title: "text-blue-700",
  },
  red: {
    border: "border-l-red-500",
    bg: "bg-red-50",
    title: "text-red-700",
  },
  gray: {
    border: "border-l-gray-400",
    bg: "bg-gray-50",
    title: "text-gray-700",
  },
};

export function NarrativeSection({ title, content, color }: NarrativeSectionProps) {
  const colors = colorMap[color];

  return (
    <div className={`border-l-4 ${colors.border} ${colors.bg} rounded-r-lg p-4 sm:p-5`}>
      <h2 className={`text-sm font-bold uppercase tracking-wider ${colors.title} mb-3`}>
        {title}
      </h2>
      <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
}
