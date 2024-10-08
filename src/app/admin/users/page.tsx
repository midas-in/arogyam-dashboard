'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table'
import { useSession, } from "next-auth/react";
import Link from 'next/link';
import { Button, message, Popconfirm, Divider, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import MyTable from '@/components/MyTable';
import { fetchUsers, deleteUser } from '@/app/loader';

// const confirm = async (id: string, accessToken: string, onSuccess: Function) => {
//   try {
//     await deleteUser(accessToken, id);
//     onSuccess();
//     message.success('User deleted successfully');
//   }
//   catch (e) {
//     message.error('Error deleting User');
//   }
// };

// const Delete = ({ id, onSuccess }: { id: string, onSuccess: Function }) => {
//   const { data: session } = useSession();
//   return <Popconfirm
//     title="Delete the user"
//     description="Are you sure to delete this user?"
//     onConfirm={() => confirm(id, session?.accessToken as string, onSuccess)}
//     okText="Yes"
//     cancelText="No"
//   >
//     <a className='text-red-500 ml-5 cursor-pointer'>Delete</a>
//   </Popconfirm>
// }

const columnHelper = createColumnHelper<any>()


const TableAction = ({ info, fetchAllUsers }: { info: any, fetchAllUsers: Function }) => {
  const router = useRouter();
  return <div className='flex items-center'>
    <Link className='text-blue-500' href={`/admin/users/edit/${info.row.original.id}`}>Edit</Link>
    <Divider type="vertical" />
    <Link className='text-blue-500' href={`/admin/users/credentials/${info.row.original.id}/${info.row.original.username}`}>Credential</Link>
    {/* <Dropdown
      menu={{
        items: [
          {
            key: '1',
            label: <Button
              type="link"
              data-testid="credentials"
              onClick={() => router.push(`/admin/users/credentials/${info.row.original.id}/${info.row.original.username}`)}
            >
              {'Credentials'}
            </Button>
            // }, {
            //   key: '2',
            //   label: <Delete id={info.row.original.id} onSuccess={fetchAllUsers} />
          }]
      }}
      placement="bottomRight"
      arrow
      trigger={['click']}
    >
      <MoreOutlined
        data-testid="action-dropdown"
        className="text-blue-500 text-base"
      />
    </Dropdown> */}
  </div>
}


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
    columnHelper.accessor(row => row.enabled, {
      id: 'status',
      cell: info => info.getValue() ? 'Active' : 'Inactive',
      header: () => <span>Status</span>,
    }),
  ]
  if (session?.permissions?.includes('EDIT_KEYCLOAK_USERS') || session?.permissions?.includes('FHIR_ALL_WRITE')) {
    columns.push(columnHelper.accessor('Action', {
      cell: info => <TableAction info={info} fetchAllUsers={fetchAllUsers} />,
      header: () => <span>Action</span>,
    }))
  }

  const fetchAllUsers = () => {
    if (session?.accessToken) {
      fetchUsers(session.accessToken)
        .then(data => setUsers(data))
        .catch(error => message.error('Error fetching users'));
    }
  }

  useEffect(() => {
    if (session?.accessToken) {
      fetchAllUsers()
    }
  }, [session?.accessToken]);


  return (
    <div className="p-5 bg-white h-min w-full">
      <div className='flex justify-between items-center'>
        <h2 className="text-xl text-gray-800 font-semibold">Users</h2>
        {(session?.permissions?.includes('EDIT_KEYCLOAK_USERS') || session?.permissions?.includes('FHIR_ALL_WRITE')) && <div className='flex justify-end'>
          <Link href='/admin/users/new' className="border border-primary-400 px-4 py-1 rounded bg-primary-400 text-white"> + Add user</Link>
        </div>}
      </div>
      <div className="h-4" />
      <MyTable
        {...{
          data: users,
          columns,
        }}
      />
    </div>
  )
}
