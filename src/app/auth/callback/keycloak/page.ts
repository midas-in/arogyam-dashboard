'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function KeyCloakAuthCallback() {
    const router = useRouter();
    useEffect(() => {
        router.push('/');
    }, [])
    return
}
