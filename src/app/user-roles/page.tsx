'use client';

import React, { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table'
import { useSession } from "next-auth/react";
import MyTable from '@/components/MyTable';
import { fetchUserRoles } from '@/app/loader';

const columnHelper = createColumnHelper<any>()
const columns = [
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: () => <span>Name</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.composite, {
    id: 'composite',
    cell: info => info.getValue()?.toString(),
    header: () => <span>Composite</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.description, {
    id: 'description',
    cell: info => info.getValue(),
    header: () => <span>Description</span>,
    footer: info => info.column.id,
  }),
]

export default function UserRoles() {
  const { data: session } = useSession();
  const [roles, setRoles] = useState<{}[]>([]);

  useEffect(() => {
    if (session?.accessToken) {
      fetchUserRoles(session.accessToken)
        .then(data => setRoles(data))
        .catch(error => console.error('Error fetching roles:', error));
    }
  }, [session?.accessToken]);

  return (
    <div className="p-5 bg-gray-100 w-full min-h-[calc(100vh-77px)]	justify-center flex">
      <div className="p-5 bg-white h-min w-full">
        <div className='flex justify-end'>
        </div>
        <div className="h-4" />
        <MyTable
          {...{
            data: roles,
            columns,
          }}
        />
      </div>
    </div>
  )
}
