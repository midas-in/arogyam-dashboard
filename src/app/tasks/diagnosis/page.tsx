'use client';

import Link from "next/link";
import DiagnosisImage from "@/components/Tasks/DiagnosisImage";
import { Loader } from "@/components/UI/Loader";
import { useEffect, useState } from "react";

const diagnosis = [
    'Normal / Normal Variations',
    'Benign/Others',
    'Tobacco pouch keratosis',
    'Homogeneous leukoplakia',
    'OSMF',
    'Oral lichen planus',
    'Nonhomogeneous leukoplakia',
    'Malignancy',
    'Non-Diagnostic'
];

export default function Diagnosis() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 3000)
    })

    return <div className="flex flex-col gap-3 m-[25px]">
        <div className="flex p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <Link href={'/tasks'}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" fill="#212121" />
                    </svg>
                </Link>
                <div className="text-gray-900 text-2xl leading-8">Provisional diagnosis</div>
            </div>
        </div>
        <div className="flex min-h-[500px]">
            <div className="relative flex flex-1 bg-black">
                <DiagnosisImage />
                {loading && <Loader />}

                {/* drawer */}
                <div className="absolute right-0 h-full flex items-center">
                    <div className="relative w-[34px] h-[100px] bg-white rounded-tl-2xl rounded-bl-2xl shadow border-l border-t border-b border-gray-100 cursor-pointer">
                        <div className="w-7 h-7 left-[3px] top-[39px] absolute" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <path d="M15.367 14.0008L9.59229 8.22608L11.2422 6.57617L18.6668 14.0008L11.2422 21.4254L9.59229 19.7755L15.367 14.0008Z" fill="black" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* pagination */}
                <div className="absolute inset-x-0 bottom-[30px] flex justify-center z-20">
                    <div className=" w-[119px] h-8 p-1 bg-gray-25 rounded-lg border border-blue-600 justify-center items-center gap-2 inline-flex">
                        <div className="w-5 h-5 relative origin-top-left cursor-pointer" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M9.02362 9.99942L13.1484 14.1242L11.9699 15.3027L6.66662 9.99942L11.9699 4.69617L13.1484 5.87467L9.02362 9.99942Z" fill="#0F62FE" />
                            </svg>
                        </div>
                        <div className="text-blue-600 text-base font-semibold leading-normal">58/129</div>
                        <div className="w-5 h-5 relative cursor-pointer" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M10.9764 10.0006L6.85156 5.87577L8.03008 4.69727L13.3334 10.0006L8.03008 15.3038L6.85156 14.1253L10.9764 10.0006Z" fill="#0F62FE" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* right sidebar */}
            <div className="flex flex-col gap-4 border border-gray-100">
                <div className="px-6 py-3 bg-primary-10 shadow border-b border-gray-100 ">
                    <p className="text-app_primary text-base font-semibold leading-normal">Labelling for Image ID </p>
                    <p className="text-gray-600 text-sm font-normal leading-tight mt-1">bc787a9b-e715-4aa6-aca6-f3cc94373dd0</p>
                </div>

                <div className="mx-6 flex-col justify-start items-start flex">
                    <h6 className="text-gray-900 text-base font-medium leading-normal">Provisional Diagnosis</h6>
                    <div className="h-[342px] flex-col justify-start items-start flex mt-1">
                        {diagnosis.map(name => {
                            return <div key={name} className="py-1.5 bg-white justify-center items-start  flex">
                                <input type="radio" className='w-5 h-5' id={name} name="diagnosis" value={name} />
                                <label htmlFor={name} className="text-gray-900 text-base font-normal leading-normal ml-2 cursor-pointer">{name}</label>
                            </div>
                        })}
                    </div>
                </div>

                <div className="h-28 p-3 mx-6 bg-gray-25 rounded flex-col justify-start items-start gap-2 flex">
                    <h6 className="text-gray-900 text-base font-semibold leading-normal">Results of diagnosis</h6>
                    <div className="h-14 flex-col justify-start items-start gap-2 flex">
                        <div className="justify-start items-start gap-1 inline-flex">
                            <p className="w-20 text-gray-900 text-base font-normal leading-normal">Risk</p>
                            <p className="text-gray-900 text-base font-normal leading-normal">:</p>
                            <p className="grow shrink basis-0 text-gray-900 text-base font-normal leading-normal">-</p>
                        </div>
                        <div className="justify-start items-start gap-1 inline-flex">
                            <p className="w-20 text-gray-900 text-base font-normal leading-normal">Suspicion</p>
                            <p className="text-gray-900 text-base font-normal leading-normal">:</p>
                            <p className="grow shrink basis-0 text-gray-900 text-base font-normal leading-normal">Low risk</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-1">
                    <button className="h-12 bg-app_primary disabled:bg-gray-200 rounded justify-center items-center flex flex-1 text-white text-base font-semibold leading-normal">
                        Submit
                        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z" fill="white" />
                        </svg>
                    </button>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="#24A148" />
                    </svg>
                    <p className="text-success text-base font-semibold p-3">Image Label Submitted</p> */}
                </div>

            </div>
        </div>
    </div >
}
