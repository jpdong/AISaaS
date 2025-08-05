# 首次运行指南

## 启动前检查

在首次启动 AI SaaS 之前，请确保已完成以下步骤：

### ✅ 检查清单

- [ ] 已安装所有必需软件 (Node.js/Bun, PostgreSQL, Redis)
- [ ] 已克隆项目并安装依赖
- [ ] 已配置基本环境变量
- [ ] 数据库服务正在运行
- [ ] Redis 服务正在运行

### 快速验证

```bash
# 检查 Node.js/Bun 版本
bun --version
# 或
node --version

# 检查数据库连接
psql $DATABASE_URL -c "SELECT version();"

# 检查 Redis 连接
redis-cli -u $REDIS_URL ping
```

## 数据库初始化

### 1. 生成数据库架构

```bash
# 生成 Drizzle 迁移文件
bun run db:generate

# 查看生成的迁移文件
ls -la drizzle/migrations/
```

**预期输出**:
```
drizzle/migrations/
├── 0000_initial_schema.sql
├── meta/
│   ├── _journal.json
│   └── 0000_snapshot.json
```

### 2. 执行数据库迁移

```bash
# 执行迁移到数据库
bun run db:migrate

# 推送架构更改
bun run db:push
```

### 3. 验证数据库架构

```bash
# 启动 Drizzle Studio 查看数据库
bun run db:studio
```

访问 `https://local.drizzle.studio` 查看数据库表结构。

**预期表结构**:
- `user` - 用户表
- `session` - 会话表
- `account` - 第三方账户表
- `project` - 项目表
- `category` - 分类表
- `project_to_category` - 项目分类关联表
- `upvote` - 投票表
- `fuma_comments` - 评论表
- `fuma_rates` - 评论评分表
- `launch_quota` - 发布配额表
- `waitlist_submission` - 等待列表表
- `seo_article` - SEO 文章表
- `blog_article` - 博客文章表

## 初始化基础数据

### 1. 创建分类数据

检查是否存在分类初始化脚本：

```bash
# 查看 scripts 目录
ls -la scripts/

# 如果存在 categories.ts，直接运行
bun scripts/categories.ts
```

如果脚本不存在，手动创建分类：

```bash
# 连接到数据库
psql $DATABASE_URL

# 插入基础分类
INSERT INTO category (id, name, created_at, updated_at) VALUES
('cat_1', 'AI & Machine Learning', NOW(), NOW()),
('cat_2', 'Web Development', NOW(), NOW()),
('cat_3', 'Mobile Apps', NOW(), NOW()),
('cat_4', 'Developer Tools', NOW(), NOW()),
('cat_5', 'Design Tools', NOW(), NOW()),
('cat_6', 'Productivity', NOW(), NOW()),
('cat_7', 'Marketing', NOW(), NOW()),
('cat_8', 'Analytics', NOW(), NOW()),
('cat_9', 'E-commerce', NOW(), NOW()),
('cat_10', 'Social Media', NOW(), NOW());

# 验证插入结果
SELECT * FROM category;

# 退出数据库
\\q
```

### 2. 创建管理员用户 (可选)

如果需要管理员权限，可以手动创建管理员用户：

```sql
-- 连接数据库后执行
INSERT INTO "user" (
  id, 
  name, 
  email, 
  email_verified, 
  role, 
  created_at, 
  updated_at
) VALUES (
  'admin_' || gen_random_uuid()::text,
  'Admin User',
  'admin@open-launch.com',
  true,
  'admin',
  NOW(),
  NOW()
);
```

## 首次启动

### 1. 启动开发服务器

```bash
# 使用 Bun (推荐)
bun run dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

**预期输出**:
```
$ next dev --turbopack
  ▲ Next.js 15.3.2 (turbopack)
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in 2.3s
```

### 2. 访问应用

打开浏览器访问 `http://localhost:3000`

**预期页面内容**:
- AI SaaS 主页
- 导航栏 (登录/注册按钮)
- 今日产品展示区域
- 分类列表
- 页脚信息

### 3. 测试核心功能

#### 用户注册和登录

1. **邮箱注册**:
   - 点击 "Sign Up" 按钮
   - 填写邮箱和密码
   - 检查邮件验证 (如果配置了 Resend)

2. **OAuth 登录** (如果已配置):
   - 点击 "Continue with Google"
   - 完成 OAuth 流程

3. **验证用户会话**:
   ```bash
   # 查看数据库中的用户和会话
   psql $DATABASE_URL -c "SELECT id, name, email FROM \"user\";"
   psql $DATABASE_URL -c "SELECT id, user_id, expires_at FROM session;"
   ```

#### 项目提交功能

1. 登录后访问项目提交页面
2. 填写项目信息:
   - 项目名称
   - 描述
   - 网站 URL
   - Logo 上传 (如果配置了 UploadThing)
   - 选择分类
   - 技术栈
   - 平台类型

3. 提交项目并验证数据库记录:
   ```bash
   psql $DATABASE_URL -c "SELECT id, name, slug, launch_status FROM project;"
   ```

#### 投票功能

1. 在项目列表中点击投票按钮
2. 验证投票记录:
   ```bash
   psql $DATABASE_URL -c "SELECT user_id, project_id, created_at FROM upvote;"
   ```

## 功能验证

### 1. API 端点测试

```bash
# 测试健康检查端点 (如果存在)
curl http://localhost:3000/api/health

# 测试项目列表 API
curl http://localhost:3000/api/projects

# 测试分类列表 API
curl http://localhost:3000/api/categories
```

### 2. 数据库查询测试

```sql
-- 查看用户统计
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users
FROM "user";

-- 查看项目统计
SELECT 
  launch_status,
  COUNT(*) as count
FROM project 
GROUP BY launch_status;

-- 查看投票统计
SELECT 
  p.name,
  COUNT(u.id) as upvote_count
FROM project p
LEFT JOIN upvote u ON p.id = u.project_id
GROUP BY p.id, p.name
ORDER BY upvote_count DESC;
```

### 3. 缓存功能测试

```bash
# 检查 Redis 中的缓存键
redis-cli -u $REDIS_URL KEYS "*"

# 查看会话数据
redis-cli -u $REDIS_URL KEYS "session:*"

# 查看限流数据
redis-cli -u $REDIS_URL KEYS "rate_limit:*"
```

## 常见启动问题

### 数据库连接错误

**错误**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**解决方案**:
```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# 启动 PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS

# 检查连接字符串
echo $DATABASE_URL
```

### Redis 连接错误

**错误**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**解决方案**:
```bash
# 检查 Redis 状态
redis-cli ping

# 启动 Redis
sudo systemctl start redis-server  # Linux
brew services start redis  # macOS
```

### 环境变量错误

**错误**: `Error: BETTER_AUTH_SECRET is required`

**解决方案**:
```bash
# 检查环境变量
echo $BETTER_AUTH_SECRET

# 生成新的密钥
openssl rand -base64 32

# 更新 .env 文件
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> .env
```

### 端口占用错误

**错误**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 查找占用进程
lsof -i :3000

# 终止进程
kill -9 <PID>

# 或使用其他端口
PORT=3001 bun run dev
```

### 依赖版本冲突

**错误**: `Module not found` 或版本冲突

**解决方案**:
```bash
# 清理依赖
rm -rf node_modules
rm package-lock.json  # 或 bun.lockb

# 重新安装
bun install --force

# 检查依赖版本
bun list
```

## 性能优化建议

### 1. 开发环境优化

```bash
# 使用 Turbopack 加速开发
bun run dev --turbo

# 启用实验性功能
export NEXT_EXPERIMENTAL_TURBO=true
```

### 2. 数据库连接池

在 `.env` 中配置连接池：

```env
# 添加连接池参数
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require&pgbouncer=true&connection_limit=20
```

### 3. Redis 配置优化

```env
# Redis 连接池配置
REDIS_URL=redis://localhost:6379?maxRetriesPerRequest=3&retryDelayOnFailover=100
```

## 监控和日志

### 1. 启用开发日志

```env
# .env.local
NEXT_PUBLIC_DEBUG=true
NODE_ENV=development
```

### 2. 查看应用日志

```bash
# 查看 Next.js 日志
tail -f .next/trace

# 查看数据库日志 (PostgreSQL)
sudo tail -f /var/log/postgresql/postgresql-15-main.log  # Linux
tail -f /usr/local/var/log/postgres.log  # macOS

# 查看 Redis 日志
sudo tail -f /var/log/redis/redis-server.log  # Linux
tail -f /usr/local/var/log/redis.log  # macOS
```

## 下一步

首次运行成功后，建议继续阅读：

- [开发环境搭建](../development/setup.md) - 优化开发环境
- [API 文档](../api/authentication.md) - 了解 API 接口
- [业务逻辑](../business-logic/project-lifecycle.md) - 理解业务流程
- [部署指南](../deployment/vercel.md) - 准备生产部署

## 获取帮助

如果在首次运行过程中遇到问题：

1. 查看 [故障排除指南](../troubleshooting/common-issues.md)
2. 检查 [GitHub Issues](https://github.com/drdruide/open-launch/issues)
3. 在社区中寻求帮助

---

*最后更新: 2025年1月4日*