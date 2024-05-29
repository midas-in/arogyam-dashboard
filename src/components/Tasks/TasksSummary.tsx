import React from 'react';
import Image from 'next/image';

const TaskSummary = () => (
    <div className="flex flex-col items-start gap-4 py-5 px-4 rounded border mt-4 border-gray-100">
        <div className="flex justify-between items-center self-stretch">
            <div className=" text-[#101010]  text-xl font-semibold leading-7">Task summary</div>
            <div className="flex items-center py-1 px-2 rounded border border-gray-100">
                <select className='text-base text-black'>
                    <option>Today</option>
                </select>
            </div>
        </div>
        <div className="flex justify-between items-center gap-5 self-stretch">
            <div className="flex flex-1 justify-between items-center py-5 px-6 h-[6.125rem] rounded border border-[#dde2ee] bg-white">
                <div className=" flex flex-1 justify-between items-center self-stretch">
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="text-gray-600  leading-6">Total images</div>
                        <div className="flex flex-col items-start gap-2.5  text-[#1c1d21]  text-xl font-semibold leading-7">
                            270
                        </div>
                    </div>
                    <div className="flex p-2 opacity-[0.8] rounded bg-[#e3eeff]">
                        <Image
                            height={24}
                            width={24}
                            className={`h-6 w-6 object-cover`}
                            src={'/images/total-images.png'}
                            alt={"Image"}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-1 justify-between items-center py-5 px-6 h-[6.125rem] rounded border border-[#dde2ee] bg-white">
                <div className="flex flex-1 justify-between items-center">
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="text-gray-600  leading-6">Pending for diagnosis</div>
                        <div className="flex flex-col items-start gap-2.5  text-[#1c1d21]  text-xl font-semibold leading-7">
                            113
                        </div>
                    </div>
                    <div className="flex p-2 opacity-[0.8] rounded bg-[#e3eeff]">
                        <Image
                            height={24}
                            width={24}
                            className={`h-6 w-6 object-cover`}
                            src={'/images/pending-diagnosis.png'}
                            alt={"Image"}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-1 justify-between items-center py-5 px-6 h-[6.125rem] rounded border border-[#dde2ee] bg-white">
                <div className="flex flex-1 justify-between items-center">
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="text-gray-600  leading-6">Completed  diagnosis</div>
                        <div className="flex flex-col items-start gap-2.5  text-[#1c1d21]  text-xl font-semibold leading-7">
                            157
                        </div>
                    </div>
                    <div className="flex p-2 opacity-[0.8] rounded bg-[#e3eeff]">
                        <Image
                            height={24}
                            width={20}
                            className={`h-6 w-5 object-cover`}
                            src={'/images/completed-diagnosis.png'}
                            alt={"Image"}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export { TaskSummary }
