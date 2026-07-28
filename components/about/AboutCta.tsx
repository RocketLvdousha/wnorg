"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { AboutCtaPayload } from "@/lib/about-types";

/**
 * 区块 6 · 行动召唤区
 *  - 主按钮：免费获取方案资料
 *  - 副按钮：预约方案咨询
 */
export function AboutCta({ data }: { data: AboutCtaPayload }) {
  return (
    <section className="bg-bone-100 py-24 paper-grain">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-600">
            Get Started · 行动召唤
          </div>
          <h3 className="cn-display text-3xl leading-tight text-ink-700 md:text-4xl">
            开始一次方案对话
          </h3>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={data.primary.href}
              className="inline-flex items-center justify-center bg-ink-700 px-8 py-3.5 text-[12px] tracking-wider text-bone-100 transition-all hover:bg-ink-800"
            >
              {data.primary.label}
            </Link>
            <Link
              href={data.secondary.href}
              className="inline-flex items-center justify-center border border-ink-700/40 bg-bone-100 px-8 py-3.5 text-[12px] tracking-wider text-ink-700 transition-all hover:bg-bone-50"
            >
              {data.secondary.label}
            </Link>
          </div>

          {data.note && (
            <p className="mt-8 text-[12px] text-charcoal/50">{data.note}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}