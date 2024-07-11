import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    SUPERVISOR_USER_TYPE_CODE, SITE_COORDINATOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE,
    READER_USER_TYPE_CODE, REMOTE_SPECIALIST_USER_TYPE_CODE, SENIOR_SPECIALIST_USER_TYPE_CODE
} from './utils/fhir-utils';

export async function middleware(req: NextRequest) {
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === 'production',
    });

    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/admin')) {
        if (!session || ![SUPERVISOR_USER_TYPE_CODE, SITE_COORDINATOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE].includes(session.userType as string)) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    if (pathname.startsWith('/admin/user')) {
        if (!session || ![SITE_COORDINATOR_USER_TYPE_CODE].includes(session.userType as string)) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    if (pathname.startsWith('/diagnosis')) {
        if (!session || ![READER_USER_TYPE_CODE, REMOTE_SPECIALIST_USER_TYPE_CODE, SENIOR_SPECIALIST_USER_TYPE_CODE].includes(session.userType as string)) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/diagnosis/:path*', '/admin/:path*'],
}
