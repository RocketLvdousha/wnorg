import { prisma } from "@/lib/db";
import { parseHomePayload } from "@/lib/home-types";
import {
  ProductShowcase,
} from "@/components/home/ProductShowcase";
import { Testimonials } from "@/components/home/Testimonials";
import { Cta } from "@/components/home/Cta";
import {
  productFeature as fallbackProduct,
  moonlightBox as fallbackCompanion,
  testimonials as fallbackTestimonials,
  cta as fallbackCta,
} from "@/lib/content";
import { productPage } from "@/lib/content";
import type {
  CtaPayload,
  ProductShowcasePayload,
  TestimonialsPayload,
} from "@/lib/home-types";

// 前台页面强制按需渲染，避免 Next.js 缓存后台更新看不到
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 首页 — 服务端组件，直接读 DB
 *
 * 4 个区块按 displayOrder 顺序：
 *   1 主产品展示
 *   2 月光宝盒展示
 *   3 客户证言
 *   4 底部 CTA
 *
 * 页面框架不变（左视频/右介绍、双 WoodFrame、双卡片网格、深色 CTA 表单）。
 * 仅把数据来源从 lib/content.ts 切换到 DB；DB 为空时回落到原静态数据。
 */
export default async function HomePage() {
  const sections = process.env.NEXT_BUILD_SKIP_DB === "1"
    ? []
    : await prisma.homeSection.findMany({
    where: { visible: true },
    orderBy: { displayOrder: "asc" },
  });

  // DB 索引表
  const byType: Record<string, { payload: unknown }> = {};
  for (const s of sections) {
    byType[s.type] = { payload: parseHomePayload(s.payload, s.type as never) };
  }

  const product =
    (byType.product?.payload as ProductShowcasePayload | undefined) ??
    {
      name: "卧宁睡眠.卫家精灵",
      intro: productPage.intro,
      // 用 lib/content 里 productPage.intro 顶上
      price: "¥29,800",
      priceNote: "含税 · 一个价格",
      primaryCta: { label: "查看产品详情", href: "/product" },
      secondaryCta: { label: "价格与权益", href: "/pricing" },
      media: fallbackProduct.videos.map((v) => ({
        id: v.id,
        src: v.src,
        kind: "video" as const,
        label: v.label,
        caption: v.caption,
        angle: v.angle,
      })),
    };

  const companion =
    (byType.companion?.payload as ProductShowcasePayload | undefined) ??
    {
      name: "月光宝盒",
      intro: fallbackCompanion.intro,
      price: fallbackCompanion.price,
      priceNote: "含税 · 一个价格",
      primaryCta: { label: "查看产品详情", href: "/product" },
      secondaryCta: { label: "价格与权益", href: "/pricing" },
      media: fallbackCompanion.videos.map((v) => ({
        id: v.id,
        src: v.src,
        kind: "video" as const,
        label: v.label,
        caption: v.caption,
        angle: v.angle,
      })),
    };

  const testimonialsData =
    (byType.testimonials?.payload as TestimonialsPayload | undefined) ??
    {
      eyebrow: fallbackTestimonials.eyebrow,
      title: fallbackTestimonials.title,
      items: fallbackTestimonials.items,
    };

  const ctaData =
    (byType.cta?.payload as CtaPayload | undefined) ??
    {
      eyebrow: fallbackCta.eyebrow,
      title: fallbackCta.title,
      sub: fallbackCta.sub,
      primary: fallbackCta.primary,
      secondary: fallbackCta.secondary,
      note: fallbackCta.note,
      fields: fallbackCta.fields.map((f) => ({
        name: f.name,
        label: f.label,
        type: f.type,
        placeholder: f.placeholder,
      })),
    };

  return (
    <>
      <ProductShowcase
        data={product}
        mediaPosition="left"
      />
      <ProductShowcase
        data={companion}
        mediaPosition="right"
      />
      <Testimonials data={testimonialsData} />
      <Cta data={ctaData} />
    </>
  );
}