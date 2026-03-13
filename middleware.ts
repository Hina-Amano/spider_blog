// middleware.ts（项目根目录）
import type { NextRequest } from 'next/server'

export const config = {
    runtime: 'edge',
    // 拦截所有 HTML 页面请求（排除静态资源）
    matcher: ['/((?!_vitepress|api|.*\\.(?:js|css|png|svg|ico|json)).*)'],
}

const VIP_ROUTES_URL = '/vip-routes.json'
let vipRoutesCache: string[] | null = null

async function getVipRoutes(baseUrl: string): Promise<string[]> {
    if (vipRoutesCache) return vipRoutesCache

    try {
        const res = await fetch(`${baseUrl}${VIP_ROUTES_URL}`)
        vipRoutesCache = await res.json()
        return vipRoutesCache!
    } catch {
        return []
    }
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const baseUrl = request.nextUrl.origin

    // 获取 VIP 路由列表
    const vipRoutes = await getVipRoutes(baseUrl)

    // 检查当前路径是否是 VIP 页面
    const isVipPage = vipRoutes.some(
        (route) => pathname === route || pathname === route.replace('.html', '')
    )

    if (!isVipPage) {
        // 普通页面，直接放行
        return new Response(null, { status: 200 })
    }

    // ---- VIP 页面鉴权 ----
    const token = request.cookies.get('vip_token')?.value

    if (!token || !isValidToken(token)) {
        // 未登录，重定向到登录页，携带 returnUrl
        const loginUrl = new URL('/login', baseUrl)
        loginUrl.searchParams.set('redirect', pathname)
        return Response.redirect(loginUrl.toString(), 302)
    }

    // 已登录，放行
    return new Response(null, { status: 200 })
}


// middleware.ts 中替换 isValidToken
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret')

async function isValidToken(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, JWT_SECRET)
        return true
    } catch {
        return false
    }
}
