/**
 * POST /api/admin/share/entry/[id]/publish
 * 草稿 → 发布：
 *   1) EntryDraft.payload → 新 EntryVersion（version 自增）
 *   2) Entry.status = "published"
 *   3) Entry.slug / category 也按 draft 同步（如果允许）
 *
 * body: { note?: string }
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";
import { normalizePayload } from "@/lib/share-types";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const body = (await req.json().catch(() => ({}))) as { note?: string };

  const entry = await prisma.entry.findUnique({
    where: { id: params.id },
    include: { drafts: true, versions: { orderBy: { version: "desc" }, take: 1 } },
  });
  const draft = entry?.drafts?.[0];
  if (!entry || !draft) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const payload = normalizePayload(JSON.parse(draft.payload));
  const nextVersion = (entry.versions[0]?.version ?? 0) + 1;

  await prisma.$transaction([
    prisma.entryVersion.create({
      data: {
        entryId: entry.id,
        version: nextVersion,
        payload: JSON.stringify(payload),
        publishedById: auth.id,
        note: body.note,
      },
    }),
    prisma.entry.update({
      where: { id: entry.id },
      data: {
        status: "published",
        publishedAt: new Date(),
      },
    }),
  ]);

  await writeAudit({
    userId: auth.id,
    action: "publish",
    targetType: "entry",
    targetId: entry.id,
    meta: { version: nextVersion, note: body.note },
  });

  return NextResponse.json({ ok: true, version: nextVersion });
}