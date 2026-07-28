"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") || "/admin/share";

  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL_HINT || "");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setErr("邮箱或密码错误");
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-700 paper-grain">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-bone-300/10 bg-ink-800/60 p-8 backdrop-blur"
      >
        <div className="en-mono mb-2 text-[10px] uppercase tracking-[0.32em] text-gold-300">
          Admin · Sign in
        </div>
        <h1 className="cn-display mb-8 text-2xl text-bone-100">
          卧宁睡眠 · 内容后台
        </h1>

        <label className="mb-4 block">
          <div className="en-mono mb-2 text-[10px] uppercase tracking-[0.24em] text-bone-300/60">
            Email
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-bone-300/20 bg-transparent px-3 py-2 text-sm text-bone-100 outline-none focus:border-gold-300"
          />
        </label>

        <label className="mb-6 block">
          <div className="en-mono mb-2 text-[10px] uppercase tracking-[0.24em] text-bone-300/60">
            Password
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-bone-300/20 bg-transparent px-3 py-2 text-sm text-bone-100 outline-none focus:border-gold-300"
          />
        </label>

        {err && <div className="mb-4 text-xs text-red-300">{err}</div>}

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-bone-100 px-4 py-2.5 text-[12px] tracking-wider text-ink-700 transition-colors hover:bg-bone-200 disabled:opacity-50"
        >
          {loading ? "登录中…" : "登录"}
        </button>

        <div className="mt-6 text-[10px] leading-relaxed text-bone-300/40">
          本页面仅供卧宁内部运营使用。所有编辑行为均记录审计日志。
        </div>
      </form>
    </div>
  );
}