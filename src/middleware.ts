export { default } from "next-auth/middleware"

export const config = {
    matcher: ['/diagnosis/:path*', '/admin/:path*'],
}
