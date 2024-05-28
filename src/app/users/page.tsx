'use client';

import React, { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table'
import { useSession, } from "next-auth/react";
import Link from 'next/link';
import type { PopconfirmProps } from 'antd';
import { Button, message, Popconfirm } from 'antd';


import MyTable from '@/components/MyTable';
import { fetchUsers, deleteUser } from '@/app/loader';

const confirm = async (id: string, accessToken: string, onSuccess: Function) => {
  try {
    await deleteUser(accessToken, id);
    onSuccess();
    message.success('User deleted successfully');
  }
  catch (e) {
    message.error('Error deleting User');
  }
};

const Delete = ({ id, onSuccess }: { id: string, onSuccess: Function }) => {
  const { data: session } = useSession();
  return <Popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    onConfirm={() => confirm(id, session?.accessToken as string, onSuccess)}
    okText="Yes"
    cancelText="No"
  >
    <a className='text-red-500 ml-5 cursor-pointer'>Delete</a>
  </Popconfirm>
}

const columnHelper = createColumnHelper<any>()


export default function Users() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<{}[]>([])

  const columns = [
    columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      header: () => <span>First name</span>,
    }),
    columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => info.getValue(),
      header: () => <span>Last name</span>,
    }),
    columnHelper.accessor('username', {
      header: () => 'Username',
      cell: info => info.renderValue(),
    }),
    columnHelper.accessor('email', {
      header: () => <span>email</span>,
    }),
    columnHelper.accessor('Action', {
      cell: info => <><Link className='text-blue-500' href={`/users/edit/${info.row.original.id}`}>Edit</Link><Delete id={info.row.original.id} onSuccess={fetchAllUsers} /></>,
      header: () => <span>Action</span>,
    }),
  ]

  const fetchAllUsers = () => {
    if (session?.accessToken) {
      fetchUsers(session.accessToken)
        .then(data => setUsers(data))
        .catch(error => message.error('Error fetching users:', error));
    }
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchAllUsers()
    }
  }, [session?.accessToken]);


  return (
    <div className="p-5 bg-gray-100 w-full min-h-[calc(100vh-77px)]	justify-center flex">
      <div className="p-5 bg-white h-min w-full">
        <div className='flex justify-end'>
          <Link href='/users/new' className="border px-4 py-1 rounded bg-primary-100 text-white"> + Add user</Link>
        </div>
        <div className="h-4" />
        <MyTable
          {...{
            data: users,
            columns,
          }}
        />
      </div>
    </div>
  )
}
