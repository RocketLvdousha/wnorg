"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  ShieldCheck,
  Handshake,
  GraduationCap,
} from "lucide-react";
import type { AboutTrustPayload } from "@/lib/about-types";

const PILLAR_ICON: Record<AboutTrustPayload["pillars"][number]["k"], React.ReactNode> = {
  qualification: <ShieldCheck size={18} strokeWidth={1.5} />,
  ecosystem: <Handshake size={18} strokeWidth={1.5} />,
  credential: <GraduationCap size={18} strokeWidth={1.5} />,
};

const PILLAR_LABEL: Record<AboutTrustPayload["pillars"][number]["k"], string> = {
  qualification: "Qualification",
  ecosystem: "Ecosystem",
  credential: "Credential",
};

/**
 * 区块 3 · 信任证据链
 *  - 上半部分：团队背景时间轴
 *  - 下半部分：前置信任 3 列卡片
 */
export function AboutTrust({ data }: { data: AboutTrustPayload }) {
  return (
    <section className="bg-bone-100 py-20 paper-grain">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Trust Evidence · 信任证据链"
          title="还没有客户案例时，怎么让你敢信？"
          subtitle="用「团队背景」+「前置证据」来替代历史背书。"
        />

        {/* 上半部分：时间轴 */}
        <div className="mt-12">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-600/60">
            团队背景时间轴
          </div>
          <ol className="border-l border-ink-700/15 pl-6">
            {data.timeline.map((node, i) => (
              <motion.li
                key={node.title}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative mb-6 last:mb-0"
              >
                <span className="absolute -left-[27px] top-1.5 h-3 w-3 border border-forest-600 bg-bone-100" />
                <div className="en-mono text-[10px] uppercase tracking-[0.24em] text-forest-600">
                  {node.year}
                </div>
                <div className="cn-display mt-1 text-lg text-ink-700">
                  {node.title}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-charcoal/70">
                  {node.body}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* 下半部分：前置信任 3 列 */}
        <div className="mt-16">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-600/60">
            前置信任 · 三列卡片
          </div>
          <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-3">
            {data.pillars.map((p, i) => (
              <motion.div
                key={p.k}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-bone-100 p-7"
              >
                <div className="flex items-center gap-2 text-forest-600">
                  {PILLAR_ICON[p.k]}
                  <span className="en-mono text-[10px] uppercase tracking-[0.32em]">
                    {PILLAR_LABEL[p.k]}
                  </span>
                </div>
                <h4 className="cn-display mt-4 text-lg text-ink-700">{p.title}</h4>
                <ul className="mt-4 space-y-2">
                  {p.items.map((it) => (
                    <li
                      key={it}
                      className="flex gap-2 text-[13px] leading-relaxed text-charcoal/70"
                    >
                      <span className="mt-2 h-px w-3 shrink-0 bg-forest-600/40" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}