/**
 * 示例组件：根据功能配置动态显示内容
 * 这个组件展示了如何根据环境配置动态启用/禁用功能
 */

import { featureFlags, getAvailableOAuthProviders } from '@/lib/feature-flags'

export function FeatureAwareComponent() {
  const oauthProviders = getAvailableOAuthProviders()

  return (
    <div className="space-y-4">
      {/* 登录选项 */}
      <div>
        <h3>登录选项</h3>
        
        {/* 邮箱登录始终可用 */}
        <button>邮箱登录</button>
        
        {/* OAuth 登录 - 根据配置显示 */}
        {oauthProviders.includes('google') && (
          <button>Google 登录</button>
        )}
        
        {oauthProviders.includes('github') && (
          <button>GitHub 登录</button>
        )}
        
        {oauthProviders.length === 0 && (
          <p className="text-gray-500">
            社交登录未配置，请使用邮箱登录
          </p>
        )}
      </div>

      {/* 支付功能 */}
      <div>
        <h3>项目提交</h3>
        
        {/* 免费提交始终可用 */}
        <button>免费提交项目</button>
        
        {/* 付费功能 - 根据 Stripe 配置显示 */}
        {featureFlags.stripe.enabled ? (
          <div>
            <button>Premium 提交</button>
            <button>Premium Plus 提交</button>
          </div>
        ) : (
          <p className="text-gray-500">
            高级功能暂未开放
          </p>
        )}
      </div>

      {/* 文件上传 */}
      <div>
        <h3>文件上传</h3>
        
        {featureFlags.upload.enabled ? (
          <input type="file" accept="image/*" />
        ) : (
          <p className="text-gray-500">
            文件上传功能未配置，请使用图片链接
          </p>
        )}
      </div>

      {/* 验证码 */}
      <div>
        <h3>安全验证</h3>
        
        {featureFlags.captcha.enabled ? (
          <div>启用了 Cloudflare Turnstile 验证</div>
        ) : (
          <div>验证码功能未启用</div>
        )}
      </div>

      {/* 功能状态调试信息 (仅开发环境) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h4>功能状态 (开发环境)</h4>
          <pre className="text-sm">
            {JSON.stringify(featureFlags, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

// 服务端组件示例
export async function ServerFeatureCheck() {
  return (
    <div>
      <h2>服务端功能检查</h2>
      
      {/* 在服务端检查功能状态 */}
      {featureFlags.email.enabled ? (
        <p>✅ 邮件功能已启用</p>
      ) : (
        <p>❌ 邮件功能未配置</p>
      )}
      
      {featureFlags.discord.enabled ? (
        <p>✅ Discord 通知已启用</p>
      ) : (
        <p>❌ Discord 通知未配置</p>
      )}
    </div>
  )
}