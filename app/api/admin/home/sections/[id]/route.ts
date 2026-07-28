/**
 * GET    /api/admin/home/sections/[id]
 * PUT    /api/admin/home/sections/[id]
 * DELETE /api/admin/home/sections/[id]
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminUser, writeAudit } from "@/lib/admin-session";

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;
  const section = await prisma.homeSection.findUnique({
    where: { id: params.id },
  });
  if (!section) {
    return NextResponse.json({ error: "区块不存在" }, { status: 404 });
  }
  return NextResponse.json({ section });
}

export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;

  const body = (await req.json()) as {
    payload?: unknown;
    title?: string;
    visible?: boolean;
  };
  const section = await prisma.homeSection.update({
    where: { id: params.id },
    data: {
      payload: body.payload !== undefined ? JSON.stringify(body.payload) : undefined,
      title: body.title,
      visible: body.visible,
      updatedById: auth.id,
    },
  });

  await writeAudit({
    userId: auth.id,
    action: "update_home_section",
    targetType: "home_section",
    targetId: section.id,
    meta: { type: section.type, visible: section.visible },
  });
  return NextResponse.json({ section });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAdminUser();
  if (auth instanceof Response) return auth;
  const section = await prisma.homeSection.delete({
    where: { id: params.id },
  });
  await writeAudit({
    userId: auth.id,
    action: "delete_home_section",
    targetType: "home_section",
    targetId: section.id,
    meta: { type: section.type },
  });
  return NextResponse.json({ ok: true });
}