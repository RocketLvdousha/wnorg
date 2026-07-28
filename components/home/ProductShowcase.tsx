"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WoodFrame } from "@/components/ui/WoodFrame";
import { ProductVideo } from "@/components/home/ProductVideo";
import { MediaCarousel } from "@/components/home/MediaCarousel";
import type { ProductShowcasePayload, MediaRef } from "@/lib/home-types";

/**
 * 主产品 / 月光宝盒 共用展示组件
 *  - 左侧或右侧放置媒体组（mediaPosition 决定）
 *  - 另一侧：名称 / 介绍 / 价格 / CTA 双按钮
 *
 * 媒体分发：
 *  - 任意媒体（视频 + 图片）→ MediaCarousel（左右滑动切换，不占空间）
 *  - ProductVideo 暂作 fallback（实际不再用，统一走 carousel）
 *
 * 框架与原 ProductFeature 完全一致（左右两栏 + WoodFrame + 价格带 + 双按钮）。
 */
export function ProductShowcase({
  data,
  mediaPosition,
}: {
  data: ProductShowcasePayload;
  mediaPosition: "left" | "right";
}) {
  const visible = data.media.filter((m) => !!m.src);

  const mediaBlock = (
    <div className={mediaPosition === "left" ? "md:col-span-7" : "md:col-span-7"}>
      {visible.length === 0 ? (
        <EmptyMediaPlaceholder />
      ) : visible.every((m) => m.kind === "video") && visible.length === 1 ? (
        // 只有一个视频时仍用视频切换器（自带播放控件）
        <ProductVideo
          videos={visible.map((v) => ({
            id: v.id,
            src: v.src,
            label: v.label,
            caption: v.caption,
            angle: v.angle,
          }))}
        />
      ) : (
        <MediaCarousel media={visible} />
      )}
    </div>
  );

  const infoBlock = (
    <div className="md:col-span-5">
      <h3 className="cn-display text-3xl leading-tight text-ink-700 md:text-4xl">
        {data.name}
      </h3>
      <p className="mt-6 text-[14px] leading-relaxed text-charcoal/70">
        {data.intro}
      </p>

      <div className="mt-10 border-t border-ink-700/10 pt-6">
        <div className="flex items-baseline gap-2">
          <span className="en-serif text-4xl text-ink-700">{data.price}</span>
          <span className="en-mono text-[11px] uppercase tracking-[0.24em] text-charcoal/50">
            {data.priceNote}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={data.primaryCta.href}
            className="inline-flex items-center gap-2 border border-ink-700 bg-ink-700 px-5 py-2.5 text-[12px] tracking-wider text-bone-100 transition-all hover:bg-ink-800"
          >
            {data.primaryCta.label}
          </Link>
          <Link
            href={data.secondaryCta.href}
            className="group inline-flex items-center gap-1 text-[12px] tracking-wide text-ink-700 transition-colors hover:text-forest-600"
          >
            {data.secondaryCta.label}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-bone-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <WoodFrame>
            <div className="grid gap-12 p-0 md:grid-cols-12 md:gap-16 md:p-0">
              {mediaPosition === "left" ? (
                <>
                  {mediaBlock}
                  {infoBlock}
                </>
              ) : (
                <>
                  {infoBlock}
                  {mediaBlock}
                </>
              )}
            </div>
          </WoodFrame>
        </motion.div>
      </div>
    </section>
  );
}

function EmptyMediaPlaceholder() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink-700/10 bg-gradient-to-br from-bone-100 via-bone-50 to-bone-200">
      <span className="absolute left-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="absolute right-3 top-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="absolute left-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <span className="absolute right-3 bottom-3 z-30 h-1.5 w-1.5 rounded-full bg-gold-500/60" />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="en-serif mx-auto mb-3 flex h-20 w-20 items-center justify-center border border-ink-700/15 text-2xl italic text-forest-600">
          W
        </div>
        <div className="en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/50">
          暂无媒体
        </div>
      </div>
    </div>
  );
}