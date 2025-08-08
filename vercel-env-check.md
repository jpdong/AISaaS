# Vercel 环境变量配置检查清单

## 必须在 Vercel 中配置的环境变量

### UploadThing 相关
```bash
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlXzRmNTNmMmYxMjhlYWQxYTA5YzU2ZTNkZGNiOTM4MmY5YTZiYWMxYmRkZGIwMTEwY2ViMDU3OTg2NGU3ZGQ2YjYiLCJhcHBJZCI6ImVhY3liazI1ZjciLCJyZWdpb25zIjpbInNlYTEiXX0=
NEXT_PUBLIC_UPLOADTHING_URL=eacybk25f7.ufs.sh
```

### 生产环境 URL 配置
```bash
NEXT_PUBLIC_URL=https://your-domain.vercel.app
BETTER_AUTH_URL=https://your-domain.vercel.app
```

### 其他必要变量
```bash
DATABASE_URL=postgres://8a2630f3b4dcdb4de2329b6508fed6e0f1899c8986f387f6633a60dd58143426:sk_W2HtusHB9MX3YHXwGTN6P@db.prisma.io:5432/?sslmode=require
BETTER_AUTH_SECRET=idLHyKoVq5IqCRA2hCGZh9TNTpONFKb7
RESEND_API_KEY=re_dQpmTkw6_QfqBaa4vQL3DQRbFrWXfSxgp
```

## 配置步骤

1. 登录 Vercel Dashboard
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加上述所有变量
5. 确保每个变量都设置为 Production, Preview, Development 环境
6. 重新部署项目

## 验证方法

部署后检查 Vercel 函数日志，应该看到：
```
UploadThing Config: {
  hasToken: true,
  tokenLength: 108,
  url: 'eacybk25f7.ufs.sh'
}
```