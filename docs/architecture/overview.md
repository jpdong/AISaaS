# 系统架构概览

## 架构设计理念

AI SaaS 采用现代化的全栈架构设计，基于以下核心理念：

- **单体优先**: 使用 Next.js 全栈框架，简化部署和维护
- **类型安全**: 全面使用 TypeScript，确保代码质量
- **性能优先**: 利用 React Server Components 和缓存策略
- **可扩展性**: 模块化设计，支持功能扩展
- **开发体验**: 优化的开发工具链和热重载

## 整体架构图

```mermaid
graph TB
    subgraph "客户端层"
        A[Web 浏览器]
        B[移动浏览器]
    end
    
    subgraph "CDN/边缘层"
        C[Vercel Edge Network]
        D[静态资源缓存]
    end
    
    subgraph "应用层"
        E[Next.js App Router]
        F[React Server Components]
        G[Client Components]
        H[API Routes]
        I[Server Actions]
        J[Middleware]
    end
    
    subgraph "业务逻辑层"
        K[认证服务]
        L[项目管理]
        M[投票系统]
        N[支付处理]
        O[文件上传]
        P[邮件服务]
    end
    
    subgraph "数据访问层"
        Q[Drizzle ORM]
        R[数据库连接池]
        S[缓存管理]
    end
    
    subgraph "数据存储层"
        T[PostgreSQL]
        U[Redis]
        V[文件存储]
    end
    
    subgraph "外部服务"
        W[Stripe API]
        X[UploadThing]
        Y[Resend]
        Z[Cloudflare]
        AA[Discord]
    end
    
    A --> C
    B --> C
    C --> E
    D --> C
    
    E --> F
    E --> G
    E --> H
    E --> I
    E --> J
    
    F --> K
    G --> K
    H --> L
    I --> M
    J --> K
    
    K --> Q
    L --> Q
    M --> Q
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R
    Q --> S
    R --> T
    S --> U
    O --> V
    
    N --> W
    O --> X
    P --> Y
    J --> Z
    L --> AA
```

## 技术栈架构

### 前端架构

```mermaid
graph LR
    subgraph "UI 层"
        A[React 19]
        B[Tailwind CSS]
        C[Shadcn/ui]
        D[Lucide Icons]
    end
    
    subgraph "状态管理"
        E[Zustand]
        F[React Hook Form]
        G[TanStack Table]
    end
    
    subgraph "路由和导航"
        H[Next.js App Router]
        I[Dynamic Routes]
        J[Parallel Routes]
    end
    
    subgraph "数据获取"
        K[Server Actions]
        L[API Routes]
        M[React Query]
    end
    
    A --> E
    B --> A
    C --> A
    D --> A
    
    E --> F
    E --> G
    
    H --> I
    H --> J
    
    K --> L
    L --> M
```

### 后端架构

```mermaid
graph TB
    subgraph "API 层"
        A[Next.js API Routes]
        B[Server Actions]
        C[Middleware]
    end
    
    subgraph "认证层"
        D[Better Auth]
        E[OAuth Providers]
        F[Session Management]
    end
    
    subgraph "业务逻辑层"
        G[Project Service]
        H[User Service]
        I[Vote Service]
        J[Payment Service]
        K[Email Service]
    end
    
    subgraph "数据访问层"
        L[Drizzle ORM]
        M[Query Builder]
        N[Migration System]
    end
    
    subgraph "缓存层"
        O[Redis Cache]
        P[Next.js Cache]
        Q[Database Query Cache]
    end
    
    A --> D
    B --> D
    C --> D
    
    D --> E
    D --> F
    
    A --> G
    B --> H
    A --> I
    B --> J
    A --> K
    
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M
    L --> N
    
    L --> O
    A --> P
    L --> Q
```

## 数据流架构

### 请求处理流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant C as 客户端
    participant M as Middleware
    participant A as API/Server Action
    participant S as Service Layer
    participant D as Database
    participant R as Redis
    
    U->>C: 发起请求
    C->>M: 路由请求
    M->>M: 认证检查
    M->>A: 转发请求
    A->>S: 调用业务逻辑
    S->>R: 检查缓存
    alt 缓存命中
        R->>S: 返回缓存数据
    else 缓存未命中
        S->>D: 查询数据库
        D->>S: 返回数据
        S->>R: 更新缓存
    end
    S->>A: 返回结果
    A->>C: 响应数据
    C->>U: 更新界面
```

### 数据同步流程

```mermaid
graph LR
    subgraph "数据写入"
        A[用户操作] --> B[表单验证]
        B --> C[Server Action]
        C --> D[业务逻辑]
        D --> E[数据库写入]
        E --> F[缓存更新]
    end
    
    subgraph "数据读取"
        G[页面加载] --> H[缓存检查]
        H --> I{缓存是否有效}
        I -->|是| J[返回缓存数据]
        I -->|否| K[查询数据库]
        K --> L[更新缓存]
        L --> J
    end
    
    F --> H
```

## 安全架构

### 认证和授权流程

```mermaid
graph TB
    subgraph "认证层"
        A[Better Auth]
        B[OAuth Providers]
        C[Email/Password]
        D[Session Management]
    end
    
    subgraph "授权层"
        E[Role-Based Access]
        F[Resource Permissions]
        G[API Rate Limiting]
    end
    
    subgraph "安全防护"
        H[CSRF Protection]
        I[XSS Prevention]
        J[SQL Injection Prevention]
        K[Cloudflare Turnstile]
    end
    
    A --> B
    A --> C
    A --> D
    
    D --> E
    E --> F
    E --> G
    
    A --> H
    A --> I
    A --> J
    A --> K
```

### 数据保护策略

```mermaid
graph LR
    subgraph "传输安全"
        A[HTTPS/TLS]
        B[API 加密]
        C[Cookie 安全]
    end
    
    subgraph "存储安全"
        D[密码哈希]
        E[敏感数据加密]
        F[数据库权限]
    end
    
    subgraph "访问控制"
        G[身份验证]
        H[权限检查]
        I[会话管理]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> I
```

## 性能架构

### 缓存策略

```mermaid
graph TB
    subgraph "多层缓存"
        A[CDN 缓存]
        B[Next.js 缓存]
        C[Redis 缓存]
        D[数据库查询缓存]
    end
    
    subgraph "缓存类型"
        E[静态资源缓存]
        F[页面缓存]
        G[API 响应缓存]
        H[数据库结果缓存]
    end
    
    subgraph "缓存策略"
        I[TTL 过期]
        J[LRU 淘汰]
        K[手动失效]
        L[预热缓存]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    E --> I
    F --> J
    G --> K
    H --> L
```

### 数据库优化

```mermaid
graph LR
    subgraph "查询优化"
        A[索引优化]
        B[查询计划]
        C[批量操作]
    end
    
    subgraph "连接管理"
        D[连接池]
        E[连接复用]
        F[超时控制]
    end
    
    subgraph "数据分区"
        G[表分区]
        H[读写分离]
        I[数据归档]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> I
```

## 可扩展性设计

### 水平扩展策略

```mermaid
graph TB
    subgraph "应用层扩展"
        A[无状态设计]
        B[负载均衡]
        C[容器化部署]
    end
    
    subgraph "数据层扩展"
        D[数据库集群]
        E[Redis 集群]
        F[分布式存储]
    end
    
    subgraph "服务拆分"
        G[微服务架构]
        H[API 网关]
        I[服务发现]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> I
```

### 模块化设计

```mermaid
graph LR
    subgraph "核心模块"
        A[认证模块]
        B[项目模块]
        C[用户模块]
    end
    
    subgraph "功能模块"
        D[投票模块]
        E[支付模块]
        F[通知模块]
    end
    
    subgraph "工具模块"
        G[邮件模块]
        H[文件模块]
        I[缓存模块]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> I
```

## 部署架构

### Vercel 部署架构

```mermaid
graph TB
    subgraph "Vercel 平台"
        A[Edge Network]
        B[Serverless Functions]
        C[Static Assets]
        D[Build System]
    end
    
    subgraph "外部服务"
        E[Neon PostgreSQL]
        F[Upstash Redis]
        G[UploadThing Storage]
    end
    
    subgraph "第三方集成"
        H[Stripe API]
        I[Resend Email]
        J[Cloudflare DNS]
    end
    
    A --> B
    A --> C
    B --> D
    
    B --> E
    B --> F
    B --> G
    
    B --> H
    B --> I
    A --> J
```

### 容器化部署架构

```mermaid
graph TB
    subgraph "容器编排"
        A[Docker Compose]
        B[Kubernetes]
        C[Load Balancer]
    end
    
    subgraph "应用容器"
        D[Next.js App]
        E[PostgreSQL]
        F[Redis]
        G[Nginx]
    end
    
    subgraph "监控和日志"
        H[Prometheus]
        I[Grafana]
        J[ELK Stack]
    end
    
    A --> D
    B --> E
    C --> F
    A --> G
    
    D --> H
    E --> I
    F --> J
```

## 监控和可观测性

### 监控架构

```mermaid
graph LR
    subgraph "应用监控"
        A[性能指标]
        B[错误追踪]
        C[用户行为]
    end
    
    subgraph "基础设施监控"
        D[服务器指标]
        E[数据库监控]
        F[网络监控]
    end
    
    subgraph "业务监控"
        G[用户注册]
        H[项目提交]
        I[支付转化]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> I
```

## 技术选型理由

### 前端技术选型

| 技术 | 选择理由 | 替代方案 |
|------|----------|----------|
| Next.js 15 | 全栈框架，SSR/SSG 支持，优秀的开发体验 | Remix, SvelteKit |
| React 19 | 成熟的生态系统，Server Components 支持 | Vue.js, Svelte |
| TypeScript | 类型安全，更好的开发体验和代码质量 | JavaScript, Flow |
| Tailwind CSS | 实用优先，快速开发，一致的设计系统 | Styled Components, CSS Modules |

### 后端技术选型

| 技术 | 选择理由 | 替代方案 |
|------|----------|----------|
| Drizzle ORM | 类型安全，性能优秀，轻量级 | Prisma, TypeORM |
| PostgreSQL | 功能丰富，ACID 支持，JSON 支持 | MySQL, MongoDB |
| Redis | 高性能缓存，丰富的数据结构 | Memcached, DragonflyDB |
| Better Auth | 现代化，类型安全，功能完整 | NextAuth.js, Auth0 |

### 部署平台选型

| 平台 | 优势 | 适用场景 |
|------|------|----------|
| Vercel | 零配置部署，全球 CDN，优秀的 Next.js 支持 | 快速原型，中小型应用 |
| Docker | 环境一致性，可移植性，容器编排 | 企业部署，复杂环境 |
| AWS/GCP | 完整的云服务，高可用性，可扩展性 | 大型应用，企业级部署 |

## 架构演进路径

### 当前架构 (v1.0)

- 单体应用架构
- Vercel 部署
- 基础功能完整

### 中期演进 (v2.0)

- 引入微服务架构
- 容器化部署
- 高级分析功能

### 长期规划 (v3.0)

- 分布式架构
- 多区域部署
- AI 功能集成

## 相关文档

- [数据库架构](./database-schema.md) - 详细的数据模型设计
- [API 设计](./api-design.md) - API 架构和设计原则
- [安全架构](./security.md) - 安全措施和最佳实践
- [部署指南](../deployment/vercel.md) - 生产环境部署

---

*最后更新: 2025年1月4日*