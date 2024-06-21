import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPERVISOR, READER, REMOTE_SPECIALIST, SENIOR_SPECIALIST } from './utils/fhir-utils';

export async function middleware(req: NextRequest) {
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production',
    });

    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
        if (!session || session.userType !== SUPERVISOR) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    if (pathname.startsWith('/diagnosis')) {
        if (!session || ![READER, REMOTE_SPECIALIST, SENIOR_SPECIALIST].includes(session.userType as string)) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/diagnosis/:path*', '/admin/:path*'],
}
