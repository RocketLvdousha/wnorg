import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { pageHero } from "@/lib/content";
import { SHARE_CATEGORIES, type ShareCategoryKey } from "@/lib/share-types";
import { listPublishedByCategory } from "@/lib/share-db";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  if (process.env.NEXT_SKIP_STATIC_GENERATION === "1") return [];
  return SHARE_CATEGORIES.map((c) => ({ category: c.key }));
}

export default async function ShareCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = SHARE_CATEGORIES.find((c) => c.key === params.category);
  if (!cat) notFound();

  const entries = await listPublishedByCategory(cat.key);

  return (
    <>
      <PageHero
        eyebrow={pageHero.share.eyebrow}
        title={cat.label}
        sub={cat.desc}
      />

      <section className="border-b border-ink-700/[0.08] bg-bone-50">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 text-[11px] tracking-[0.24em] text-charcoal/50">
          <Link href="/share" className="hover:text-ink-700">
            产品分享
          </Link>
          <span>/</span>
          <span className="text-ink-700">{cat.label}</span>
        </div>
      </section>

      <section className="bg-bone-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          {entries.length === 0 ? (
            <div className="border border-dashed border-ink-700/15 px-6 py-16 text-center text-[13px] text-charcoal/50">
              该分类下暂无内容
            </div>
          ) : (
            <ul className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-2">
              {entries.map((e) => (
                <li key={e.id} className="bg-bone-50">
                  <Link
                    href={`/share/${cat.key}/${e.slug}`}
                    className="group flex h-full flex-col p-7 transition-colors hover:bg-bone-100"
                  >
                    <div className="flex items-baseline justify-between border-b border-ink-700/10 pb-3">
                      <span className="en-mono text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
                        {e.publishedAt.toISOString().slice(0, 10)}
                      </span>
                      {e.payload.author && (
                        <span className="text-[11px] text-charcoal/50">
                          {e.payload.author}
                        </span>
                      )}
                    </div>
                    <h3 className="cn-display mt-5 text-xl leading-tight text-ink-700">
                      {e.payload.title_zh || e.payload.title_en}
                    </h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-charcoal/70">
                      {e.payload.summary_zh || e.payload.summary_en}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      {e.payload.tags && e.payload.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {e.payload.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="en-mono text-[10px] uppercase tracking-[0.24em] text-forest-600/60"
                            >
                              # {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span />
                      )}
                      <span className="text-[11px] tracking-wider text-ink-700 transition-transform group-hover:translate-x-1">
                        阅读 →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}