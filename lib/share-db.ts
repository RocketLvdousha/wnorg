/**
 * 前台从 DB 读 share 条目的小封装。
 * 所有 read 都在服务端做，附带 ISR。
 */
import { prisma } from "@/lib/db";
import {
  normalizePayload,
  SHARE_CATEGORIES,
  type ShareCategoryKey,
  type SharePayload,
} from "@/lib/share-types";

export type PublicEntry = {
  id: string;
  slug: string;
  category: ShareCategoryKey;
  publishedAt: Date;
  payload: SharePayload;
  version: number;
};

function toPublic(e: {
  id: string;
  slug: string;
  category: string;
  publishedAt: Date | null;
  versions: { payload: string; version: number }[];
}): PublicEntry {
  const latest = e.versions[0];
  return {
    id: e.id,
    slug: e.slug,
    category: e.category as ShareCategoryKey,
    publishedAt: e.publishedAt ?? new Date(),
    payload: normalizePayload(latest ? JSON.parse(latest.payload) : {}),
    version: latest?.version ?? 0,
  };
}

/** 列出某个分类下所有已发布条目（按 publishedAt 倒序） */
export async function listPublishedByCategory(
  category: ShareCategoryKey
): Promise<PublicEntry[]> {
  const rows = await prisma.entry.findMany({
    where: { category, status: "published" },
    include: {
      versions: { orderBy: { version: "desc" }, take: 1 },
    },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toPublic);
}

/** 单条已发布（带 category 校验） */
export async function getPublished(
  category: ShareCategoryKey,
  slug: string
): Promise<PublicEntry | null> {
  const row = await prisma.entry.findUnique({
    where: { category_slug: { category, slug } },
    include: {
      versions: { orderBy: { version: "desc" }, take: 1 },
    },
  });
  if (!row || row.status !== "published") return null;
  return toPublic(row);
}

/** 全部分类 + 每类条目数（概览页用） */
export async function listOverview() {
  const counts = await prisma.entry.groupBy({
    by: ["category"],
    where: { status: "published" },
    _count: { _all: true },
  });
  return SHARE_CATEGORIES.map((c) => ({
    ...c,
    count: counts.find((x) => x.category === c.key)?._count._all ?? 0,
  }));
}

/** 取一个分类下相邻条目（下一篇） */
export async function getMoreInCategory(
  category: ShareCategoryKey,
  excludeSlug: string
): Promise<PublicEntry[]> {
  const rows = await prisma.entry.findMany({
    where: { category, status: "published", NOT: { slug: excludeSlug } },
    include: {
      versions: { orderBy: { version: "desc" }, take: 1 },
    },
    orderBy: { publishedAt: "desc" },
    take: 4,
  });
  return rows.map(toPublic);
}