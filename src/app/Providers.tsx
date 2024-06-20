'use client'

import {SessionProvider, SessionProviderProps} from "next-auth/react"

export function Providers({children, ...props}: SessionProviderProps) {
    return (
        <SessionProvider {...props} refetchInterval={4 * 60}>
            {children}
        </SessionProvider>
    )
}