import { DefaultSession, TokenSet } from 'next-auth'

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
        refreshToken?: string
        accessToken?: string
        userType?: string
        permissions?: string[]
    }
}
