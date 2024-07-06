import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/authOptions';

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
      <div className='flex flex-col items-center text-center mt-5 mt-10'>
        <p className='text-gray-900'>Hi, {session?.user?.name}</p>
        <div className='mt-5'>
          <div className='flex items-center'>
            <label className='w-[100px] text-gray-900'>Email:</label>
            <p className='text-gray-900'>{session?.user?.email}</p>
          </div>
          <div className='flex items-center'>
            <label className='w-[100px] text-gray-900'>Role:</label>
            <p className='text-gray-900 capitalize'>{session?.userType}</p>
          </div>
        </div>

        <p className='mt-10 text-gray-900'>You do not have enough permission to perform any action</p>
        <p className='mt-2 text-sm mb-10 text-gray-900'>Please reach out to support team if you have any questions</p>
      </div>
    </div>
  </div>
}
