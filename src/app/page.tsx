import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route';

import Login from '../components/Login';
import Link from 'next/link';
import { PRACTITIONER } from '@/utils/fhir-utils';


export default async function Home() {
  const session = await getServerSession(authOptions);

  return <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)] justify-center flex">
    <div className="p-5 bg-white h-min w-full">
      {session
        ? <div className='text-center mt-5'>
          Hi, {session?.user?.name}<br />
          <small>({session?.user?.email})</small>
          {session?.userType === PRACTITIONER && <Link href={'/tasks'}><p className='link text-blue-500'>View Tasks</p></Link>}
        </div>
        : <div className='text-center mt-5'>
          <Login />
        </div>}
    </div>
  </div>
}
