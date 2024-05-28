"use client";
import federatedLogout from "@/utils/federatedLogout";

export default function Logout() {
    return <>
        <br />
        <br />
        <button onClick={() => federatedLogout()}>
            Signout
        </button>
    </>
}