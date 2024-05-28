import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route';

import Login from '../components/Login';
import Logout from '../components/Logout';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return <div className="p-5 bg-gray-100 w-full min-h-[calc(100vh-77px)]	justify-center flex">
    <div className="p-5 bg-white h-min w-full">
      {session ?
        <div className='text-center mt-5'>
          Hi, {session?.user?.name}<br />
          <small>({session?.user?.email})</small>
          <Logout />
        </div> :
        <div className='text-center mt-5'>
          <Login />
        </div>}
    </div>
  </div>
}