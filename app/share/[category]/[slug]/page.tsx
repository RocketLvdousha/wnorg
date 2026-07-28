import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { pageHero } from "@/lib/content";
import {
  SHARE_CATEGORIES,
  type ShareCategoryKey,
} from "@/lib/share-types";
import {
  getPublished,
  getMoreInCategory,
  listOverview,
} from "@/lib/share-db";
import { MdxRender } from "@/components/share/MdxRender";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  // build 时跳过静态生成（容器内无法访问 DB）；改由运行时按需渲染
  if (process.env.NEXT_SKIP_STATIC_GENERATION === "1") return [];
  const { prisma } = await import("@/lib/db");
  const rows = await prisma.entry.findMany({
    where: { status: "published" },
    select: { category: true, slug: true },
  });
  return rows;
}

export default async function ShareEntryPage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const cat = SHARE_CATEGORIES.find((c) => c.key === params.category);
  if (!cat) notFound();

  const entry = await getPublished(cat.key, params.slug);
  if (!entry) notFound();

  const more = await getMoreInCategory(cat.key, entry.slug);
  const otherCats = (await listOverview()).filter((c) => c.key !== cat.key);

  // 兜底：标题/摘要为空时用 slug 或分类名
  const title = entry.payload.title_zh || entry.payload.title_en || entry.slug;
  const summary =
    entry.payload.summary_zh ||
    entry.payload.summary_en ||
    "（暂无摘要）";
  const body = entry.payload.body_zh || entry.payload.body_en;

  return (
    <>
      <PageHero
        eyebrow={pageHero.share.eyebrow}
        title={title}
        sub={summary}
        centered
        hideEyebrow
      />

      {/* 面包屑 */}
      <section className="border-b border-ink-700/[0.08] bg-bone-50">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 text-[11px] tracking-[0.24em] text-charcoal/50">
          <Link href="/share" className="hover:text-ink-700">
            产品分享
          </Link>
          <span>/</span>
          <Link href={`/share/${cat.key}`} className="hover:text-ink-700">
            {cat.label}
          </Link>
          <span>/</span>
          <span className="text-ink-700">{title}</span>
        </div>
      </section>

      <section className="bg-bone-50 py-12">
        <div className="mx-auto max-w-3xl px-6">
          {/* meta */}
          <div className="mb-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-ink-700/10 pb-4 text-[12px] text-charcoal/50">
            <span className="en-mono uppercase tracking-[0.24em]">
              {entry.payload.date || entry.publishedAt.toISOString().slice(0, 10)}
            </span>
            {entry.payload.author && <span>署名 · {entry.payload.author}</span>}
            {entry.payload.tags && entry.payload.tags.length > 0 && (
              <span className="flex flex-wrap gap-3">
                {entry.payload.tags.map((t) => (
                  <span
                    key={t}
                    className="en-mono text-[10px] uppercase tracking-[0.24em] text-forest-600/60"
                  >
                    # {t}
                  </span>
                ))}
              </span>
            )}
          </div>

          {/* cover */}
          {entry.payload.cover && (
            <div className="mb-8">
              {/\.(mp4|webm|mov)$/i.test(entry.payload.cover) ||
              entry.payload.cover.includes("/videos/") ? (
                <video
                  src={entry.payload.cover}
                  controls
                  playsInline
                  className="w-full border border-ink-700/10"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={entry.payload.cover}
                  alt={title}
                  className="w-full border border-ink-700/10"
                />
              )}
            </div>
          )}

          {/* 正文 MDX */}
          <article className="cn-prose">
            {body.trim() ? (
              <MdxRender source={body} />
            ) : (
              <div className="border border-dashed border-ink-700/15 px-6 py-12 text-center text-[13px] text-charcoal/50">
                正文尚未填写
              </div>
            )}
          </article>

          {/* 合规小字 */}
          <div className="mt-10 border-l-2 border-ink-700/10 pl-4 text-[11px] leading-relaxed text-charcoal/50">
            本内容仅作产品作用机制与使用场景说明，不构成对任何疾病的诊断、治疗或疗效承诺。
          </div>
        </div>
      </section>

      {/* 其它分类入口 */}
      <section className="bg-bone-100 py-12 paper-grain">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 en-mono text-[10px] uppercase tracking-[0.32em] text-forest-600">
            Other Categories
          </div>
          <div className="grid gap-px overflow-hidden border border-ink-700/10 bg-ink-700/10 md:grid-cols-3">
            {otherCats.map((c) => (
              <Link
                key={c.key}
                href={`/share/${c.key}`}
                className="bg-bone-100 p-6 transition-colors hover:bg-bone-50"
              >
                <div className="cn-display text-base text-ink-700">{c.label}</div>
                <div className="mt-2 text-[12px] text-charcoal/60">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 返回 / More */}
      <section className="bg-bone-50 py-12">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href={`/share/${cat.key}`}
            className="group inline-flex items-center gap-2 text-[12px] tracking-wider text-ink-700 transition-colors hover:text-forest-600"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.5}
              className="transition-transform group-hover:-translate-x-1"
            />
            返回 {cat.label}
          </Link>

          {more.length > 0 && (
            <div className="mt-12">
              <div className="mb-4 en-mono text-[10px] uppercase tracking-[0.32em] text-charcoal/40">
                More in {cat.label}
              </div>
              <ul className="divide-y divide-ink-700/10 border-y border-ink-700/10">
                {more.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/share/${cat.key}/${e.slug}`}
                      className="group flex items-baseline justify-between py-4 transition-colors hover:bg-bone-100"
                    >
                      <span className="cn-display text-base text-ink-700">
                        {e.payload.title_zh || e.payload.title_en}
                      </span>
                      <span className="en-mono ml-4 shrink-0 text-[10px] uppercase tracking-[0.24em] text-charcoal/40">
                        {e.publishedAt.toISOString().slice(0, 10)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}