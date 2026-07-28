"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { AboutFactsPayload } from "@/lib/about-types";

/**
 * 区块 2 · 核心事实墙
 *  - 坦诚展示公司信息
 *  - 总部、核心业务、专注领域、公司状态（含信用代码）
 *  - 信用代码点击可在新窗口跳到「国家企业信用信息公示系统」
 */
const GSXT_URL = "https://www.gsxt.gov.cn/index.html";

export function AboutFacts({ data }: { data: AboutFactsPayload }) {
  const rows: { k: string; v: React.ReactNode }[] = [
    { k: "总部位置", v: data.hq },
    { k: "核心业务", v: data.coreBusiness },
    { k: "专注领域", v: data.focusAreas.join(" / ") },
    {
      k: "公司状态",
      v: (
        <>
          {data.companyStatus}
          {data.creditCode && (
            <>
              {" · "}
              <a
                href={GSXT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 border-b border-forest-600/40 text-forest-600 transition-colors hover:border-forest-600 hover:text-forest-700"
                title="在新窗口打开「国家企业信用信息公示系统」核验"
              >
                <span>统一社会信用代码：{data.creditCode}</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path
                    d="M2 2h6v6M8 2 2 8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <section className="bg-bone-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="Core Facts · 核心事实墙"
          title="先把你应该知道的事告诉你"
          subtitle="新公司没有历史堆砌，所以先把这些事实讲清楚。"
        />

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-2"
        >
          {rows.map((r, i) => (
            <div
              key={r.k}
              className="flex flex-col gap-2 bg-bone-50 p-7 md:flex-row md:gap-8"
            >
              <div className="en-mono shrink-0 text-[10px] uppercase tracking-[0.32em] text-forest-600/60 md:w-32 md:pt-1">
                {r.k}
              </div>
              <div className="cn-display flex-1 text-base leading-relaxed text-ink-700 md:text-lg">
                {r.v}
              </div>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}