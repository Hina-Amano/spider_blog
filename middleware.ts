import { NextRequest, NextResponse } from 'next/server'
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
})

// 路由 → 所需角色（Clerk Organization Role 或自定义 metadata）
const PROTECTED: Array<{ pattern: RegExp; roles: string[] }> = [
    { pattern: /^\/admin/,          roles: ['admin'] },
    { pattern: /^\/docs\/private/,  roles: ['admin', 'editor', 'viewer'] },
]

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const rule = PROTECTED.find(r => r.pattern.test(pathname))

    // 公开路由直接放行
    if (!rule) return NextResponse.next()

    // 用 @clerk/backend 验证请求
    const requestState = await clerk.authenticateRequest(req, {
        authorizedParties: [process.env.NEXT_PUBLIC_APP_URL!],
    })

    // 未登录 → 跳转 Clerk 托管登录页
    if (requestState.status !== 'signed-in') {
        const signInUrl = new URL('https://accounts.你的域名.com/sign-in')
        signInUrl.searchParams.set('redirect_url', req.url)
        return NextResponse.redirect(signInUrl)
    }

    // 读取用户角色（存在 publicMetadata 里）
    const token = requestState.toAuth()
    const userRole = (token?.sessionClaims?.metadata as any)?.role ?? 'viewer'

    if (!rule.roles.includes(userRole)) {
        return NextResponse.rewrite(new URL('/403', req.url))
    }

    // 通过，注入用户信息到 header
    const res = NextResponse.next()
    res.headers.set('x-user-id', token?.userId ?? '')
    res.headers.set('x-user-role', userRole)
    return res
}

export const config = {
    matcher: ['/admin/:path*', '/docs/private/:path*'],
}