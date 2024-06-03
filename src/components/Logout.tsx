"use client";
import federatedLogout from "@/utils/federatedLogout";

export default function Logout() {
    return <button onClick={() => federatedLogout()}>
        Logout
    </button>
}
