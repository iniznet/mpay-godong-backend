// middleware.ts
import { NextResponse } from 'next/server';
export function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const isPublicPath = request.nextUrl.pathname.startsWith('/auth');
    console.log('Token:', token);
    console.log('Is public path:', isPublicPath);
    console.log('Request URL:', request.url);
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|demo|layout|themes|favicon.ico).*)'],
};
