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

export function DiagnosisRightBar({ onSubmit }: { onSubmit: Function }) {

    const [loading, setLoading] = useState(true);
    const [showRightSidebar, setShowRightSidebar] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 3000)
    })

    return <div className="absolute top-0 right-0 flex flex-col gap-4 border border-gray-100 m-[10px] bg-white">
        <div className="min-w-[300px] flex justify-between px-6 py-3 bg-primary-10 shadow border-b border-gray-100">
            <div className="flex">
                <p className="text-gray-900 text-base font-semibold leading-normal ">
                    Diagnosis -
                </p>
                <p className="w-20 truncate text-gray-900 text-base font-semibold leading-normal ml-1">
                    bc787a9b-e715-4aa6-aca6-f3cc94373dd0
                </p>
            </div>
            <button className={`h-8 px-2 py-1 rounded border border-gray-100 justify-start items-center gap-1 inline-flex ${!showRightSidebar ? 'bg-app_primary border-0' : ''}`} onClick={() => setShowRightSidebar(prev => !prev)} >
                {/* <div className={`text-base font-normal ${!showRightSidebar ? 'text-white' : ''}`}>Close</div> */}
                <div className={`w-5 h-5 relative transition-all ${!showRightSidebar ? 'rotate-180' : ''}`} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 9.02399L5.87529 13.1488L4.69678 11.9703L10 6.66699L15.3034 11.9703L14.1249 13.1488L10 9.02399Z" fill={showRightSidebar ? "#101010" : '#ffffff'} />
                    </svg>
                </div>
            </button>
        </div>

        <div className={`flex flex-col gap-4 ${!showRightSidebar ? 'hidden' : ''}`}>
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

            <div className="h-28 p-3 mx-6 bg-gray-25 rounded flex-col justify-start items-start gap-2 flex ">
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
                <button className="h-12 bg-app_primary disabled:bg-gray-200 rounded justify-center items-center flex flex-1 text-white text-base font-semibold leading-normal" onClick={() => onSubmit()}>
                    {loading
                        ? <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5.46257 4.43262C7.21556 2.91688 9.5007 2 12 2C17.5228 2 22 6.47715 22 12C22 14.1361 21.3302 16.1158 20.1892 17.7406L17 12H20C20 7.58172 16.4183 4 12 4C9.84982 4 7.89777 4.84827 6.46023 6.22842L5.46257 4.43262ZM18.5374 19.5674C16.7844 21.0831 14.4993 22 12 22C6.47715 22 2 17.5228 2 12C2 9.86386 2.66979 7.88416 3.8108 6.25944L7 12H4C4 16.4183 7.58172 20 12 20C14.1502 20 16.1022 19.1517 17.5398 17.7716L18.5374 19.5674Z" fill="white" />
                        </svg>
                        : 'Submit'
                    }
                </button>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="#24A148" />
        </svg>
        <p className="text-success text-base font-semibold p-3">Image Label Submitted</p> */}
            </div>
        </div>
    </div>
}
