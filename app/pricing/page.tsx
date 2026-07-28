"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { pricingPage, pageHero } from "@/lib/content";

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow={pageHero.pricing.eyebrow}
        title={pageHero.pricing.title}
        sub={pageHero.pricing.sub}
      />

      {/* 一句话介绍 */}
      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="en-serif text-xl leading-relaxed text-ink-700 md:text-2xl">
            {pricingPage.intro}
          </p>
        </div>
      </section>

      {/* 主价 + 含项明细 */}
      <section className="bg-bone-100 py-24 paper-grain">
        <div className="mx-auto max-w-7xl px-6">
          {/* 主价卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl border border-ink-700/15 bg-bone-50 p-10 text-center md:p-14"
          >
            <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-forest-600">
              One Price · Includes Everything
            </div>
            <div className="mt-6 flex items-baseline justify-center gap-3">
              <span className="en-serif text-6xl text-ink-700 md:text-7xl">¥29,800</span>
            </div>
            <div className="mt-3 text-[12px] tracking-wider text-charcoal/60">
              含税 · 含上门安装（北上广深）· 12 个月整机质保
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 border border-ink-700 bg-ink-700 px-7 py-3 text-[13px] tracking-wide text-bone-100 transition-all hover:bg-ink-800"
              >
                预约现场体验
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/product"
                className="text-[13px] tracking-wide text-ink-700 transition-colors hover:text-forest-600"
              >
                查看产品详情
              </Link>
            </div>
          </motion.div>

          {/* 含项明细表 */}
          <SectionTitle title="价格包含" subtitle="一份购买合同覆盖以下全部" />
          <div className="overflow-hidden border border-ink-700/10">
            {pricingPage.includesTable.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="grid grid-cols-12 items-baseline gap-6 border-b border-ink-700/10 bg-bone-50 px-6 py-5 last:border-b-0"
              >
                <div className="col-span-3 en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/40">
                  {s.label}
                </div>
                <div className="col-span-4 cn-display text-lg text-ink-700">
                  {s.value}
                </div>
                <div className="col-span-5 text-[13px] text-charcoal/60">{s.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 首年权益 */}
      <section className="bg-bone-50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle
            eyebrow="FIRST-YEAR RIGHTS"
            title="首年会员权益"
            subtitle="首年 4,000 台售罄后将整体提价，已购会员权益保留"
          />
          <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-2">
            {pricingPage.firstYearRights.map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="flex items-start gap-4 bg-bone-50 p-7"
              >
                <Check size={18} className="mt-0.5 flex-shrink-0 text-gold-700" strokeWidth={1.5} />
                <p className="text-[14px] leading-relaxed text-charcoal/80">{r}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-bone-100 py-24 paper-grain">
        <div className="mx-auto max-w-3xl px-6">
          <SectionTitle title="常见问题" subtitle="更详细的请直接与顾问沟通" />
          <div className="space-y-3">
            {pricingPage.faq.map((f, i) => (
              <FAQItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* 合规 */}
      <section className="bg-ink-700 py-16 text-bone-100">
        <div className="mx-auto max-w-4xl px-6">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-gold-300">
            Compliance
          </div>
          <div className="border-l-2 border-gold-500/40 pl-4">
            <p className="text-[13px] leading-relaxed text-bone-300/70">
              {pricingPage.complianceNote}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function FAQItem({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border border-ink-700/10 bg-bone-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <h4 className="cn-display text-base text-ink-700">{q}</h4>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-forest-600 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="border-t border-ink-700/10 px-6 py-5"
        >
          <p className="text-[13px] leading-relaxed text-charcoal/70">{a}</p>
        </motion.div>
      )}
    </div>
  );
}
