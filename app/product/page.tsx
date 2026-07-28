"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MechanismField } from "@/components/ui/MechanismField";
import { productPage, pageHero } from "@/lib/content";

export default function ProductPage() {
  return (
    <>
      <PageHero
        eyebrow={pageHero.product.eyebrow}
        title={pageHero.product.title}
        sub={pageHero.product.sub}
      />

      {/* 介绍 */}
      <section className="bg-bone-50 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="en-serif text-xl leading-relaxed text-ink-700 md:text-2xl">
            {productPage.intro}
          </p>
        </div>
      </section>

      {/* 三机制空间化场景（替代实拍占位 —— 真实场景可视化） */}
      <section className="relative isolate h-[72vh] min-h-[520px] w-full overflow-hidden bg-ink-800">
        <MechanismField tone="dark" intensity="high" showLabels />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-10">
          <div className="max-w-3xl">
            <div className="en-mono mb-3 text-[10px] uppercase tracking-[0.32em] text-gold-300">
              In Your Bedroom · Live State
            </div>
            <h3 className="cn-display text-2xl font-light leading-tight text-bone-100 md:text-4xl">
              这台机器开机后，卧室里发生什么
            </h3>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-bone-100/70">
              远红外从主机向外辐射；负氧离子弥漫上升；细胞膜电位以 0.5–3 Hz 横向铺展。
              一切同时进行。
            </p>
          </div>
        </div>
      </section>

      {/* 三大机制 */}
      <section className="bg-bone-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            eyebrow="THE THREE MECHANISMS"
            title="三种作用机制 · 同时发射"
            subtitle="对外描述使用「机制」「研究」「参考」，不构成对个体的疗效承诺。"
          />
          <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-3">
            {productPage.mechanisms.map((m, i) => (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-bone-50 p-8"
              >
                <div className="flex items-baseline justify-between border-b border-ink-700/10 pb-4">
                  <h3 className="cn-display text-xl text-ink-700">{m.key}</h3>
                  <span className="en-serif text-lg italic text-forest-600/50">
                    0{i + 1}
                  </span>
                </div>
                <div className="en-serif mt-3 text-[14px] italic text-forest-600">
                  {m.en}
                </div>
                <div className="mt-1 text-[11px] tracking-wider text-charcoal/50">
                  {m.label}
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-charcoal/70">
                  {m.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 规格表 */}
      <section className="bg-bone-100 py-24 paper-grain">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle title="技术参数 · 统一规格" />
          <div className="overflow-hidden border border-ink-700/10">
            {productPage.specs.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="grid grid-cols-12 items-baseline gap-6 border-b border-ink-700/10 bg-bone-50 px-6 py-6 last:border-b-0"
              >
                <div className="col-span-3 en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/40">
                  {s.label}
                </div>
                <div className="col-span-5 cn-display text-lg text-ink-700 md:text-xl">
                  {s.value}
                </div>
                <div className="col-span-4 text-[13px] text-charcoal/60">{s.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 合规 */}
      <section className="bg-ink-700 py-20 text-bone-100">
        <div className="mx-auto max-w-4xl px-6">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-gold-300">
            Compliance · Mandatory Statement
          </div>
          <div className="border-l-2 border-gold-500/40 pl-4">
            <p className="text-[14px] leading-relaxed text-bone-300/80">
              {productPage.compliance}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bone-50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3 className="cn-display text-2xl text-ink-700 md:text-3xl">
            预约一次卧室的现场体验
          </h3>
          <p className="mt-4 text-[14px] text-charcoal/60">
            体验设备，了解这台机器如何融入你的卧室。
          </p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-2 border border-ink-700 bg-ink-700 px-8 py-3 text-[13px] tracking-wide text-bone-100 transition-all hover:bg-ink-800"
          >
            前往预约
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
