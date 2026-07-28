"use client";

import { motion } from "framer-motion";
import { ForestCanopy } from "@/components/ui/ForestCanopy";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  sub: string;
  tone?: "light" | "dark";
  /** 标题与摘要水平居中（默认 false，左对齐保持版面一致） */
  centered?: boolean;
  /** 隐藏顶部 eyebrow 行 + 底部条左侧 eyebrow（默认 false） */
  hideEyebrow?: boolean;
}

export function PageHero({ eyebrow, title, sub, tone = "light", centered = false, hideEyebrow = false }: PageHeroProps) {
  const isDark = tone === "dark";
  // 居中模式：eyebrow 行去掉左侧金色细线（左右对称才好看），并整体居中
  const eyebrowRow = centered
    ? "mb-8 flex items-center justify-center gap-3"
    : "mb-8 flex items-center gap-3";
  const h1Base = centered
    ? "mx-auto max-w-4xl text-center text-4xl leading-tight md:text-6xl"
    : "max-w-4xl text-4xl leading-tight md:text-6xl";
  const subBase = centered
    ? "mx-auto mt-6 max-w-2xl text-center text-[14px] leading-relaxed md:text-[15px]"
    : "mt-6 max-w-2xl text-[14px] leading-relaxed md:text-[15px]";
  // 居中模式下，内容比标题块更窄，原 pt-24/pt-28 太松；
  // 收紧到 pt-10 / md:pt-12 让标题/摘要贴近上沿，跟下方面包屑形成上下节奏
  const contentPadding = centered
    ? "relative mx-auto max-w-7xl px-6 pb-16 pt-10 md:pb-20 md:pt-12"
    : "relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:pb-24 md:pt-28";
  // 隐藏 eyebrow 时：底部条左侧空出，只保留右侧品牌信息
  const bottomStripRow = hideEyebrow
    ? "mx-auto max-w-7xl px-6 py-4 flex items-center justify-end"
    : "mx-auto max-w-7xl px-6 py-4 flex justify-between items-center";
  return (
    <section
      className={
        isDark
          ? "relative isolate overflow-hidden bg-ink-700 paper-grain"
          : "relative isolate overflow-hidden bg-bone-100 paper-grain"
      }
    >
      <ForestCanopy tone={tone} className="opacity-50" />

      <div className={contentPadding}>
        {!hideEyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={eyebrowRow}
          >
            <span
              className={
                isDark
                  ? "en-mono text-[10px] uppercase tracking-[0.32em] text-gold-300"
                  : "en-mono text-[10px] uppercase tracking-[0.32em] text-forest-600"
              }
            >
              {eyebrow}
            </span>
            {!centered && <span className="gold-rule" />}
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`cn-display ${h1Base} ${
            isDark ? "text-bone-100" : "text-ink-700"
          }`}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className={`${subBase} ${
            isDark ? "text-bone-300/70" : "text-charcoal/60"
          }`}
        >
          {sub}
        </motion.p>
      </div>

      <div className={isDark ? "border-t border-bone-300/10" : "border-t border-ink-700/[0.08]"}>
        <div className={bottomStripRow}>
          {!hideEyebrow && (
            <span
              className={
                isDark
                  ? "en-mono text-[10px] uppercase tracking-[0.32em] text-bone-300/30"
                  : "en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/40"
              }
            >
              {eyebrow}
            </span>
          )}
          <span
            className={
              isDark
                ? "en-serif text-xs italic text-bone-300/40"
                : "en-serif text-xs italic text-charcoal/40"
            }
          >
            Shenzhen · Est. 2026
          </span>
        </div>
      </div>
    </section>
  );
}