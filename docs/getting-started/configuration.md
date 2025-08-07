# 配置指南

## 环境变量配置

AI SaaS 使用环境变量来管理不同环境下的配置。本指南将详细说明每个环境变量的用途和配置方法。

### 配置文件结构

```
.env.example         # 环境变量模板 (已提交到版本控制)
.env                 # 本地开发环境配置 (不提交到版本控制)
.env.local           # 本地覆盖配置 (可选，优先级更高)
.env.production      # 生产环境配置 (部署时使用)
```

**为什么使用 `.env` 而不是 `.env.local`？**

Open Launch 项目选择使用 `.env` 作为主要配置文件的原因：

1. **开源项目惯例**: 提供 `.env.example` 模板，用户复制为 `.env`
2. **简化配置**: 避免多个环境文件的复杂性
3. **统一管理**: 开发和本地测试使用同一配置文件
4. **清晰明确**: 所有配置都在一个文件中，便于管理

如果你需要覆盖某些配置，可以创建 `.env.local` 文件，它会自动覆盖 `.env` 中的相同变量。

## 配置分类

Open Launch 的配置分为三类：
- **必需配置**: 应用正常运行所必需的配置
- **推荐配置**: 提升用户体验的配置
- **可选配置**: 高级功能的配置

## 必需配置

### 应用基础配置

```env
# 应用访问地址
NEXT_PUBLIC_URL=http://localhost:3000


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
3. 启用 Google+ API 和 Google Identity API
4. 创建 OAuth 2.0 客户端 ID

**重定向 URI 配置**:
```
http://localhost:3000/api/auth/callback/google  # 开发环境
https://your-domain.com/api/auth/callback/google  # 生产环境
```

**环境变量配置**:
```env
# Google OAuth 基础配置
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google One Tap (通常使用相同的 Client ID)
NEXT_PUBLIC_ONE_TAP_CLIENT_ID=your-google-client-id
```

**常见问题**:
- 如果遇到 "Missing required parameter: client_id" 错误，请确保 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 已正确配置
- Google One Tap 功能需要在 Google Cloud Console 中启用 "Google Identity API"
- 确保域名已添加到 Google OAuth 的授权域名列表中

### GitHub OAuth 设置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写应用信息

**配置参数**:
- Application name: `AI SaaS`
- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

## 可选服务配置

### Stripe 支付配置 (可选)

**如果不需要支付功能，可以跳过此配置。应用会自动禁用相关功能。**

```env
# Stripe 密钥 (可选)
STRIPE_SECRET_KEY=sk_test_xxx  # 测试环境
# STRIPE_SECRET_KEY=sk_live_xxx  # 生产环境

# Stripe Webhook 密钥 (可选)
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 支付链接 (可选)
NEXT_PUBLIC_PREMIUM_PAYMENT_LINK=https://buy.stripe.com/xxx
NEXT_PUBLIC_PREMIUM_PLUS_PAYMENT_LINK=https://buy.stripe.com/xxx
```

**功能影响**:
- 如果未配置 Stripe，用户仍可以免费提交项目
- 高级功能（Premium/Premium Plus）将不可用
- 用户管理和基础功能不受影响

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

## 功能可用性检查

Open Launch 会根据环境变量配置自动启用/禁用功能。你可以使用以下方法检查功能状态：

### 开发环境功能状态

启动开发服务器时，控制台会显示功能状态：

```bash
bun run dev

# 输出示例:
🚀 Feature Flags Status:
  💳 Stripe: ❌
  🔐 Google OAuth: ✅
  🐙 GitHub OAuth: ✅
  📧 Email: ❌
  📁 File Upload: ✅
  🤖 Captcha: ✅
  💬 Discord: ❌
  📊 Analytics: ❌
```

### 代码中检查功能状态

```typescript
import { featureFlags, isFeatureEnabled } from '@/lib/feature-flags'

// 检查 Stripe 是否可用
if (featureFlags.stripe.enabled) {
  // 显示付费功能
}

// 检查可用的 OAuth 提供商
const oauthProviders = getAvailableOAuthProviders()
// ['google', 'github']

// 检查是否有任何 OAuth 提供商
if (hasAnyOAuthProvider()) {
  // 显示社交登录选项
}
```

## 配置验证

### 配置检查脚本

使用内置的配置检查脚本验证环境变量：

```bash
# 检查所有配置
bun run check-config

# 或使用 npm
npm run check-config
```

**输出示例**:
```
🚀 Open Launch 配置检查工具

🔍 检查必需配置...

✅ DATABASE_URL: 已配置
✅ REDIS_URL: 已配置  
✅ BETTER_AUTH_SECRET: 已配置
✅ NEXT_PUBLIC_URL: 已配置

✅ 所有必需配置都已设置

🔍 检查可选功能配置...

✅ 🔐 Google OAuth 登录: 已完整配置
⭕ 💳 Stripe 支付功能: 未配置 (功能将被禁用)
✅ 📁 文件上传功能: 已完整配置

📋 总结:
✅ 应用可以正常启动
💡 可选功能将根据配置自动启用/禁用
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