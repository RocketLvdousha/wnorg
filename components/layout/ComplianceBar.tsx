import { cn } from "@/lib/utils";

export function ComplianceBar({ text }: { text: string }) {
  return (
    <div
      className={cn(
        "relative z-50 w-full border-b border-ink-700/15 bg-ink-700 text-bone-100",
        "py-2 text-[10px] tracking-[0.18em] sm:text-[11px]"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6">
        <span className="hidden text-gold-300 sm:inline">·</span>
        <span className="mx-3 text-center font-mono uppercase opacity-90">{text}</span>
        <span className="hidden text-gold-300 sm:inline">·</span>
      </div>
    </div>
  );
}