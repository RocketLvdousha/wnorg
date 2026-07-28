import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
  className,
}: SectionTitleProps) {
  const isDark = tone === "dark";
  return (
    <div
      className={cn(
        "mb-8 md:mb-2",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "en-mono mb-4 text-[10px] uppercase tracking-[0.32em]",
            isDark ? "text-gold-300" : "text-forest-600"
          )}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "cn-display text-3xl leading-tight md:text-5xl",
          isDark ? "text-bone-100" : "text-ink-700"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-[14px] leading-relaxed md:text-[15px]",
            align === "center" && "mx-auto",
            isDark ? "text-bone-300/70" : "text-charcoal/60"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}