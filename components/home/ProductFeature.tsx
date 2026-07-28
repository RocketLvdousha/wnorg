"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WoodFrame } from "@/components/ui/WoodFrame";
import { productFeature, productPage, moonlightBox } from "@/lib/content";
import { ProductVideo } from "@/components/home/ProductVideo";

export function ProductFeature() {
  return (
    <section className="bg-bone-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-0"
        >
          <WoodFrame>
            <div className="grid gap-12 p-0 md:grid-cols-12 md:gap-16 md:p-0">
              {/* 左侧：产品视频（替换原占位） */}
              <div className="md:col-span-7">
                <ProductVideo videos={productFeature.videos} />
              </div>

              {/* 右侧：信息 */}
              <div className="md:col-span-5">
                <h3 className="cn-display text-3xl leading-tight text-ink-700 md:text-4xl">
                  卧宁睡眠.卫家精灵
                </h3>
                <p className="mt-6 text-[14px] leading-relaxed text-charcoal/70">
                  {productPage.intro}
                </p>

                {/* 价格 + 跳转 */}
                <div className="mt-10 border-t border-ink-700/10 pt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="en-serif text-4xl text-ink-700">¥29,800</span>
                    <span className="en-mono text-[11px] uppercase tracking-[0.24em] text-charcoal/50">
                      含税 · 一个价格
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href="/product"
                      className="inline-flex items-center gap-2 border border-ink-700 bg-ink-700 px-5 py-2.5 text-[12px] tracking-wider text-bone-100 transition-all hover:bg-ink-800"
                    >
                      查看产品详情
                    </Link>
                    <Link
                      href="/pricing"
                      className="group inline-flex items-center gap-1 text-[12px] tracking-wide text-ink-700 transition-colors hover:text-forest-600"
                    >
                      价格与权益
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </WoodFrame>
        </motion.div>

        {/* 三大机制简介（已移除） */}

        
        {/* === 月光宝宝盒 · 伴侣（视频在右、介绍在左） === */}
        <div className="mt-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-0"
          >
            <WoodFrame>
              <div className="grid gap-12 p-0 md:grid-cols-12 md:gap-16 md:p-0">
                {/* 左侧：介绍（col-span-5） */}
                <div className="md:col-span-5">
                  <h3 className="cn-display text-3xl leading-tight text-ink-700 md:text-4xl">
                    月光宝盒
                  </h3>
                  <p className="mt-6 text-[14px] leading-relaxed text-charcoal/70">
                    {moonlightBox.intro}
                  </p>

                  {/* 价格 + 跳转 */}
                  <div className="mt-10 border-t border-ink-700/10 pt-6">
                    <div className="flex items-baseline gap-2">
                      <span className="en-serif text-4xl text-ink-700">
                        {moonlightBox.price}
                      </span>
                      <span className="en-mono text-[11px] uppercase tracking-[0.24em] text-charcoal/50">
                        含税 · 一个价格
                      </span>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Link
                        href="/product"
                        className="inline-flex items-center gap-2 border border-ink-700 bg-ink-700 px-5 py-2.5 text-[12px] tracking-wider text-bone-100 transition-all hover:bg-ink-800"
                      >
                        查看产品详情
                      </Link>
                      <Link
                        href="/pricing"
                        className="group inline-flex items-center gap-1 text-[12px] tracking-wide text-ink-700 transition-colors hover:text-forest-600"
                      >
                        价格与权益
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 右侧：产品视频（col-span-7） */}
                <div className="md:col-span-7">
                  <ProductVideo videos={moonlightBox.videos} />
                </div>
              </div>
            </WoodFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
