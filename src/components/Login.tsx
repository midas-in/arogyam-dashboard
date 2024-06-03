"use client"

import { signIn } from "next-auth/react";

export default function Login() {
    return <button onClick={() => signIn("keycloak")}>
        Login with keycloak
    </button>
}
