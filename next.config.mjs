/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // 容器化部署：standalone 输出（仅拷贝必要依赖 + server.js）
  output: "standalone",
  // react-markdown / remark-gfm 整条依赖链都是 ESM-only，
  // 让 Next.js 用 swc 转译后再打包，避免 server component 渲染时吐空内容
  transpilePackages: [
    "react-markdown",
    "remark-gfm",
    "remark",
    "micromark",
    "micromark-extension-gfm",
    "mdast-util-gfm",
    "unist-util-stringify-position",
    "hast-util-to-jsx-runtime",
  ],
  // 上传 / API 路由大文件需要
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
};

export default nextConfig;