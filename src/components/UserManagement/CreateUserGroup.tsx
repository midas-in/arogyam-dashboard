'use client';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createUserGroup } from '@/app/loader';
import { message } from "antd";

export function CreateUserGroup() {
    const { data: session } = useSession();
    const router = useRouter();
    const [name, setName] = useState('');

    const onSubmit = async () => {
        try {
            if (!session?.accessToken) {
                message.error('Missing session');
                return;
            }
            await createUserGroup(session.accessToken, { name });
            setName('');
            router.push('/admin/user-groups');
            message.success('Group created successfully');
        } catch (error) {
            message.error('Error fetching roles');
        }
    }

    return <div className="p-5 bg-white h-min w-full">
        <h2 className="text-xl text-gray-800 font-semibold mb-5">Add Group</h2>
        <div className="p-5 bg-white h-min w-full justify-center flex">
            <div className="">
                <label className="text-gray-800 font-semibold mr-2">Name</label>
                <input
                    className="p-2 text-sm text-gray-800 font-semilight border border-block rounded"
                    value={name} onChange={e => setName(e.target.value)}
                />
                <div className="">
                    <button
                        className="bg-primary-400 disabled:bg-gray-300 text-white font-medium text-sm py-2 px-4 rounded mb-4 mx-5 mt-5"
                        onClick={onSubmit}
                        disabled={!name}
                    >
                        Save
                    </button>
                    <Link href={'/admin/user-groups'} className="border rounded py-2 px-4 text-gray-800 text-sm" >Cancel</Link>
                </div>
            </div>
        </div>
    </div>
}