import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { pageHero } from "@/lib/content";
import { listOverview } from "@/lib/share-db";

export const revalidate = 0;
// build 时强制按需渲染，避免 build 阶段连 DB
export const dynamic = "force-dynamic";

export default async function ShareOverviewPage() {
  if (process.env.NEXT_BUILD_SKIP_DB === "1") {
    return (
      <>
        <PageHero
          eyebrow={pageHero.share.eyebrow}
          title={pageHero.share.title}
          sub={pageHero.share.sub}
        />
        <div className="bg-bone-50 py-20">
          <div className="mx-auto max-w-7xl px-6 text-charcoal/50">
            数据库未连接 — 请等待 seed 完成
          </div>
        </div>
      </>
    );
  }
  const cats = await listOverview();

  return (
    <>
      <PageHero
        eyebrow={pageHero.share.eyebrow}
        title={pageHero.share.title}
        sub={pageHero.share.sub}
      />

      <section className="bg-bone-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-3">
            {cats.map((cat, i) => (
              <Link
                key={cat.key}
                href={`/share/${cat.key}`}
                className="group relative bg-bone-50 p-8 transition-colors hover:bg-bone-100"
              >
                <div className="en-serif text-4xl text-forest-600/60">
                  0{i + 1}
                </div>
                <h3 className="cn-display mt-4 text-xl text-ink-700">
                  {cat.label}
                </h3>
                <p className="mt-4 text-[13px] leading-relaxed text-charcoal/70">
                  {cat.desc}
                </p>
                <div className="mt-8 flex items-center justify-between border-t border-ink-700/10 pt-4">
                  <span className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
                    {cat.count} 篇 · {cat.label}
                  </span>
                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="text-ink-700 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}