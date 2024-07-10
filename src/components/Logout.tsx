"use client";
import federatedLogout from "@/utils/federatedLogout";

export default function Logout() {
    return <button className="text-primary-400 w-full" onClick={() => federatedLogout()}>
        Logout
    </button>
}
