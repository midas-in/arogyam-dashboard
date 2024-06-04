'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import TaskTable from './TaskTable';
import { Tabs } from '@/components/UI/Tabs';

const TaskList = () => {
    const router = useRouter();
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    const onTabChange = (index: number) => {
        setActiveTabIndex(index)
    }

    const onClick = () => {
        router.push('/tasks/diagnosis');
    }

    return <div className='mt-4 flex flex-col'>
        <Tabs
            tabs={['Pending', 'Completed']}
            activeIndex={activeTabIndex}
            onTabChange={onTabChange}
        />
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