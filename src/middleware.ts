import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_ROUTES, BASE_URL, PUBLIC_ROUTES } from '@/constants/routes';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const token = request.cookies.get('userSession')?.value;
    console.log(token)
    if (!token && !isPublic) {
        return NextResponse.redirect(
            new URL(AUTH_ROUTES.LOGIN, request.url),
        );
    }
    if (token && pathname === AUTH_ROUTES.LOGIN) {
        return NextResponse.redirect(
            new URL(BASE_URL, request.url),
        );
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
