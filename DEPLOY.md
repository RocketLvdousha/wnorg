# 卧宁睡眠 · 部署手册

目标：**push main 自动部署到服务器**。

整个流水线：

```
本地 main  → GitHub Actions (build & push)
           → GHCR (ghcr.io/<owner>/woning-web)
           → 服务器 SSH 执行 deploy.sh
           → docker compose pull & up -d web
```

---

## 0. 服务器前置要求

- Linux（Ubuntu 22.04+ / Debian 12+）
- Docker Engine 24+ 与 Docker Compose v2
- 域名 DNS 解析到服务器公网 IP
- 80 / 443 端口可被外网访问
- 已建部署用户并配好 sudo（部署脚本里只用了 sudo mkdir/chown）

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-plugin nginx
sudo usermod -aG docker $USER  # 重新登录生效
sudo systemctl enable --now docker nginx
```

---

## 1. 服务器一次性初始化

```bash
# 1) 建目录结构
sudo mkdir -p /opt/woning /var/lib/woning/{db,uploads/images,uploads/videos}
sudo chown -R $USER:$USER /opt/woning /var/lib/woning

# 2) 拉代码到 /opt/woning
cd /opt/woning && git clone git@github.com:<owner>/woning.git .

# 3) 拷贝环境变量模板并填好
cp .env.production.example .env.production
$EDITOR .env.production
```

`.env.production` 关键字段：

| 变量 | 说明 |
|---|---|
| `POSTGRES_PASSWORD` | Postgres 密码（**强密码**，16+ 位） |
| `NEXTAUTH_URL` | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` 生成 |
| `ADMIN_EMAIL` | 后台初始账号 |
| `ADMIN_PASSWORD` | 后台初始密码（**强密码**） |
| `ADMIN_NAME` | 后台显示名 |
| `MAX_IMAGE_SIZE` / `MAX_VIDEO_SIZE` | 上传限制（默认 10M / 200M） |

```bash
# 4) 首次部署（自动建库、跑 migrate、seed）
chmod +x deploy/deploy.sh
./deploy/deploy.sh --init
```

完成后：

```bash
docker compose ps                  # 确认 web / db 都 healthy
curl http://localhost:3000         # 200 OK
```

---

## 2. Nginx 反代 + HTTPS

```bash
sudo ln -s /opt/woning/deploy/nginx/woning.conf /etc/nginx/sites-available/woning
sudo ln -s /etc/nginx/sites-available/woning /etc/nginx/sites-enabled/woning
sudo nginx -t

# 申请证书（certbot）
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# certbot 会自动编辑 woning.conf 的 80 → 301 → 443 那段，把 HTTPS server 块放开
sudo nginx -t && sudo systemctl reload nginx
```

---

## 3. GitHub Actions 自动部署

在 GitHub 仓库 → Settings → Secrets，新增：

| Secret | 说明 |
|---|---|
| `DEPLOY_HOST` | 服务器 IP / 域名 |
| `DEPLOY_USER` | SSH 用户名 |
| `DEPLOY_SSH_KEY` | 私钥（对应服务器的 `~/.ssh/authorized_keys`） |

并在 GitHub 仓库 → Settings → Actions → General → Workflow permissions
勾选 **Read and write permissions**（让 GITHUB_TOKEN 能 push 到 GHCR）。

> 镜像默认推送到 `ghcr.io/<owner>/woning-web`。如果是私有仓库，需要在服务器
> `docker login ghcr.io` 用一个有 `read:packages` 权限的 PAT。

之后：每次 `git push origin main` 就会自动：

1. GitHub Actions build & push 镜像到 GHCR
2. SSH 到服务器执行 `deploy.sh ghcr.io/<owner>/woning-web:<sha>`
3. 服务器拉新镜像 → docker compose up -d web

---

## 4. 日常操作

```bash
# 手动滚动更新到 latest
cd /opt/woning && ./deploy/deploy.sh

# 回滚到上一个版本
docker compose pull web                       # 先看可用的 tag
# 改 docker-compose.yml 里的 image 行，或：
docker compose up -d --force-recreate web \
  ghcr.io/<owner>/woning-web:<sha>

# 查看日志
docker compose logs -f web
docker compose logs -f db

# 进入容器
docker compose exec web sh
docker compose exec db psql -U woning -d woning

# 备份数据库
docker compose exec -T db pg_dump -U woning -d woning | gzip > backup-$(date +%F).sql.gz

# 恢复
gunzip -c backup.sql.gz | docker compose exec -T db psql -U woning -d woning

# 上传文件备份（直接 rsync）
rsync -av /var/lib/woning/uploads/ backup-host:/backups/woning/
```

---

## 5. 目录结构

```
/opt/woning/
├── .env.production         # 部署用环境变量（含密钥，不入 git）
├── docker-compose.yml      # web + db 编排
├── Dockerfile              # 多阶段构建
└── deploy/
    ├── deploy.sh           # 服务器一键部署
    └── nginx/
        └── woning.conf     # Nginx 反代模板

/var/lib/woning/
├── db/                     # Postgres 数据卷
└── uploads/
    ├── images/             # admin 上传的图片
    └── videos/             # admin 上传的视频
```

---

## 6. 排错

| 现象 | 排查 |
|---|---|
| 502 / 504 | Nginx 上游端口（默认 127.0.0.1:3000）连不上；`docker compose ps` 看 web 是否 healthy |
| web 起不来 | `docker compose logs web`，常因 `DATABASE_URL` / `NEXTAUTH_SECRET` 没填 |
| 上传 413 | Nginx `client_max_body_size 220m;` 已设；如果 nginx 在前面 + 别忘了上传组件本身 |
| Prisma 迁移报错 | 容器内手动跑：`docker compose run --rm web npx prisma migrate deploy` |
| 证书过期 | `sudo certbot renew`（一般自动续期） |

---

## 7. 升级 checklist

1. 本地改代码 → `npm run build` 通过
2. `git push origin main`
3. GitHub Actions 跑完两个 job（build + deploy）
4. 服务器上 `docker compose logs -f web` 看是否正常启动
5. 浏览器访问 https://your-domain.com

回滚：服务器上把 `docker-compose.yml` 的 image tag 改成上一个 SHA → `docker compose up -d web`。