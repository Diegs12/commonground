interface BiasIndicatorProps {
  bias: string;
  size?: "sm" | "md";
}

const biasConfig: Record<string, { label: string; color: string }> = {
  LEFT: { label: "Left", color: "bg-blue-500" },
  CENTER_LEFT: { label: "Center-Left", color: "bg-blue-300" },
  CENTER: { label: "Center", color: "bg-gray-400" },
  CENTER_RIGHT: { label: "Center-Right", color: "bg-red-300" },
  RIGHT: { label: "Right", color: "bg-red-500" },
};

export function BiasIndicator({ bias, size = "sm" }: BiasIndicatorProps) {
  const config = biasConfig[bias] || biasConfig.CENTER;
  const dotSize = size === "sm" ? "h-2 w-2" : "h-3 w-3";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`${dotSize} rounded-full ${config.color}`} />
      <span className={size === "sm" ? "text-xs text-gray-500" : "text-sm text-gray-600"}>
        {config.label}
      </span>
    </span>
  );
}
