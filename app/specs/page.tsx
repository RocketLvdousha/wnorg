"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { specsPage, pageHero } from "@/lib/content";

export default function SpecsPage() {
  return (
    <>
      <PageHero
        eyebrow={pageHero.specs.eyebrow}
        title={pageHero.specs.title}
        sub={pageHero.specs.sub}
      />

      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="en-serif text-xl leading-relaxed text-ink-700 md:text-2xl">
            {specsPage.intro}
          </p>
        </div>
      </section>

      {/* 规格表：按 group 分块 */}
      <section className="bg-bone-50 py-12">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          {specsPage.groups.map((g, gi) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 flex items-baseline justify-between border-b border-ink-700/20 pb-4">
                <h3 className="cn-display text-2xl text-ink-700 md:text-3xl">
                  {g.name}
                </h3>
                <span className="en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/40">
                  {String(gi + 1).padStart(2, "0")} / {String(specsPage.groups.length).padStart(2, "0")}
                </span>
              </div>

              <div className="overflow-hidden border border-ink-700/10">
                {g.items.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.03 }}
                    className="grid grid-cols-12 items-baseline gap-6 border-b border-ink-700/10 bg-bone-100 px-6 py-5 last:border-b-0 hover:bg-bone-50"
                  >
                    <div className="col-span-12 text-[12px] tracking-wider text-charcoal/50 md:col-span-4">
                      {row.label}
                    </div>
                    <div className="col-span-12 en-serif text-[16px] italic text-ink-700 md:col-span-8">
                      {row.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 资质 */}
      <section className="bg-ink-700 py-24 text-bone-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-gold-300">
              Certifications
            </div>
            <h3 className="cn-display text-3xl leading-tight md:text-4xl">
              资质与认证
            </h3>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-bone-300/70">
              每项资质均处于申请或符合状态。如需证明文件副本，请联系专属顾问。
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-bone-300/10 bg-bone-300/10 md:grid-cols-2 lg:grid-cols-4">
            {specsPage.certifications.map((c) => (
              <div key={c.k} className="bg-ink-700 p-7">
                <div className="en-serif text-3xl text-gold-300">{c.k}</div>
                <div className="cn-display mt-3 text-base text-bone-100">{c.n}</div>
                <div className="mt-4 flex items-center gap-2">
                  {c.status === "符合" ? (
                    <CheckCircle2
                      size={14}
                      className="text-forest-300"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Clock
                      size={14}
                      className="text-gold-300"
                      strokeWidth={1.5}
                    />
                  )}
                  <span className="en-mono text-[10px] uppercase tracking-[0.24em] text-bone-300/60">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bone-50 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h3 className="cn-display text-2xl text-ink-700 md:text-3xl">
            想看真实机器？
          </h3>
          <p className="mt-4 text-[14px] text-charcoal/60">
            预约一次卧室的现场体验，让产品自己说话。
          </p>
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
              href="/pricing"
              className="text-[13px] tracking-wide text-ink-700 transition-colors hover:text-forest-600"
            >
              查看价格 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
