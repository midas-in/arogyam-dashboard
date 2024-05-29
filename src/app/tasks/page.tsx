'use client';

import { useRouter } from 'next/navigation';

import { TaskList } from '@/components/Tasks/TaskList';
import { TaskSummary } from '@/components/Tasks/TasksSummary';

export default function Tasks() {
    const router = useRouter();

    const onClick = () => {
        router.push('/tasks/diagnosis');
    }

    return <div className='lg:mx-[150px] lg:my-[50px] mx-[10px] my-[10px] justify-center'>
        <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <h2 className='text-[40px] text-gray-900 font-normal leading-[48px]'>Tasks</h2>
            <button onClick={onClick} className='bg-app_primary flex justify-center items-center px-4 py-2.5 text-white  text-base font-bold leading-6 rounded'>
                Start diagnosis
            </button>
        </div>
        <TaskSummary />
        <TaskList />
    </div >
}
