'use client';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createUserGroup } from '@/app/loader';

export function CreateUserGroup() {
    const { data: session } = useSession();
    const router = useRouter();
    const [name, setName] = useState('');

    const onSubmit = async () => {
        try {
            if (!session?.accessToken) {
                console.log('Missing session');
                return;
            }
            await createUserGroup(session.accessToken, { name });
            setName('');
            router.push('/user-groups');
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    }

    return <div className="p-5 bg-gray-200 w-full min-h-[calc(100vh-65px)] flex-col">
        <h2 className="text-xl font-semibold mb-5">Add Group</h2>
        <div className="p-5 bg-white h-min w-full justify-center flex">
            <div className="">
                <label className="font-bold mr-2">Name</label>
                <input
                    className="p-2 text-sm font-semilight border border-block rounded"
                    value={name} onChange={e => setName(e.target.value)}
                />
                <div className="">
                    <button
                        className="bg-app_primary disabled:bg-gray-300 text-white font-medium text-sm py-2 px-4 rounded mb-4 mx-5 mt-5"
                        onClick={onSubmit}
                        disabled={!name}
                    >
                        Save
                    </button>
                    <Link href={'/user-groups'} className="border rounded py-2 px-4" >Cancel</Link>
                </div>
            </div>
        </div>
    </div>
}