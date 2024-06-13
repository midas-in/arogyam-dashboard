'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { message } from 'antd';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';

import { Tabs } from '@/components/UI/Tabs';
import { TaskTable } from '@/components/Specialist/TaskTable';
import { TaskSummary } from '@/components/Specialist/TasksSummary';
import { fetchFhirResource } from '@/app/loader';
import { getResourcesFromBundle } from '@/utils/fhir-utils';

export default function RemoteSpecialistTasks() {
    const router = useRouter();
    const { data: session } = useSession();
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [tasks, setTasks] = useState<ITask[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect(() => {
        if (session?.accessToken) {
            const params = {
                resourceType: 'Task',
                query: {
                    owner: `Practitioner/${session?.resourceId}`,
                    status: ['requested', 'completed'][activeTabIndex],
                    _count: limit,
                    _getpagesoffset: (currentPage - 1) * limit,
                }
            }
            fetchFhirResource(session.accessToken, params)
                .then((data: IBundle) => {
                    setTasks(getResourcesFromBundle<ITask>(data));
                    setTotalItems(data.total || 0);
                })
                .catch((error: any) => { console.log(error); message.error('Error fetching Tasks', error) });
        }
    }, [session?.accessToken, activeTabIndex, currentPage, limit])

    const onTabChange = (index: number) => {
        setActiveTabIndex(index)
    }

    const onClick = (id?: string) => {
        router.push(`/diagnosis/${id}?status=${['requested', 'completed'][activeTabIndex]}`);
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return <div className='lg:mx-[150px] lg:my-[50px] mx-[10px] my-[10px] justify-center'>
        <div className="flex justify-between items-center pb-3 border-b border-gray-3">
            <h2 className='text-[40px] text-gray-900 font-normal leading-[48px]'>Tasks</h2>
            <button
                className='bg-app_primary disabled:bg-gray-200 flex justify-center items-center px-4 py-2.5 text-white  text-base font-bold leading-6 rounded'
                onClick={() => tasks?.length && onClick(tasks[0]?.id)}
                disabled={!tasks?.length}
            >
                Start diagnosis
            </button>
        </div>
        <TaskSummary />
        <div className='mt-5 flex flex-col'>
            <Tabs
                tabs={['New', 'Completed']} // TODO 'Second opinion'
                activeIndex={activeTabIndex}
                onTabChange={onTabChange}
            />
            <TaskTable
                data={tasks}
                onClick={onClick}
                showLabelledOn={activeTabIndex === 2}
                currentPage={currentPage}
                itemsPerPage={limit}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />
        </div>
    </div >
}
