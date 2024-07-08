import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { message } from 'antd';

import { fetchFhirResource } from '@/app/loader';
interface Counts {
    images: number
    requested: number
    completed: number
}

const TaskSummary = () => {
    const { data: session } = useSession();
    const [counts, setCounts] = useState<Counts>();

    useEffect(() => {
        if (session?.accessToken) {
            const status = ['requested', 'completed'];

            Promise.all([
                ...status.map(st => fetchFhirResource(session?.accessToken as string, {
                    resourceType: 'Task',
                    query: {
                        owner: `Practitioner/${session?.resourceId}`,
                        status: st,
                        _summary: 'count'
                    }
                })),
                fetchFhirResource(session?.accessToken as string, {
                    resourceType: 'Task',
                    query: {
                        owner: `Practitioner/${session?.resourceId}`,
                        _summary: 'count'
                    }
                })
            ])
                .then((data) => {
                    const counts: any = {}
                    status.forEach((st, i) => {
                        counts[st] = data[i].total;
                    });
                    counts.images = data[status.length].total;
                    setCounts(counts);
                })
                .catch((error: any) => {
                    console.log(error);
                    message.error('Error fetching tasks summary');
                });
        }
    }, [session?.accessToken])


    return <div className="flex flex-col items-start gap-4 py-5 px-4 rounded border mt-4 border-gray-3">
        <div className="flex justify-between items-center self-stretch">
            <div className=" text-[#101010]  text-xl font-semibold leading-7">Task summary</div>
            <div className="flex items-center py-1 px-2 rounded border border-gray-3">
                <select className='text-base text-black'>
                    <option>All time</option>
                </select>
            </div>
        </div>
        <div className="flex justify-between items-center gap-5 self-stretch">
            <div className="flex flex-1 justify-between items-center py-5 px-6 h-[6.125rem] rounded border border-[#dde2ee] bg-white">
                <div className=" flex flex-1 justify-between items-center self-stretch">
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="text-base text-gray-600">Total images</div>
                        <div className="flex flex-col items-start gap-2.5  text-gray-900  text-xl font-semibold leading-7">
                            {counts?.images}
                        </div>
                    </div>
                    <div className="flex p-2 opacity-[0.8] rounded bg-[#e3eeff]">
                        <Image
                            height={24}
                            width={24}
                            className={`h-6 w-6 object-cover`}
                            src={'/images/tasks/total-images.svg'}
                            alt={"Image"}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-1 justify-between items-center py-5 px-6 h-[6.125rem] rounded border border-[#dde2ee] bg-white">
                <div className="flex flex-1 justify-between items-center">
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="text-base text-gray-600">Pending for diagnosis</div>
                        <div className="flex flex-col items-start gap-2.5  text-gray-900  text-xl font-semibold leading-7">
                            {counts?.requested}
                        </div>
                    </div>
                    <div className="flex p-2 opacity-[0.8] rounded bg-[#e3eeff]">
                        <Image
                            height={24}
                            width={24}
                            className={`h-6 w-6 object-cover`}
                            src={'/images/tasks/pending-diagnosis.svg'}
                            alt={"Image"}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-1 justify-between items-center py-5 px-6 h-[6.125rem] rounded border border-[#dde2ee] bg-white">
                <div className="flex flex-1 justify-between items-center">
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="text-base text-gray-600">Completed diagnosis</div>
                        <div className="flex flex-col items-start gap-2.5  text-gray-900  text-xl font-semibold leading-7">
                            {counts?.completed}
                        </div>
                    </div>
                    <div className="flex p-2 opacity-[0.8] rounded bg-[#e3eeff]">
                        <Image
                            height={24}
                            width={20}
                            className={`h-6 w-5 object-cover`}
                            src={'/images/tasks/completed-diagnosis.svg'}
                            alt={"Image"}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export { TaskSummary }
