/**
 * POST /api/admin/share/entry/[id]/rollback
 * 把指定历史 version 拷贝回 draft（不直接修改 Entry.status，由用户再次 publish）
 *
 * body: { version: number }
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const { version } = (await req.json()) as { version?: number };
  if (!version) return NextResponse.json({ error: "缺少 version" }, { status: 400 });

  const v = await prisma.entryVersion.findUnique({
    where: { entryId_version: { entryId: params.id, version } },
  });
  if (!v) return NextResponse.json({ error: "version 不存在" }, { status: 404 });

  await prisma.entryDraft.update({
    where: { entryId: params.id },
    data: {
      payload: v.payload,
      updatedById: auth.id,
    },
  });

  await writeAudit({
    userId: auth.id,
    action: "rollback",
    targetType: "entry",
    targetId: params.id,
    meta: { fromVersion: version },
  });

  return NextResponse.json({ ok: true });
}