// middleware.ts（项目根目录）
import { jwtVerify } from 'jose'

export const config = {
    matcher: ['/((?!_vitepress|api|.*\\.(?:js|css|png|svg|ico|json)).*)'],
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret')
const VIP_ROUTES_URL = '/vip-routes.json'
let vipRoutesCache: string[] | null = null

async function getVipRoutes(origin: string): Promise<string[]> {
    if (vipRoutesCache) return vipRoutesCache
    try {
        const res = await fetch(`${origin}${VIP_ROUTES_URL}`)
        vipRoutesCache = await res.json()
        return vipRoutesCache!
    } catch {
        return []
    }
}

async function isValidToken(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, JWT_SECRET)
        return true
    } catch {
        return false
    }
}

function parseCookie(cookieHeader: string, name: string): string | null {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
}

export default async function middleware(request: Request) {
    const url = new URL(request.url)
    const { pathname, origin } = url

    const vipRoutes = await getVipRoutes(origin)
    const isVipPage = vipRoutes.some(
        (route) => pathname === route || pathname === route.replace('.html', '')
    )

    if (!isVipPage) {
        return new Response(null, { status: 200 })
    }

    const token = parseCookie(request.headers.get('cookie') || '', 'vip_token')

    if (!token || !(await isValidToken(token))) {
        const loginUrl = new URL('/login', origin)
        loginUrl.searchParams.set('redirect', pathname)
        return Response.redirect(loginUrl.toString(), 302)
    }

    return new Response(null, { status: 200 })
}