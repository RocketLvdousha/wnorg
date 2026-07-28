#!/usr/bin/env bash
# 卧宁睡眠 · 服务器一键部署脚本
#
# 用法：
#   ./deploy.sh                       拉 latest 滚动更新
#   ./deploy.sh ghcr.io/xxx:tag       拉指定 tag 滚动更新
#   ./deploy.sh --init                首次部署（自动起 db、跑 migrate、seed）
#
# 前置：
#   /opt/woning/.env.production       已就位（POSTGRES_PASSWORD / NEXTAUTH_SECRET 等）
#   /var/lib/woning/{db,uploads}      目录存在
#
set -euo pipefail

COMPOSE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$COMPOSE_DIR"

IMAGE_TAG="${1:-}"
INIT=0
if [[ "${1:-}" == "--init" ]]; then
  INIT=1
  IMAGE_TAG=""
fi

# ===== 工具 =====
say()  { printf "\033[36m[deploy]\033[0m %s\n" "$*"; }
warn() { printf "\033[33m[deploy]\033[0m %s\n" "$*" >&2; }
die()  { printf "\033[31m[deploy]\033[0m %s\n" "$*" >&2; exit 1; }

# ===== 检查 .env =====
[[ -f .env.production ]] || die ".env.production 不存在，请从 .env.production.example 拷贝并填写"

# ===== 首次部署 =====
if [[ "$INIT" == "1" ]]; then
  say "首次部署：建目录 → 启 db → 跑 migrate → seed → 启 web"
  sudo mkdir -p /var/lib/woning/{db,uploads/images,uploads/videos}
  sudo chown -R "$(id -u):$(id -g)" /var/lib/woning

  docker compose pull db || true
  docker compose up -d db
  say "等 db 健康..."
  for i in $(seq 1 30); do
    if docker compose exec -T db pg_isready -U woning -d woning >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done

  # 跑 migrate（生产用 deploy，不会改 schema）
  say "运行 Prisma 迁移..."
  docker compose run --rm --no-deps web \
    sh -c 'npx prisma migrate deploy'

  # 跑 seed（创建初始 admin + share / about / home 种子）
  say "运行 seed..."
  docker compose run --rm --no-deps web \
    sh -c 'npx prisma db seed'

  say "启动 web..."
  docker compose up -d web

  say "首次部署完成 ✓"
  say "→ http://localhost:3000"
  say "→ admin 后台 /admin/login"
  exit 0
fi

# ===== 滚动更新 =====
if [[ -z "$IMAGE_TAG" ]]; then
  IMAGE_TAG="ghcr.io/${GITHUB_REPOSITORY_OWNER:-woning}/woning-web:latest"
fi

say "拉新镜像：$IMAGE_TAG"
# .env 里 GITHUB_REPOSITORY_OWNER 留空；这里直接传 tag
docker compose pull web || warn "web 镜像拉取失败（私有镜像需先 docker login ghcr.io）"

# 用指定 tag 临时覆盖 compose 里的 image
say "重启 web..."
GITHUB_REPOSITORY_OWNER="$(echo "$IMAGE_TAG" | cut -d/ -f2 | cut -d/ -f1)" \
docker compose up -d web

# 清理旧镜像（保留最近 3 个）
say "清理旧镜像..."
docker image prune -f --filter "until=24h" || true

say "部署完成 ✓"
docker compose ps