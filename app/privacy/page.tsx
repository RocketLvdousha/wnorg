"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Server,
  KeyRound,
  ScrollText,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { privacyPage, pageHero } from "@/lib/content";

const ICONS: Record<string, any> = {
  minimize: Shield,
  local: Server,
  ownership: KeyRound,
  audit: ScrollText,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow={pageHero.privacy.eyebrow}
        title={pageHero.privacy.title}
        sub={pageHero.privacy.sub}
      />

      {/* Slogan 大字（Apple 隐私页面的标志） */}
      <section className="relative bg-ink-800 py-24 text-bone-100 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="cn-display text-3xl font-light leading-tight md:text-5xl lg:text-6xl"
          >
            {privacyPage.intro}
          </motion.h2>
        </div>
      </section>

      {/* 四大原则（图标 + 卡片） */}
      <section className="bg-bone-50 py-24 paper-grain">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            eyebrow="FOUR PRINCIPLES"
            title="我们守住的四条线"
          />
          <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-2">
            {privacyPage.principles.map((p, i) => {
              const Icon = ICONS[p.icon];
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="bg-bone-50 p-10"
                >
                  <Icon
                    size={32}
                    className="mb-6 text-forest-600"
                    strokeWidth={1.2}
                  />
                  <h3 className="cn-display text-2xl text-ink-700">{p.title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-charcoal/70">
                    {p.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 合规清单 */}
      <section className="bg-bone-100 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionTitle
            eyebrow="COMPLIANCE"
            title="我们所遵循的"
            subtitle="合规不是声明，是工程约束"
          />
          <div className="overflow-hidden border border-ink-700/10">
            {privacyPage.compliance.map((c, i) => (
              <motion.div
                key={c.k}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="grid grid-cols-12 items-baseline gap-6 border-b border-ink-700/10 bg-bone-50 px-6 py-6 last:border-b-0"
              >
                <div className="col-span-3 en-mono text-[10px] uppercase tracking-[0.32em] text-gold-700">
                  {c.k}
                </div>
                <div className="col-span-9 text-[14px] leading-relaxed text-charcoal/70">
                  {c.v}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系我们（隐私官） */}
      <section className="bg-ink-700 py-20 text-bone-100">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-300">
            {privacyPage.contact.title}
          </div>
          <h3 className="cn-display text-2xl text-bone-100 md:text-3xl">
            {privacyPage.contact.name}
          </h3>
          <a
            href={`mailto:${privacyPage.contact.email}`}
            className="mt-6 inline-flex items-center gap-2 border border-gold-500/40 px-6 py-3 text-[13px] tracking-wider text-bone-100 transition-colors hover:bg-bone-100/10"
          >
            {privacyPage.contact.email}
            <ArrowRight size={14} />
          </a>
          <p className="mt-4 text-[11px] text-bone-300/50">
            {privacyPage.contact.response}
          </p>
        </div>
      </section>

      {/* 返回 */}
      <section className="bg-bone-50 py-16 text-center">
        <Link
          href="/"
          className="text-[13px] tracking-wider text-ink-700 underline-offset-4 transition-colors hover:text-forest-600 hover:underline"
        >
          ← 返回首页
        </Link>
      </section>
    </>
  );
}
