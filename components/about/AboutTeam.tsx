"use client";

import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { AboutTeamPayload } from "@/lib/about-types";

/**
 * 区块 4 · 团队真人秀
 *  - 把「人」作为核心资产
 *  - 每位成员：照片占位 + 姓名 + 职位 + 一句话履历
 */
export function AboutTeam({ data }: { data: AboutTeamPayload }) {
  return (
    <section className="bg-bone-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle
          eyebrow="The Team · 团队真人秀"
          title="新公司最大的资产，是这一群人"
          subtitle={data.intro}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.members.map((m, i) => (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="border border-ink-700/10 bg-bone-100 p-6"
            >
              {/* 照片占位：未上传时使用首字母方块 */}
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo}
                  alt={m.name}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center border border-dashed border-ink-700/20 bg-bone-50">
                  <div className="cn-display text-6xl text-ink-700/30">
                    {m.name?.[0] ?? "?"}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <div className="cn-display text-xl text-ink-700">{m.name}</div>
                <div className="en-mono mt-1 text-[10px] uppercase tracking-[0.32em] text-forest-600/70">
                  {m.role}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">
                  {m.bio}
                </p>
              </div>
            </motion.article>
          ))}

          {/* 若成员数为 0，补一张邀请卡 */}
          {data.members.length === 0 && (
            <div className="col-span-full border border-dashed border-ink-700/20 px-6 py-12 text-center text-[13px] text-charcoal/50">
              暂无成员信息 · 请在 admin 后台补全
            </div>
          )}
        </div>
      </div>
    </section>
  );
}