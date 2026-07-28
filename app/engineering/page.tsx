"use client";

import { motion } from "framer-motion";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { MechanismField } from "@/components/ui/MechanismField";
import { engineeringPage, pageHero } from "@/lib/content";

export default function EngineeringPage() {
  return (
    <>
      <PageHero
        eyebrow={pageHero.engineering.eyebrow}
        title={pageHero.engineering.title}
        sub={pageHero.engineering.sub}
      />

      {/* 三机制空间化阶段（场景化自证） */}
      <section className="relative isolate h-[80vh] min-h-[560px] w-full overflow-hidden bg-ink-800">
        <MechanismField tone="dark" intensity="high" showLabels />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-3xl"
          >
            <div className="en-mono mb-3 text-[10px] uppercase tracking-[0.32em] text-gold-300">
              The Three Mechanisms · In Space
            </div>
            <h3 className="cn-display text-2xl font-light leading-tight text-bone-100 md:text-4xl">
              三种机制 · 在卧室里同时发生
            </h3>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-bone-100/70">
              远红外从主机向外缓慢辐射；负氧离子弥漫上升；
              细胞膜电位以 0.5–3 Hz 横向铺展。
              一台机器、一间卧室、三种作用同时进行。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 总览 */}
      <section className="bg-bone-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <p className="en-serif text-xl leading-relaxed text-ink-700 md:text-2xl">
            {engineeringPage.heroSub}
          </p>
        </div>
      </section>

      {/* 四大支柱：Material / Mechanism / Firmware / Manufacturing */}
      <section className="bg-bone-50 py-12">
        <div className="mx-auto max-w-7xl px-6 space-y-px overflow-hidden border border-ink-700/10 bg-ink-700/10">
          {engineeringPage.pillars.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.05 }}
              className="grid grid-cols-1 gap-8 bg-bone-50 p-10 md:grid-cols-12 md:gap-12 md:p-14"
            >
              {/* 左侧：大数字 + 名字 */}
              <div className="md:col-span-4">
                <div className="en-serif text-7xl text-forest-500/40 md:text-8xl">
                  0{i + 1}
                </div>
                <div className="en-mono mt-2 text-[10px] uppercase tracking-[0.32em] text-gold-700">
                  {p.name}
                </div>
              </div>

              {/* 右侧：标题 + 正文 + 标签 */}
              <div className="md:col-span-8">
                <h3 className="cn-display text-2xl leading-tight text-ink-700 md:text-3xl lg:text-4xl">
                  {p.title}
                </h3>
                <p className="mt-6 text-[15px] leading-relaxed text-charcoal/70 md:text-base">
                  {p.body}
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-ink-700/15 bg-bone-100 px-3 py-1.5 text-[11px] tracking-wider text-charcoal/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 测试流程 */}
      <section className="bg-ink-700 py-24 text-bone-100">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-gold-300">
              Tested
            </div>
            <h3 className="cn-display text-3xl leading-tight md:text-4xl">
              四道检测 · 出厂前必经
            </h3>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-bone-300/70">
              从原料到出厂，每台机器走完下面四道工序才贴标。
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-bone-300/10 bg-bone-300/10 md:grid-cols-2 lg:grid-cols-4">
            {engineeringPage.testingSteps.map((s, i) => (
              <div key={s.k} className="bg-ink-700 p-7">
                <div className="en-serif text-3xl text-gold-300">{s.k}</div>
                <h4 className="cn-display mt-4 text-base text-bone-100">{s.t}</h4>
                <p className="mt-3 text-[12px] leading-relaxed text-bone-300/70">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 工厂背书 */}
      <section className="bg-bone-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="en-mono mb-4 text-[10px] uppercase tracking-[0.32em] text-forest-600">
            Made in China · By 兴旺惟爱
          </div>
          <h3 className="cn-display text-2xl leading-tight text-ink-700 md:text-3xl">
            全流程境内制造 · 每批次可追溯
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-charcoal/60">
            SMT、AI 老化、EMC 实验室、长运测试、终检出厂 —— 全过程由 兴旺惟爱 在境内完成。
            驻厂质量代表对每批次签发可追溯记录。
          </p>
        </div>
      </section>
    </>
  );
}
