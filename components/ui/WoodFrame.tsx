/**
 * WoodFrame —— 木纹装饰框
 * 用于"实体面板"区块的边框质感，强化"卧室里的实木家具"意象
 */
import { cn } from "@/lib/utils";

export function WoodFrame({
  children,
  className,
  tone = "light",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("relative", className)}>
      {/* 外框：极细森林绿线 + 木纹感 */}
      <div
        className={cn(
          "relative wood-grain p-[1px]",
          tone === "light"
            ? "bg-gradient-to-br from-forest-200/40 via-forest-300/20 to-gold-300/15"
            : "bg-gradient-to-br from-forest-700/40 via-forest-600/20 to-gold-700/15"
        )}
      >
        <div className="relative bg-bone-50 linen">{children}</div>
      </div>

      {/* 四角木纹钉点（极小金色，呼应家具） */}
      <span className="absolute left-2 top-2 h-1 w-1 rounded-full bg-gold-500/40" />
      <span className="absolute right-2 top-2 h-1 w-1 rounded-full bg-gold-500/40" />
      <span className="absolute left-2 bottom-2 h-1 w-1 rounded-full bg-gold-500/40" />
      <span className="absolute right-2 bottom-2 h-1 w-1 rounded-full bg-gold-500/40" />
    </div>
  );
}