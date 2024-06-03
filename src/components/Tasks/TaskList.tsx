'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import TaskTable from './TaskTable';

const TaskList = () => {
    const router = useRouter();

    const onClick = () => {
        router.push('/tasks/diagnosis');
    }

    return <div className='mt-4 flex gap-6 flex-col'>
        <div className="flex border-gray-300">
            <div className="border-b-2 border-blue-500 font-medium text-sm py-2 px-4 cursor-pointer">Pending</div>
            <div className="border-b-2 py-2 px-4 font-light text-sm text-gray-400 cursor-pointer">Completed</div>
        </div>
        {/* <div className="flex gap-4">
            <div className="flex flex-1 items-center rounded border border-gray-100">
                <span className='material-symbols-outlined text-neutral-600 px-4 placeholder:text-[#A8A8A8]'>search</span>
                <input
                    className="outline-none h-12 flex-grow"
                    type="text"
                    placeholder="Search image ID"
                />
            </div>
            <div className="flex items-center rounded border border-gray-100 min-w-[247px] px-4">
                <span className='text-[#161616]'>Sort:</span>
                <select className='flex flex-1 text-[#161616]'>
                    <option>Recent</option>
                </select>
            </div>
        </div> */}

        <TaskTable onClick={onClick} />
    </div>
}
export { TaskList };