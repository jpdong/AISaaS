# 安装指南

## 系统要求

在开始安装 AI SaaS 之前，请确保您的系统满足以下要求：

### 必需软件

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| Node.js | 18.0.0 | 20.x LTS | JavaScript 运行时 |
| Bun | 1.0.0 | 最新版本 | 快速的 JavaScript 运行时（推荐） |
| PostgreSQL | 14.0 | 15.x | 主数据库 |
| Redis | 6.0 | 7.x | 缓存和会话存储 |
| Git | 2.30 | 最新版本 | 版本控制 |

### 操作系统支持

- **macOS**: 10.15+ (Catalina)
- **Linux**: Ubuntu 20.04+, CentOS 8+, Debian 11+
- **Windows**: Windows 10+ (推荐使用 WSL2)

## 安装步骤

### 1. 安装 Node.js 和 Bun

#### 使用 Bun (推荐)

```bash
# 安装 Bun
curl -fsSL https://bun.sh/install | bash

# 重新加载 shell 配置
source ~/.bashrc  # 或 ~/.zshrc

# 验证安装
bun --version
```

#### 使用 Node.js

```bash
# 使用 nvm 安装 Node.js (推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# 验证安装
node --version
npm --version
```

### 2. 安装 PostgreSQL

#### macOS (使用 Homebrew)

```bash
# 安装 PostgreSQL
brew install postgresql@15

# 启动服务
brew services start postgresql@15

# 创建数据库
createdb open_launch
```

#### Ubuntu/Debian

```bash
# 更新包列表
sudo apt update

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库用户和数据库
sudo -u postgres psql
CREATE USER open_launch_user WITH PASSWORD 'your_password';
CREATE DATABASE open_launch OWNER open_launch_user;
GRANT ALL PRIVILEGES ON DATABASE open_launch TO open_launch_user;
\\q
```

#### Docker (跨平台)



### 3. 安装 Redis

#### macOS (使用 Homebrew)

```bash
# 安装 Redis
brew install redis

# 启动服务
brew services start redis

# 验证安装
redis-cli ping
```

#### Ubuntu/Debian

```bash
# 安装 Redis
sudo apt install redis-server

# 启动服务
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 验证安装
redis-cli ping
```

#### Docker



### 4. 克隆项目


### 5. 安装项目依赖

```bash
# 使用 Bun (推荐)
bun install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 6. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量文件
nano .env  # 或使用您喜欢的编辑器
```

基本配置示例：

```env
# 应用配置
NEXT_PUBLIC_URL=http://localhost:3000

# 数据库配置
DATABASE_URL=postgresql://open_launch_user:your_password@localhost:5432/open_launch
REDIS_URL=redis://localhost:6379

# 认证配置
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-key-here

# 邮件配置 (开发环境可选)
RESEND_API_KEY=re_your_api_key_here
```

### 7. 初始化数据库

```bash
# 生成数据库迁移文件
bun run db:generate

# 执行数据库迁移
bun run db:migrate

# 推送架构到数据库
bun run db:push

# 验证数据库连接
bun run db:studio  # 打开 Drizzle Studio
```

### 8. 初始化基础数据

```bash
# 运行分类初始化脚本
bun scripts/categories.ts

# 如果脚本不存在，可以手动创建分类
# 参考 scripts 目录下的示例文件
```

### 9. 启动开发服务器

```bash
# 启动开发服务器
bun run dev

# 或使用 npm
npm run dev
```

### 10. 验证安装

打开浏览器访问 `http://localhost:3000`，您应该能看到 AI SaaS 的主页。

## 常见安装问题

### 数据库连接问题

**问题**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**解决方案**:
```bash
# 检查 PostgreSQL 是否运行
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# 检查连接字符串格式
# 确保 DATABASE_URL 格式正确
DATABASE_URL=postgresql://username:password@host:port/database
```

### Redis 连接问题

**问题**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**解决方案**:
```bash
# 检查 Redis 是否运行
redis-cli ping

# 如果没有响应，启动 Redis
sudo systemctl start redis-server  # Linux
brew services start redis  # macOS
```

### 依赖安装问题

**问题**: `npm ERR! peer dep missing`

**解决方案**:
```bash
# 清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 或使用 Bun
bun install --force
```

### 端口占用问题

**问题**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程
kill -9 <PID>

# 或使用不同端口
PORT=3001 bun run dev
```

## 开发工具推荐

### 代码编辑器

- **VS Code** (推荐)
  - 安装 TypeScript 扩展
  - 安装 Tailwind CSS IntelliSense
  - 安装 Prettier 扩展
  - 安装 ESLint 扩展

### 数据库工具

- **Drizzle Studio**: `bun run db:studio`
- **pgAdmin**: PostgreSQL 图形化管理工具
- **TablePlus**: 跨平台数据库客户端

### API 测试工具

- **Postman**: API 测试和文档
- **Insomnia**: 轻量级 API 客户端
- **Thunder Client**: VS Code 扩展

## 下一步

安装完成后，请继续阅读：

- [配置指南](./configuration.md) - 详细的配置说明
- [首次运行](./first-run.md) - 首次启动和设置
- [开发环境搭建](../development/setup.md) - 开发环境优化

## 获取帮助


*最后更新: 2025年1月4日*