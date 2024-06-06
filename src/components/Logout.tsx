"use client";
import federatedLogout from "@/utils/federatedLogout";

export default function Logout() {
    return <button className="px-8 py-1" onClick={() => federatedLogout()}>
        Logout
    </button>
}
