"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AboutHeroPayload } from "@/lib/about-types";

/**
 * 区块 1 · 首屏英雄
 *  - 用「定位」替代规模
 *  - 主标 + 副标 + 3 个服务承诺浮窗
 */
export function AboutHero({ data }: { data: AboutHeroPayload }) {
  return (
    <section className="relative isolate overflow-hidden bg-bone-100 paper-grain">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 md:pb-20 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="en-mono text-[10px] uppercase tracking-[0.32em] text-forest-600">
            About · 我们是谁
          </span>
          <span className="gold-rule" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="cn-display max-w-4xl text-4xl leading-tight text-ink-700 md:text-5xl"
        >
          {data.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-6 max-w-2xl text-[14px] leading-relaxed text-charcoal/60 md:text-[15px]"
        >
          {data.subtitle}
        </motion.p>

        {/* 替代数据浮窗：3 个服务承诺 */}
        <div className="mt-12 grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-3">
          {data.highlights.map((h, i) => (
            <motion.div
              key={h.k}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-bone-100 p-7"
            >
              <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-forest-600/60">
                Promise 0{i + 1}
              </div>
              <div className="cn-display mt-3 text-lg text-ink-700">{h.k}</div>
              <div className="mt-3 text-[13px] leading-relaxed text-charcoal/70">
                {h.v}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-ink-700/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <span className="en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/40">
            About · 我们是谁
          </span>
          <span className="en-serif text-xs italic text-charcoal/40">
            Shenzhen · Est. 2026
          </span>
        </div>
      </div>
    </section>
  );
}