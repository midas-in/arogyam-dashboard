"use client"

import { signIn } from "next-auth/react";

export default function Login() {
    return <button className="px-4 py-2 rounded justify-start items-center inline-flex bg-primary-400 text-white border-0" onClick={() => signIn("keycloak")}>
        Login with keycloak
    </button>
}
