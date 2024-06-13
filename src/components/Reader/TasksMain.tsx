'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { message } from 'antd';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';

import { TaskTable } from '@/components/Reader/TaskTable';
import { Tabs } from '@/components/UI/Tabs';
import { TaskSummary } from '@/components/Reader/TasksSummary';
import { fetchFhirResource } from '@/app/loader';
import { getResourcesFromBundle } from '@/utils/fhir-utils';

export default function ReaderTasks() {
    const router = useRouter();
    const { data: session } = useSession();
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);

    useEffect(() => {
        if (session?.accessToken) {
            const params = {
                resourceType: 'Task',
                query: {
                    owner: `Practitioner/${session?.resourceId}`, //TODO
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
    }, [session?.accessToken, activeTabIndex, currentPage, limit]);

    const onTabChange = (index: number) => {
        setActiveTabIndex(index);
        setCurrentPage(1); // Reset to the first page when the tab changes
    };

    const onClick = (id?: string) => {
        router.push(`/diagnosis/${id}`);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className='lg:mx-[150px] lg:my-[50px] mx-[10px] my-[10px] justify-center'>
            <div className="flex justify-between items-center pb-4 border-b border-gray-3">
                <h2 className='text-[40px] text-gray-900 font-normal leading-[48px]'>Tasks</h2>
                <button
                    className='bg-app_primary flex justify-center items-center px-4 py-2.5 text-white  text-base font-bold leading-6 rounded'
                    onClick={() => tasks?.length && onClick(tasks[0]?.id)}
                    disabled={!tasks?.length}
                >
                    Start diagnosis
                </button>
            </div>
            <TaskSummary />
            <div className='mt-4 flex flex-col'>
                <Tabs
                    tabs={['Pending', 'Completed']}
                    activeIndex={activeTabIndex}
                    onTabChange={onTabChange}
                />
                <TaskTable
                    data={tasks}
                    onClick={onClick}
                    currentPage={currentPage}
                    itemsPerPage={limit}
                    totalItems={totalItems}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
