# 配置指南

## 环境变量配置

AI SaaS 使用环境变量来管理不同环境下的配置。本指南将详细说明每个环境变量的用途和配置方法。

### 配置文件结构

```
.env                 # 本地开发环境配置
.env.example         # 环境变量模板
.env.local           # 本地覆盖配置 (可选)
.env.production      # 生产环境配置 (部署时使用)
```

## 必需配置

### 应用基础配置

```env
# 应用访问地址
NEXT_PUBLIC_URL=http://localhost:3000

# 联系邮箱
NEXT_PUBLIC_CONTACT_EMAIL=contact@open-launch.com
```

| 变量 | 说明 | 示例 |
|------|------|------|
| `NEXT_PUBLIC_URL` | 应用的完整访问地址，用于生成绝对链接 | `https://your-domain.com` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 显示在前端的联系邮箱 | `contact@example.com` |

### 数据库配置

```env
# PostgreSQL 数据库连接字符串
DATABASE_URL=postgresql://username:password@localhost:5432/open_launch

# Redis 连接字符串
REDIS_URL=redis://localhost:6379
```

#### PostgreSQL 连接字符串格式

```
postgresql://[username[:password]@][host[:port]][/database][?parameter_list]
```

**示例配置**:
- 本地开发: `postgresql://postgres:password@localhost:5432/open_launch`
- Neon: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb`
- Supabase: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`

#### Redis 连接字符串格式

```
redis://[username:password@]host[:port][/database]
```

**示例配置**:
- 本地开发: `redis://localhost:6379`
- Upstash: `redis://default:password@region.upstash.io:port`
- Railway: `redis://default:password@containers-us-west-xxx.railway.app:port`

### 认证配置

```env
# Better Auth 基础配置
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-minimum-32-characters

# Google OAuth (可选)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (可选)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google One Tap (可选)
NEXT_PUBLIC_ONE_TAP_CLIENT_ID=your-google-client-id
```

#### 生成安全密钥

```bash
# 生成 32 字符随机密钥
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## OAuth 服务配置

### Google OAuth 设置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID

**重定向 URI 配置**:
```
http://localhost:3000/api/auth/callback/google  # 开发环境
https://your-domain.com/api/auth/callback/google  # 生产环境
```

### GitHub OAuth 设置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息

**配置参数**:
- Application name: `AI SaaS`
- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 支付服务配置

### Stripe 配置

```env
# Stripe 密钥
STRIPE_SECRET_KEY=sk_test_xxx  # 测试环境
# STRIPE_SECRET_KEY=sk_live_xxx  # 生产环境

# Stripe Webhook 密钥
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 支付链接 (可选)
NEXT_PUBLIC_PREMIUM_PAYMENT_LINK=https://buy.stripe.com/xxx
NEXT_PUBLIC_PREMIUM_PLUS_PAYMENT_LINK=https://buy.stripe.com/xxx
```

#### Stripe 设置步骤

1. **创建 Stripe 账户**
   - 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
   - 完成账户验证

2. **获取 API 密钥**
   - 开发者 → API 密钥
   - 复制 "Secret key"

3. **配置 Webhook**
   - 开发者 → Webhooks → 添加端点
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - 事件: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

4. **创建产品和价格**
   ```bash
   # 使用 Stripe CLI 创建产品
   stripe products create --name="Premium" --description="Premium features"
   stripe prices create --product=prod_xxx --unit-amount=999 --currency=usd --recurring[interval]=month
   ```

## 邮件服务配置

### Resend 配置

```env
# Resend API 密钥
RESEND_API_KEY=re_xxx
```

#### Resend 设置步骤

1. 访问 [Resend Dashboard](https://resend.com/dashboard)
2. 创建 API 密钥
3. 验证发送域名 (生产环境)

**邮件模板配置**:
```typescript
// lib/email.ts
export const emailTemplates = {
  welcome: {
    subject: "欢迎使用 AI SaaS",
    template: "welcome-template"
  },
  resetPassword: {
    subject: "重置密码",
    template: "reset-password-template"
  }
}
```

## 安全服务配置

### Cloudflare Turnstile

```env
# Turnstile 站点密钥 (公开)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4xxx

# Turnstile 密钥 (私密)
TURNSTILE_SECRET_KEY=0x4xxx
```

#### Turnstile 设置步骤

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 "Turnstile" 服务
3. 添加站点
4. 配置域名和安全级别

## 文件上传配置

### UploadThing 配置

```env
# UploadThing 配置
NEXT_PUBLIC_UPLOADTHING_URL=your-uploadthing-url-without-protocol
UPLOADTHING_TOKEN=your-uploadthing-token
```

#### UploadThing 设置步骤

1. 访问 [UploadThing Dashboard](https://uploadthing.com/dashboard)
2. 创建新应用
3. 配置文件类型和大小限制
4. 获取 API 密钥

**文件上传限制配置**:
```typescript
// lib/uploadthing.ts
export const fileUploadConfig = {
  maxFileSize: "4MB",
  allowedFileTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFileCount: 1
}
```

## 通知服务配置

### Discord Webhook

```env
# Discord 通知 Webhook
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/xxx
DISCORD_LAUNCH_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/xxx
```

#### Discord Webhook 设置

1. 在 Discord 服务器中创建频道
2. 频道设置 → 整合 → Webhook
3. 创建 Webhook 并复制 URL

## 分析服务配置

### Plausible Analytics

```env
# Plausible 分析配置
PLAUSIBLE_API_KEY=your-api-key
PLAUSIBLE_URL=https://plausible.io  # 或自托管地址
PLAUSIBLE_SITE_ID=your-domain.com
```

## 定时任务配置

### Cron 任务

```env
# Cron API 密钥 (用于保护定时任务端点)
CRON_API_KEY=your-secure-cron-api-key
```

**定时任务配置**:
```typescript
// 每日排名更新 (UTC 8:00)
// 0 8 * * * curl -H "Authorization: Bearer ${CRON_API_KEY}" https://your-domain.com/api/cron/update-rankings

// 清理过期会话 (每小时)
// 0 * * * * curl -H "Authorization: Bearer ${CRON_API_KEY}" https://your-domain.com/api/cron/cleanup-sessions
```

## 环境特定配置

### 开发环境 (.env.local)

```env
# 开发环境特定配置
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true

# 本地数据库
DATABASE_URL=postgresql://postgres:password@localhost:5432/open_launch_dev
REDIS_URL=redis://localhost:6379/0

# 测试用的 Stripe 密钥
STRIPE_SECRET_KEY=sk_test_xxx
```

### 生产环境

```env
# 生产环境配置
NODE_ENV=production
NEXT_PUBLIC_DEBUG=false

# 生产数据库 (使用连接池)
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require&pgbouncer=true

# 生产 Redis (使用 SSL)
REDIS_URL=rediss://default:password@host:port

# 生产 Stripe 密钥
STRIPE_SECRET_KEY=sk_live_xxx
```

## 配置验证

### 环境变量检查脚本

创建 `scripts/check-env.js`:

```javascript
const requiredEnvVars = [
  'DATABASE_URL',
  'REDIS_URL',
  'BETTER_AUTH_SECRET',
  'NEXT_PUBLIC_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ 缺少必需的环境变量:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  process.exit(1);
} else {
  console.log('✅ 所有必需的环境变量都已配置');
}
```

运行检查:
```bash
node scripts/check-env.js
```

### 数据库连接测试

```bash
# 测试 PostgreSQL 连接
bun run db:studio

# 测试 Redis 连接
redis-cli -u $REDIS_URL ping
```

## 安全最佳实践

### 环境变量安全

1. **永远不要提交 .env 文件到版本控制**
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env.production
   ```

2. **使用强密码和随机密钥**
   ```bash
   # 生成强密钥
   openssl rand -hex 32
   ```

3. **定期轮换密钥**
   - API 密钥每 90 天轮换一次
   - 数据库密码每 180 天更换一次

4. **使用环境特定的配置**
   - 开发环境使用测试密钥
   - 生产环境使用独立的密钥

### 权限控制

```env
# 数据库用户权限最小化
# 创建专用数据库用户，只授予必要权限
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE open_launch TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

## 故障排除

### 常见配置错误

1. **数据库连接失败**
   ```bash
   # 检查连接字符串格式
   echo $DATABASE_URL
   
   # 测试连接
   psql $DATABASE_URL -c "SELECT version();"
   ```

2. **Redis 连接失败**
   ```bash
   # 检查 Redis 状态
   redis-cli -u $REDIS_URL ping
   ```

3. **OAuth 回调错误**
   - 检查回调 URL 是否正确配置
   - 确保域名匹配

## 下一步

配置完成后，请继续阅读：

- [首次运行](./first-run.md) - 首次启动和初始化
- [开发环境搭建](../development/setup.md) - 开发环境优化
- [部署指南](../deployment/vercel.md) - 生产环境部署

---

*最后更新: 2025年1月4日*