import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es', 'pt', 'ru', 'zh'],
    defaultLocale: 'en',
    localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
    const response = intlMiddleware(request);
    // Expose the requested path to server components so the root layout can build
    // a correct per-page canonical / hreflang set (see app/[locale]/layout.tsx).
    const existing = response.headers.get('x-middleware-override-headers');
    response.headers.set('x-middleware-override-headers', existing ? `${existing},x-pathname` : 'x-pathname');
    response.headers.set('x-middleware-request-x-pathname', request.nextUrl.pathname);
    return response;
}

export const config = {
    matcher: ['/((?!api/|_next|_vercel|.*\\..*).*)']
};
