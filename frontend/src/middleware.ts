import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    let token = request.cookies.get('token')?.value;

    const pathname = request.nextUrl.pathname;
    const isLoginPage = pathname === '/login';
    const isDashboardPage = pathname === '/dashboard';
    const isHomePage = pathname === '/';

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isHomePage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        if (token) {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            const data = await res.json();
            const role = data.roles.at(0)?.name;

            if (isLoginPage || isDashboardPage) {
                switch (role) {
                    case 'employee':
                        return NextResponse.redirect(new URL('/employee', request.url));
                    case 'manager':
                        return NextResponse.redirect(new URL('/manager', request.url));
                    case 'admin':
                        return NextResponse.redirect(new URL('/admin', request.url));
                    default:
                        return NextResponse.redirect(new URL('/login', request.url));
                }
            }

            if (
                (pathname.startsWith('/admin') && role !== 'admin') ||
                (pathname.startsWith('/manager') && role !== 'manager') ||
                (pathname.startsWith('/employee') && role !== 'employee')
            ) {
                return new NextResponse('Forbidden', { status: 403 });
            }
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/employee/:path*', '/manager/:path*', '/admin/:path*', '/login', '/dashboard', '/'],
};
