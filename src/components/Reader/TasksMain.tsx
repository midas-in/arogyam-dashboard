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
    const [tasks, setTasks] = useState<{ [key: number]: ITask[] }>({});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<{ [key: number]: number }>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (session?.accessToken) {
            setLoading(true);
            const params = {
                resourceType: 'Task',
                query: {
                    owner: `Practitioner/${session?.resourceId}`,
                    status: ['requested', 'completed'][activeTabIndex],
                    _sort: 'authored-on,_lastUpdated',
                    _count: limit,
                    _getpagesoffset: (currentPage - 1) * limit,
                }
            }
            fetchFhirResource(session.accessToken, params)
                .then((data: IBundle) => {
                    setTasks({ ...tasks, [activeTabIndex]: getResourcesFromBundle<ITask>(data) });
                })
                .catch((error: any) => { console.log(error); message.error('Error fetching Tasks') })
                .finally(() => setLoading(false));
            const countParams = {
                resourceType: 'Task',
                query: {
                    owner: `Practitioner/${session?.resourceId}`,
                    status: ['requested', 'completed'][activeTabIndex],
                    _summary: 'count'
                }
            }
            fetchFhirResource(session.accessToken, countParams)
                .then((data: IBundle) => {
                    setTotalItems({ ...totalItems, [activeTabIndex]: (data.total || 0) });
                })
                .catch((error: any) => { console.log(error); message.error('Error fetching Tasks count') })
                .finally(() => setLoading(false));
        }
    }, [session?.accessToken, activeTabIndex, currentPage, limit]);

    const onTabChange = (index: number) => {
        setActiveTabIndex(index);
        setCurrentPage(1); // Reset to the first page when the tab changes
    };

    const onClick = (id?: string, forceIndex?: number) => {
        router.push(`/diagnosis/${id}?status=${['requested', 'completed'][forceIndex ?? activeTabIndex]}`);
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <div className='max-w-[1024px] lg:mx-auto lg:my-[40px] mx-[10px] my-[10px] justify-center'>
            <div className="flex justify-between items-center pb-4 border-b border-gray-3">
                <h2 className='text-[40px] text-gray-900 font-normal leading-[48px]'>Tasks</h2>
                <button
                    className='bg-primary-400 disabled:bg-gray-200 flex justify-center items-center px-4 py-2.5 text-white  text-base font-semibold leading-6 rounded'
                    onClick={() => tasks[activeTabIndex]?.length && onClick(tasks[0][0]?.id, 0)}
                    disabled={!tasks[activeTabIndex]?.length}
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
                    data={tasks[activeTabIndex]}
                    onClick={onClick}
                    currentPage={currentPage}
                    itemsPerPage={limit}
                    totalItems={totalItems[activeTabIndex]}
                    onPageChange={handlePageChange}
                    loading={loading}
                />
            </div>
        </div>
    );
}
