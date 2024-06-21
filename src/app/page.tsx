import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route';

import ReaderTasks from '@/components/Reader/TasksMain';
import RemoteSpecialistTasks from '@/components/Specialist/TasksMain';
import Login from '@/components/Login';
import { READER, REMOTE_SPECIALIST, SENIOR_SPECIALIST } from '@/utils/fhir-utils';


export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)] justify-center flex">
      <div className='text-center mt-5'>
        <Login />
      </div>
    </div >
  }

  if (session?.userType === READER) {
    return <ReaderTasks />
  }

  if (session?.userType === REMOTE_SPECIALIST || session?.userType === SENIOR_SPECIALIST) {
    return <RemoteSpecialistTasks />
  }

  return <div className="p-5 bg-gray-25 w-full min-h-[calc(100vh-65px)] justify-center flex">
    <div className="p-5 bg-white h-min w-full">
      <div className='text-center mt-5'>
        Hi, {session?.user?.name}<br />
        <small>({session?.user?.email})</small>
      </div>
    </div>
  </div>
}
