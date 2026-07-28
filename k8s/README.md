# 卧宁睡眠 · k8s 部署手册

适用：Sealos / 任意自建 k8s 集群（ingress-nginx + cert-manager）。

---

## 0. 前置

```bash
# kubectl + kubeconfig 已就绪
kubectl get nodes
kubectl get ns
```

集群里需要：

- **ingress-nginx**（或同等 controller）
- **cert-manager**（自动签 TLS；可换成手动 TLS secret）
- **动态 storageClass**（用于 PVC；RWX 存储用于 uploads）

```bash
kubectl get ingressclass
kubectl get clusterissuer   # cert-manager issuer
kubectl get sc              # storage class
```

---

## 1. 第一次部署

### 1.1 准备 Secret

```bash
# 生成密钥
NEW_SECRET=$(openssl rand -base64 32)
NEW_PG_PASS=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 24)
NEW_ADMIN_PASS=$(openssl rand -base64 18 | tr -dc 'A-Za-z0-9' | head -c 18)

# 写 secret.yaml（替换占位）
cp k8s/secret.example.yaml k8s/secret.yaml
sed -i \
  -e "s|CHANGE-ME-32+chars-random-base64|$NEW_SECRET|" \
  -e "s|CHANGE-ME-strong-password|$NEW_PG_PASS|g" \
  -e "s|woning:CHANGE-ME-strong-password|woning:$NEW_PG_PASS|" \
  k8s/secret.yaml
```

> **生产 Secret 不要入 git**。建议：
> - 先 apply 上去，再 `kubectl apply -f k8s/secret.yaml`
> - 或者改用 External Secrets / Sealed Secrets
> - CI 场景：把整个 secret.yaml 编码后塞 GitHub Secret `WONING_SECRET`，CI 里 `echo | kubectl apply`

### 1.2 应用全部资源

```bash
# 改 Ingress 域名（如果不一样）
sed -i 's/woning.live/your-domain.com/g' k8s/web-ingress.yaml

# 改 Deployment 里的镜像 owner
sed -i 's/ghcr.io\/<owner>\//ghcr.io\/YOUR-OWNER\//g' \
  k8s/web-deployment.yaml k8s/jobs/migrate-job.yaml k8s/jobs/seed-job.yaml

# 应用
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
kubectl apply -f k8s/uploads-pvc.yaml
kubectl apply -f k8s/web-service.yaml
kubectl apply -f k8s/web-deployment.yaml
kubectl apply -f k8s/web-ingress.yaml
```

### 1.3 跑迁移 + seed

```bash
# 跑 Prisma 迁移
kubectl apply -f k8s/jobs/migrate-job.yaml
kubectl wait --for=condition=complete job/woning-migrate -n ns-woning --timeout=180s

# 首次 seed（创建初始 admin）
kubectl apply -f k8s/jobs/seed-job.yaml
kubectl wait --for=condition=complete job/woning-seed -n ns-woning --timeout=180s
```

### 1.4 验证

```bash
kubectl get all -n ns-woning
kubectl logs -n ns-woning -l app=woning,component=web --tail=100
kubectl get ingress -n ns-woning
```

浏览器访问 https://your-domain.com，看是否 200。后台：

```
https://your-domain.com/admin/login
admin@woning.local / <ADMIN_PASSWORD>
```

> 登录后请立即在 admin 后台改 admin 密码。

---

## 2. 镜像推送 + 自动部署

GitHub Actions 已经写好：`.github/workflows/deploy.yml`。

需要在仓库 Settings → Secrets 配置：

| Secret | 说明 |
|---|---|
| `KUBECONFIG` | base64 之后的 kubeconfig 内容（`cat kubeconfig \| base64 -w0`） |
| `WONING_SECRET` | `k8s/secret.yaml` 的全部内容（如果走 CI 注入） |

之后：

```bash
git push origin main
# → Actions build image
# → kubectl apply -f k8s/...
# → kubectl rollout status deployment/woning-web
```

---

## 3. 日常操作

### 3.1 滚动更新

```bash
# 改 image tag 并 apply
kubectl set image deployment/woning-web web=ghcr.io/<owner>/woning-web:newtag -n ns-woning

# 或直接 apply（文件里 image 已改成新 tag）
kubectl apply -f k8s/web-deployment.yaml
```

### 3.2 回滚

```bash
kubectl rollout undo deployment/woning-web -n ns-woning
# 指定版本回滚
kubectl rollout undo deployment/woning-web --to-revision=3 -n ns-woning
kubectl rollout history deployment/woning-web -n ns-woning
```

### 3.3 扩容

```bash
# 手动
kubectl scale deployment/woning-web --replicas=4 -n ns-woning

# 自动（HPA 已经部署，按 CPU 70% 在 2-6 之间扩缩）
kubectl get hpa -n ns-woning
```

### 3.4 备份 Postgres

```bash
# 进入容器导出
kubectl exec -n ns-woning statefulset/postgres -c postgres -- \
  pg_dump -U woning -d woning | gzip > backup-$(date +%F).sql.gz

# 恢复
gunzip -c backup.sql.gz | kubectl exec -i -n ns-woning statefulset/postgres -c postgres -- \
  psql -U woning -d woning
```

### 3.5 备份 uploads

```bash
# uploads 走 PVC 持久卷，集群本身会做备份（取决于存储类）
# 手动导出
kubectl exec -n ns-woning <web-pod> -- tar czf - /app/public/uploads > uploads.tgz
```

---

## 4. 资源清单

| 资源 | 类型 | 副本 | 备注 |
|---|---|---|---|
| ns-woning | Namespace | - | 隔离 |
| woning-config | ConfigMap | - | 非密配置 |
| woning-secret | Secret | - | POSTGRES_PASSWORD / NEXTAUTH_SECRET 等 |
| postgres | StatefulSet | 1 | Postgres 16 |
| postgres-data | PVC | - | 20Gi RWO |
| woning-web | Deployment | 2 (HPA 2-6) | Next.js |
| woning-uploads | PVC | - | 50Gi RWX |
| woning-web | Service | - | ClusterIP:80 |
| woning-web | Ingress | - | TLS via cert-manager |
| woning-migrate / woning-seed | Job | - | 部署时跑一次 |

---

## 5. 排错

| 现象 | 排查 |
|---|---|
| Pod CrashLoopBackOff | `kubectl logs -n ns-woning <pod>`，常因 `DATABASE_URL` 或 `NEXTAUTH_SECRET` 缺失 |
| Pod Pending | PVC 绑定失败；`kubectl describe pvc -n ns-woning` |
| 多副本 uploads 文件不同步 | PVC 不是 RWX；要么换 NFS / CephFS，要么缩到 1 副本 |
| Ingress 502 | 后端服务没起来或证书未签发；`kubectl describe ingress -n ns-woning` |
| migrate Job 失败 | 旧 Job 残留；`kubectl delete job woning-migrate -n ns-woning --ignore-not-found` 再重跑 |

---

## 6. Sealos 特定注意

- Sealos 默认有 `ingressClassName: nginx` + 内置 cert-manager
- 控制台 → 数据库可以直接用「外部 Postgres」代替 StatefulSet；那样只需 `web-deployment.yaml` + `Ingress`
- 镜像如果推 GHCR，需要 Sealos 集群能拉（公网 OK；私有要 imagePullSecret）