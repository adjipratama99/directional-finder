import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default async function middleware(req, event) {
    const token = await getToken({ req })
    const isAuthenticated = !!token

    // Redirect authenticated users away from login/code/scan pages
    if (
        (req.nextUrl.pathname.startsWith('/login') && isAuthenticated) ||
        (req.nextUrl.pathname.startsWith('/code') && isAuthenticated) ||
        (req.nextUrl.pathname.startsWith('/scan') && isAuthenticated)
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    const protectedPaths = ['/users', '/report']
    const isProtected = protectedPaths.some(path =>
        req.nextUrl.pathname.startsWith(path)
    )

    // Role-based redirect: Only admins can access /users
    if (isProtected) {
        if (!token || token.role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }

    const authMiddleware = withAuth({
        pages: {
            signIn: '/',
            error: '/',
        }
    })

    return authMiddleware(req, event)
}

export const config = {
    matcher: [
        '/((?!api|code|scan|logout|blocked|_next/static|_next/image|favicon.ico|assets).*)',
    ],
}
