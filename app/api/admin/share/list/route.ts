/**
 * GET /api/admin/share/list
 * 列出所有条目（含草稿、已发布、归档），按更新时间倒序
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";

export async function GET() {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const entries = await prisma.entry.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      drafts: { select: { updatedAt: true, updatedById: true } },
      versions: {
        orderBy: { version: "desc" },
        take: 1,
        select: { version: true, publishedAt: true },
      },
    },
  });

  // 仅记录一次 list（避免审计风暴）；取消注释启用
  // await writeAudit({ userId: auth.id, action: "list_entries" });

  return NextResponse.json({ entries });
}