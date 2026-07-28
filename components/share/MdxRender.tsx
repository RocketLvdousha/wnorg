/**
 * 前台 MDX 渲染器（服务端渲染，避免客户端 hydration 卡顿）
 * - 支持标准 markdown（标题、列表、代码块、表格、链接）
 * - 自定义语法：[video](url) → <video> 标签
 * - 顶层 <video src="..."> 原始 HTML 也可（用户直接贴的视频）
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MdxRender({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        // 把 ![alt](url) 里的图片强制走 next/image 关闭（用普通 img 保证外链可访问）
        img: ({ src, alt }) =>
          src ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={src}
              alt={alt ?? ""}
              className="my-6 max-w-full border border-ink-700/10"
              loading="lazy"
            />
          ) : null,
        // 自定义语法：[video](url) → 视频播放器
        a: ({ href, children }) => {
          if (
            typeof href === "string" &&
            (/\.(mp4|webm|mov)$/i.test(href) || href.includes("/videos/"))
          ) {
            const label = Array.isArray(children)
              ? children.filter((c): c is string => typeof c === "string").join("")
              : typeof children === "string"
              ? children
              : "";
            return (
              <div className="my-6">
                <video
                  src={href}
                  controls
                  playsInline
                  className="w-full border border-ink-700/10 bg-ink-700"
                />
                {label && (
                  <div className="mt-2 text-[11px] text-charcoal/50 italic">
                    {label}
                  </div>
                )}
              </div>
            );
          }
          return (
            <a
              href={href}
              className="text-forest-600 underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          );
        },
        h1: ({ children }) => (
          <h1 className="cn-display mb-4 mt-10 text-3xl text-ink-700">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="cn-display mb-3 mt-8 text-2xl text-ink-700">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="cn-display mb-3 mt-6 text-xl text-ink-700">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-5 text-[15px] leading-[1.95] text-charcoal/85">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-5 list-disc pl-6 text-[15px] leading-[1.95] text-charcoal/85">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-5 list-decimal pl-6 text-[15px] leading-[1.95] text-charcoal/85">
            {children}
          </ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-5 border-l-2 border-forest-600/50 bg-forest-600/[0.04] px-4 py-3 text-[14px] italic text-charcoal/70">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className="block overflow-x-auto bg-ink-700 px-4 py-3 text-[13px] text-bone-100">
                {children}
              </code>
            );
          }
          return (
            <code className="bg-ink-700/10 px-1.5 py-0.5 text-[13px] text-ink-700">
              {children}
            </code>
          );
        },
        table: ({ children }) => (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full border border-ink-700/15 text-[14px]">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-ink-700/20 bg-bone-100 px-3 py-2 text-left text-ink-700">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-ink-700/10 px-3 py-2 text-charcoal/80">
            {children}
          </td>
        ),
      }}
    >
      {source}
    </ReactMarkdown>
  );
}