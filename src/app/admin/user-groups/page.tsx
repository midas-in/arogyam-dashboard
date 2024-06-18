'use client';

import React, { useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table'
import { useSession } from "next-auth/react";
import Link from 'next/link';
import MyTable from '@/components/MyTable';
import { fetchUserGroups } from '@/app/loader';

const columnHelper = createColumnHelper<any>()

export default function UserGroups() {
  const { data: session } = useSession();
  const [groups, setGroups] = React.useState<{}[]>([]);

  const columns = [
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => <span>Name</span>,
    }),
  ]
  if (session?.permissions?.includes('EDIT_KEYCLOAK_USERS')) {
    columns.push(columnHelper.accessor('Action', {
      cell: info => <Link className='text-blue-500' href={`/admin/user-groups/edit/${info.row.original.id}`}>Edit</Link>,
      header: () => <span>Action</span>,
    }))
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserGroups(session.accessToken)
        .then(data => setGroups(data))
        .catch(error => console.error('Error fetching groups:', error));
    }
  }, [session?.accessToken]);


  return (
    <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)]	justify-center flex">
      <div className="p-5 bg-white h-min w-full">
        <div className='flex justify-between items-center'>
          <h2 className="text-xl font-semibold">User Groups</h2>
          {session?.permissions?.includes('EDIT_KEYCLOAK_USERS') && <Link href='/admin/user-groups/new' className="border px-4 py-1 rounded bg-app_primary text-white"> + Add group</Link>}
        </div>
        <div className="h-4" />
        <MyTable
          {...{
            data: groups,
            columns,
          }}
        />
      </div>
    </div>
  )
}