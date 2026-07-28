/**
 * 鉴权辅助：从 NextAuth 服务端 session 拿到当前用户 id
 * API route handler 顶部调用一次。
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdminUser(): Promise<
  { id: string; role: string; email: string; name: string } | Response
> {
  const session = await getServerSession(authOptions);
  const u = session?.user as { id?: string; role?: string; email?: string; name?: string } | undefined;
  if (!u?.id) {
    return new Response(JSON.stringify({ error: "未登录" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return { id: u.id, role: u.role ?? "editor", email: u.email ?? "", name: u.name ?? "" };
}

export async function writeAudit(params: {
  userId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  meta?: Record<string, unknown>;
}) {
  const { prisma } = await import("@/lib/db");
  await prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      meta: params.meta ? JSON.stringify(params.meta) : null,
    },
  });
}