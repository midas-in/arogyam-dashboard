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

    return <div className='mt-5 flex flex-col'>
        <Tabs
            tabs={['Pending', 'Second opinion', 'Completed']}
            activeIndex={activeTabIndex}
            onTabChange={onTabChange}
        />
        <TaskTable onClick={onClick} showLabelledOn={activeTabIndex === 2} />
    </div>
}
export { TaskList };