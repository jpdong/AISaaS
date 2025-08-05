# AI SaaS 项目文档

## 项目简介

AI SaaS 是一个开源的产品发现平台，为 Product Hunt 提供了完整的替代方案。该平台使用现代 Web 技术栈构建，支持产品展示、投票系统、分类浏览、用户认证、支付集成等完整功能。

### 核心功能

- **产品发现**: 浏览最新发布的技术产品和趋势
- **投票系统**: 为喜欢的产品投票，支持反垃圾邮件机制
- **分类浏览**: 按主题分类浏览产品
- **用户仪表板**: 个性化用户界面和项目管理
- **管理系统**: 完整的后台管理功能
- **支付集成**: Stripe 支付系统，支持高级功能
- **评论系统**: 基于 Fuma Comment 的内置评论功能
- **趋势展示**: 热门产品和获奖者展示
- **安全防护**: 多层安全措施和反垃圾邮件保护

### 平台特色

- **开源免费**: 完全开源，可自由部署和定制
- **现代技术栈**: 使用最新的 Web 技术构建
- **高性能**: 优化的数据库查询和缓存策略
- **移动友好**: 响应式设计，完美支持移动设备
- **国际化**: 支持多语言和本地化
- **可扩展**: 模块化架构，易于扩展新功能

## 技术栈概览

### 前端技术

| 技术 | 版本 | 描述 | 官网 |
|------|------|------|------|
| Next.js | 15.3.2 | React 全栈框架 | [nextjs.org](https://nextjs.org) |
| React | 19.1.0 | 用户界面库 | [reactjs.org](https://reactjs.org) |
| TypeScript | 5.8.3 | 类型安全的 JavaScript | [typescriptlang.org](https://www.typescriptlang.org) |
| Tailwind CSS | 4.1.6 | 实用优先的 CSS 框架 | [tailwindcss.com](https://tailwindcss.com) |
| Shadcn/ui | 最新 | 可访问的组件库 | [ui.shadcn.com](https://ui.shadcn.com) |

### 后端技术

| 技术 | 版本 | 描述 | 官网 |
|------|------|------|------|
| Next.js API Routes | 15.3.2 | 无服务器 API | [nextjs.org/docs/api-routes](https://nextjs.org/docs/api-routes/introduction) |
| Drizzle ORM | 0.40.1 | TypeScript ORM | [orm.drizzle.team](https://orm.drizzle.team) |
| PostgreSQL | 最新 | 关系型数据库 | [postgresql.org](https://www.postgresql.org) |
| Redis | 最新 | 内存数据库 | [redis.io](https://redis.io) |
| Better Auth | 1.2.7 | 现代认证解决方案 | [better-auth.com](https://better-auth.com) |

### 第三方服务

| 服务 | 用途 | 官网 |
|------|------|------|
| Stripe | 支付处理 | [stripe.com](https://stripe.com) |
| UploadThing | 文件上传 | [uploadthing.com](https://uploadthing.com) |
| Resend | 邮件发送 | [resend.com](https://resend.com) |
| Cloudflare Turnstile | 机器人防护 | [cloudflare.com/products/turnstile](https://www.cloudflare.com/products/turnstile) |
| Discord Webhook | 通知系统 | [discord.com](https://discord.com) |
| Plausible | 网站分析 | [plausible.io](https://plausible.io) |

## 项目架构概述

```mermaid
graph TB
    subgraph "前端层"
        A[Next.js App Router]
        B[React 组件]
        C[Tailwind CSS]
        D[Shadcn/ui]
    end
    
    subgraph "API 层"
        E[Next.js API Routes]
        F[Server Actions]
        G[Middleware]
    end
    
    subgraph "业务逻辑层"
        H[认证服务]
        I[项目管理]
        J[投票系统]
        K[支付处理]
    end
    
    subgraph "数据层"
        L[PostgreSQL]
        M[Redis]
        N[Drizzle ORM]
    end
    
    subgraph "外部服务"
        O[Stripe]
        P[UploadThing]
        Q[Resend]
        R[Cloudflare]
    end
    
    A --> E
    B --> F
    E --> H
    F --> I
    H --> N
    I --> N
    J --> N
    N --> L
    N --> M
    K --> O
    I --> P
    H --> Q
    G --> R
```

## 快速开始

### 环境要求

- Node.js 18+ 或 Bun
- PostgreSQL 14+
- Redis 6+
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/drdruide/open-launch.git
   cd open-launch
   ```

2. **安装依赖**
   ```bash
   bun install
   # 或使用 npm
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入必要的配置
   ```

4. **初始化数据库**
   ```bash
   bun run db:generate
   bun run db:migrate
   bun run db:push
   ```

5. **初始化数据**
   ```bash
   bun scripts/categories.ts
   ```

6. **启动开发服务器**
   ```bash
   bun run dev
   ```

7. **访问应用**
   打开浏览器访问 `http://localhost:3000`

### 核心配置

最基本的环境变量配置：

```env
# 应用基础配置
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=contact@open-launch.com

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/open_launch
REDIS_URL=redis://localhost:6379

# 认证配置
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key

# 邮件服务
RESEND_API_KEY=re_your_api_key
```

## 文档导航

### 📚 快速开始
- [安装指南](./getting-started/installation.md) - 详细的安装步骤
- [配置指南](./getting-started/configuration.md) - 环境变量和服务配置
- [首次运行](./getting-started/first-run.md) - 首次启动和初始化

### 🏗️ 系统架构
- [架构概览](./architecture/overview.md) - 系统整体架构设计
- [数据库架构](./architecture/database-schema.md) - 数据模型和关系
- [API 设计](./architecture/api-design.md) - API 架构和设计原则
- [安全架构](./architecture/security.md) - 安全措施和最佳实践

### 💻 开发指南
- [开发环境搭建](./development/setup.md) - 本地开发环境配置
- [代码规范](./development/coding-standards.md) - 编码标准和最佳实践
- [测试指南](./development/testing.md) - 测试策略和工具
- [贡献指南](./development/contributing.md) - 如何为项目贡献代码

### 🚀 部署指南
- [Vercel 部署](./deployment/vercel.md) - Vercel 平台部署指南
- [Docker 部署](./deployment/docker.md) - 容器化部署方案
- [环境变量配置](./deployment/environment-variables.md) - 生产环境配置
- [监控和日志](./deployment/monitoring.md) - 系统监控和日志管理

### 📡 API 文档
- [认证 API](./api/authentication.md) - 用户认证和授权接口
- [项目 API](./api/projects.md) - 项目管理相关接口
- [用户 API](./api/users.md) - 用户管理接口
- [管理 API](./api/admin.md) - 管理员功能接口

### 🔄 业务逻辑
- [项目生命周期](./business-logic/project-lifecycle.md) - 项目从提交到发布的完整流程
- [投票系统](./business-logic/voting-system.md) - 投票机制和反垃圾邮件
- [支付流程](./business-logic/payment-flow.md) - Stripe 支付集成
- [排名算法](./business-logic/ranking-algorithm.md) - 项目排名和推荐算法

### 🛠️ 故障排除
- [常见问题](./troubleshooting/common-issues.md) - 常见问题和解决方案
- [性能优化](./troubleshooting/performance.md) - 性能问题诊断和优化
- [调试指南](./troubleshooting/debugging.md) - 调试技巧和工具

## 社区和支持

- **GitHub**: [drdruide/open-launch](https://github.com/drdruide/open-launch)
- **问题反馈**: [GitHub Issues](https://github.com/drdruide/open-launch/issues)
- **功能请求**: [GitHub Discussions](https://github.com/drdruide/open-launch/discussions)
- **Twitter**: [@ericbn09](https://x.com/ericbn09)

## 许可证

本项目采用 AI SaaS 许可证。详见 [LICENSE](../LICENSE) 文件。

**注意**: 所有使用都需要包含带有 dofollow 链接的署名。

---

*最后更新: 2025年1月4日*