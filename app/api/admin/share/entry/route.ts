/**
 * POST /api/admin/share/entry         新建条目（同时建初始 draft）
 * body: { category, slug }
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";
import { SHARE_CATEGORIES, normalizePayload, type ShareCategoryKey } from "@/lib/share-types";

export async function POST(req: Request) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const { category, slug } = (await req.json()) as {
    category?: string;
    slug?: string;
  };

  if (!category || !slug) {
    return NextResponse.json({ error: "缺少 category / slug" }, { status: 400 });
  }
  if (!SHARE_CATEGORIES.some((c) => c.key === category)) {
    return NextResponse.json({ error: "未知分类" }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "slug 仅允许小写字母、数字、连字符" }, { status: 400 });
  }

  const exists = await prisma.entry.findUnique({
    where: { category_slug: { category, slug } },
  });
  if (exists) {
    return NextResponse.json({ error: "slug 在该分类下已存在" }, { status: 409 });
  }

  const emptyPayload = JSON.stringify(normalizePayload({}));

  const entry = await prisma.entry.create({
    data: {
      slug,
      category: category as ShareCategoryKey,
      status: "draft",
      drafts: {
        create: {
          payload: emptyPayload,
          updatedById: auth.id,
        },
      },
    },
  });

  await writeAudit({
    userId: auth.id,
    action: "create_entry",
    targetType: "entry",
    targetId: entry.id,
    meta: { category, slug },
  });

  return NextResponse.json({ entry });
}