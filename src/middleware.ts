import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {AUTH_ROUTES, BASE_URL, PUBLIC_ROUTES} from "@/constants/routes";
import {cookies} from "next/headers";

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    const cookieStore = await cookies();
    const cookie = cookieStore.get('userSession');
    if (!cookie && !isPublic ) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.LOGIN, request.nextUrl));
    }
    if(cookie && pathname === AUTH_ROUTES.LOGIN) {
        return NextResponse.redirect(new URL(BASE_URL, request.nextUrl));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * 다음으로 시작하는 경로를 제외한 모든 요청 경로를 매칭합니다:
         * - api (API 라우트)
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화 파일)
         * - favicon.ico (파비콘 파일)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}