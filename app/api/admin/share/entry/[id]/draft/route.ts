/**
 * PUT /api/admin/share/entry/[id]/draft
 * 保存草稿（覆盖 draft.payload，不影响 Entry.status）
 * body: { payload: SharePayload }
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";
import { normalizePayload } from "@/lib/share-types";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const body = (await req.json()) as { payload?: unknown };
  const payload = normalizePayload(body.payload);

  const entry = await prisma.entry.findUnique({ where: { id: params.id } });
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  // 自动把 slug 同步到 draft（slug 一旦发布就锁定，这里 draft 阶段仍允许改）
  await prisma.entryDraft.update({
    where: { entryId: params.id },
    data: {
      payload: JSON.stringify(payload),
      updatedById: auth.id,
    },
  });

  await writeAudit({
    userId: auth.id,
    action: "save_draft",
    targetType: "entry",
    targetId: params.id,
    meta: { title_zh: payload.title_zh },
  });

  return NextResponse.json({ ok: true });
}