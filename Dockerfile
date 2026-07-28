# 卧宁睡眠 · Next.js 生产镜像
# 多阶段构建：deps → builder → runner

# ==================== Stage 1: deps ====================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# 单独装依赖，最大化缓存命中
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# ==================== Stage 2: builder ====================
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
# public 目录可能在 .dockerignore 中被忽略，确保空目录存在
RUN mkdir -p ./public/uploads/images ./public/uploads/videos
COPY . .

# Next.js standalone 输出（仅依赖 + .next/standalone，不带 src）
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://woning:woning@db:5432/woning?schema=public"
# 容器 build 阶段无法访问 Google Fonts；跳过字体下载，运行时由浏览器按需加载
ENV NEXT_FONT_GOOGLE_MOCKED_RESPONSES=""
# build 时不连 DB（跳过 generateStaticParams + DB queries）
ENV NEXT_BUILD_SKIP_DB=1
ENV NEXT_SKIP_STATIC_GENERATION=1
RUN npx prisma generate
RUN npm run build

# ==================== Stage 3: runner ====================
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl curl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 非 root 用户
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# standalone 输出 + static + public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Prisma schema + migrations（migrate / seed job 需要）
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/data ./data
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib
COPY --from=builder --chown=nextjs:nodejs /app/types ./types
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# 上传目录（运行时挂载）
RUN mkdir -p /app/public/uploads/images /app/public/uploads/videos \
 && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:3000/ || exit 1

CMD ["node", "server.js"]