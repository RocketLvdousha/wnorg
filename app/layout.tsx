import type { Metadata } from "next";
import "./globals.css";
import { ComplianceBar } from "@/components/layout/ComplianceBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MechanismField } from "@/components/ui/MechanismField";
import { brand, complianceBar } from "@/lib/content";

// 字体改用 CSS 系统栈，避免 next/font/google 在 build 时拉远程字体
// 旧字体名 cn-display / en-serif / en-mono 在 globals.css 中已映射到这些 CSS 变量
const fontVars = "";

export const metadata: Metadata = {
  title: {
    default: `${brand.nameZh} · ${brand.tagline}`,
    template: `%s · ${brand.nameZh}`,
  },
  description:
    "深圳卧宁睡眠科技有限公司 · 以睡眠为切入口、以 AI 为整合引擎的生命科学应用公司 · 为高净值人群提供家庭端精准健康管理",
  keywords: [
    "卧宁睡眠",
    "生命资产管理",
    "高净值健康",
    "三合一养生仪",
    "兴旺惟爱",
    "AI 精力管家",
  ],
  authors: [{ name: "深圳卧宁睡眠科技有限公司" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: `${brand.nameZh} · ${brand.tagline}`,
    description: "生命资产管理 OS · Life Science × AI",
    siteName: brand.nameZh,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-bone-100 text-charcoal antialiased">
        <ComplianceBar text={complianceBar.text} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />

        {/*
         * 全站最深背景层 · 三机制空间可视化大气纹理
         *  - 固定于视口，pointer-events-none 不阻挡交互
         *  - z-index: 30，落在 Header(sticky z-40) 之下，不挡导航
         *  - tone="light" + intensity="low" + 额外 opacity 0.55，作为低强度品牌肌理
         *  - ionYZone=[80,480] 把离子抬到上半屏可见区，
         *    避开底部暖核 (y=580) 与最底膜带 (y=750)，不再被遮挡
         *  - 真正的焦点层（Hero / 产品舞台 / 工程舞台）仍保留 intensity="high"
         */}
        <div
          className="pointer-events-none fixed inset-0"
          aria-hidden
          style={{ zIndex: 30, opacity: 0.55 }}
        >
          <MechanismField tone="light" intensity="low" ionYZone={[80, 480]} />
        </div>
      </body>
    </html>
  );
}