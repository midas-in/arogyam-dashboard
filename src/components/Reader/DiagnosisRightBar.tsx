import React, { useEffect, useState } from "react";
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';

interface DiagnosisRightBarProps {
    id: string;
    questionnaire?: IQuestionnaire;
    status?: IQuestionnaire['status'] | 'completed' | '';
    onSubmit: (answers: any) => void;
}

const DiagnosisRightBar: React.FC<DiagnosisRightBarProps> = (props) => {
    const { id, questionnaire, status, onSubmit } = props;
    const question = questionnaire?.item?.length ? questionnaire.item[0] : {};

    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);


    return <div className="absolute top-0 right-0 flex flex-col gap-4 border border-gray-100 m-[10px] bg-white">
        <div className="min-w-[300px] flex justify-between px-6 py-3 bg-primary-10 shadow border-b border-gray-100">
            <div className="flex">
                <p className="text-gray-900 text-base font-semibold leading-normal ">
                    Diagnosis -
                </p>
                <p className="w-20 truncate text-gray-900 text-base font-semibold leading-normal ml-1">
                    {id}
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

        <div className={`flex flex-col gap-4 overflow-y-auto h-[calc(100vh-370px)] ${!showRightSidebar ? 'hidden' : ''}`}>
            <div className="px-6 flex-col justify-start items-start flex ">
                <h6 className="text-gray-900 text-base font-medium leading-normal">{question.text}</h6>
                <div className="h-[342px] flex-col justify-start items-start flex mt-1">
                    {question.answerOption?.map(({ valueCoding }, index) => {
                        return <div key={valueCoding?.code} className="py-1.5 bg-white justify-center items-start  flex">
                            <input type="radio" className='w-5 h-5 cursor-pointer' id={valueCoding?.code} name="diagnosis" value={valueCoding?.code} onChange={e => { setSelectedOptionIndex(index) }} disabled={status === 'completed'} />
                            <label htmlFor={valueCoding?.code} className="text-gray-900 text-base font-normal leading-normal ml-2 cursor-pointer">{valueCoding?.display}</label>
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
        </div>
        <div className={`flex flex-col gap-4 ${!showRightSidebar ? 'hidden' : ''}`}>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-center gap-1">
                {status === 'completed'
                    ? <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="#24A148" />
                        </svg>
                        <p className="text-success text-base font-semibold p-3">Image Label Submitted</p>
                    </>
                    : <button className="h-12 bg-app_primary disabled:bg-gray-200 rounded justify-center items-center flex flex-1 text-white text-base font-semibold leading-normal" onClick={() => onSubmit(question?.answerOption && question?.answerOption[selectedOptionIndex])} disabled={selectedOptionIndex === -1}>
                        Submit
                    </button>}
            </div>
        </div>
    </div>
}

export { DiagnosisRightBar }
