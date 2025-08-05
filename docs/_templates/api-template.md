# API 名称

## 概述
API 功能描述

## 端点列表

### GET /api/example
获取示例数据

#### 请求参数
| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| id | string | 是 | 资源ID |
| limit | number | 否 | 返回数量限制 |

#### 请求示例
```bash
curl -X GET "https://api.example.com/api/example?id=123&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 响应格式
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "示例名称"
  },
  "meta": {
    "total": 1,
    "page": 1
  }
}
```

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "请求参数无效"
  }
}
```

## 错误代码
| 代码 | 描述 | 解决方案 |
|------|------|----------|
| INVALID_REQUEST | 请求参数无效 | 检查请求参数格式 |
| UNAUTHORIZED | 未授权访问 | 检查认证令牌 |