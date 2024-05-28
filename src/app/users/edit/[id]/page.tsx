'use client';

import { useParams } from 'next/navigation';
import { CreateEditUser } from '@/components/UserManagement/CreateEditUser';

export default function EditUser() {
    const { id } = useParams();

    return <CreateEditUser id={id as string} />
}
