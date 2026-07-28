/**
 * GET   /api/admin/share/entry/[id]   取单条（含 draft payload）
 * DELETE /api/admin/share/entry/[id]  删除条目（含 draft、versions）
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const entry = await prisma.entry.findUnique({
    where: { id: params.id },
    include: {
      drafts: true,
      versions: { orderBy: { version: "desc" } },
    },
  });
  if (!entry) return NextResponse.json({ error: "not found" }, { status: 404 });

  // 把 payload 从 string 还原成 object 方便前端
  const out = {
    ...entry,
    drafts: entry.drafts.map((d) => ({ ...d, payload: JSON.parse(d.payload) })),
    versions: entry.versions.map((v) => ({ ...v, payload: JSON.parse(v.payload) })),
  };

  return NextResponse.json({ entry: out });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  await prisma.entry.delete({ where: { id: params.id } });

  await writeAudit({
    userId: auth.id,
    action: "delete_entry",
    targetType: "entry",
    targetId: params.id,
  });

  return NextResponse.json({ ok: true });
}