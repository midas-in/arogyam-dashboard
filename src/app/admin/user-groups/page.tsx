'use client';

import React, { useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table'
import { useSession } from "next-auth/react";
import Link from 'next/link';
import MyTable from '@/components/MyTable';
import { fetchUserGroups } from '@/app/loader';
import { message } from 'antd';

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
  if (session?.permissions?.includes('EDIT_KEYCLOAK_USERS') || session?.permissions?.includes('FHIR_ALL_WRITE')) {
    columns.push(columnHelper.accessor('Action', {
      cell: info => <Link className='text-blue-500' href={`/admin/user-groups/edit/${info.row.original.id}`}>Edit</Link>,
      header: () => <span>Action</span>,
    }))
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserGroups(session.accessToken)
        .then(data => setGroups(data))
        .catch(error => message.error('Error fetching groups'));
    }
  }, [session?.accessToken]);


  return (
    <div className="p-5 bg-white h-min w-full">
      <div className='flex justify-between items-center'>
        <h2 className="text-xl font-semibold">User Groups</h2>
        {(session?.permissions?.includes('EDIT_KEYCLOAK_USERS') || session?.permissions?.includes('FHIR_ALL_WRITE')) &&
          <Link href='/admin/user-groups/new' className="border border-primary-400 px-4 py-1 rounded bg-primary-400 text-white"> + Add group</Link>}
      </div>
      <div className="h-4" />
      <MyTable
        {...{
          data: groups,
          columns,
        }}
      />
    </div>
  )
}