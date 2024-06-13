import React, { useEffect, useState } from "react";
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';

interface DiagnosisRightBarProps {
    id: string;
    questionnaires?: IQuestionnaire[];
    status?: IQuestionnaire['status'] | 'completed' | '';
    onSubmit: (answers: any) => void;
    sendForSecondOpinion: () => void;
    allowSecondOpinion: boolean
}

const DiagnosisRightBar: React.FC<DiagnosisRightBarProps> = (props) => {
    const { questionnaires, status, onSubmit, sendForSecondOpinion, allowSecondOpinion } = props;

    const [showRightSidebar, setShowRightSidebar] = useState(true);
    const [answers, setAnswers] = useState<{ [key: string]: any }>({});
    const [resizing, setResizing] = useState(false);
    const [resizeData, setResizeData] = useState<{ totalWidth: number, left: number }>();
    const [width, setWidth] = useState(320);

    const startResizing = React.useCallback((e: any) => {
        setResizing(true);
        const totalWidth = e.currentTarget.parentElement.getBoundingClientRect()
            .width;
        const left = e.currentTarget.getBoundingClientRect().left;
        setResizeData({ totalWidth, left })
    }, []);

    const stopResizing = React.useCallback(() => {
        setResizing(false);
    }, [])

    const resizeHandler = React.useCallback((e: any) => {
        if (resizing && resizeData) {
            const w = resizeData.totalWidth - (e.clientX + 6 - resizeData?.left);
            if (w >= 260 && w <= 320) {
                setWidth(w);
            }
        }
    }, [resizing, resizeData])

    React.useEffect(() => {
        window.addEventListener("mousemove", resizeHandler);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resizeHandler);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resizeHandler, stopResizing]);

    const onSelectAnswerChange = (qIndex: number) => (e: any) => {
        const questionnaire = questionnaires ? questionnaires[qIndex] : null;
        if (questionnaire) {
            setAnswers(prev => ({ ...prev, [questionnaire.id as string]: JSON.parse(e.target.value) }));
        }
    }

    const onTextAnswerChange = (qIndex: number) => (e: any) => {
        const questionnaire = questionnaires ? questionnaires[qIndex] : null;
        if (questionnaire) {
            setAnswers(prev => ({ ...prev, [questionnaire.id as string]: { valueString: e.target.value } }));
        }
    }

    return <div className="absolute top-0 right-0 flex flex-col gap-4 border border-gray-100 m-[10px] bg-white">
        <div className="flex">
            <div
                className='resize-handle'
                onMouseDown={startResizing}
            />
            <div className="flex-1 min-w-65 mx-w-80 flex justify-between px-6 py-3 bg-primary-10 shadow border-b border-gray-100" style={{ width }}>
                <div className="flex items-center">
                    <p className="text-gray-900 text-base font-semibold leading-normal ">
                        Diagnosis
                    </p>
                </div>
                <button className={`h-8 px-2 py-1 rounded border border-gray-100 justify-start items-center gap-1 inline-flex ${!showRightSidebar ? 'bg-app_primary border-0' : 'bg-white'}`} onClick={() => setShowRightSidebar(prev => !prev)} >
                    {/* <div className={`text-base font-normal ${!showRightSidebar ? 'text-white' : ''}`}>Close</div> */}
                    <div className={`w-5 h-5 relative transition-all ${!showRightSidebar ? 'rotate-180' : ''}`} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 9.02399L5.87529 13.1488L4.69678 11.9703L10 6.66699L15.3034 11.9703L14.1249 13.1488L10 9.02399Z" fill={showRightSidebar ? "#101010" : '#ffffff'} />
                        </svg>
                    </div>
                </button>
            </div>
        </div>

        <div className={`px-4 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-501px)] ${!showRightSidebar ? 'hidden' : ''}`}>
            {questionnaires?.map((questionnaire, qIndex) => {
                const question = questionnaire?.item?.length ? questionnaire.item[0] : {};
                if (question.type === 'choice') {
                    return <div key={qIndex} className="bg-white flex-col justify-start items-start gap-2 flex">
                        <div className="self-stretch h-7 pb-1">
                            <h6 className="self-stretch text-gray-900 text-base font-semibold leading-normal">{question.text}</h6>
                        </div>
                        <select className="custom-select h-10 self-stretch grow shrink bg-white rounded border text-gray-900 px-4 disabled:bg-gray-25" onChange={onSelectAnswerChange(qIndex)} disabled={status === 'completed'} >
                            <option disabled>Select</option>
                            {question.answerOption?.map(({ valueCoding }, aIndex) => {
                                return <option key={aIndex} value={JSON.stringify({ valueCoding })}>{valueCoding?.display}</option>
                            })}
                        </select>
                    </div>
                }
                if (question.type === 'text') {
                    return <textarea
                        key={qIndex}
                        className="p-4 min-h-[100px] self-stretch grow shrink bg-white rounded border text-gray-900 px-4 disabled:bg-gray-25"
                        placeholder="Add.."
                        onChange={onTextAnswerChange(qIndex)}
                    />
                }
            })}
        </div>
        <div className={`flex flex-col p-4 gap-3 border-t border-gray-3 ${!showRightSidebar ? 'hidden' : ''}`}>
            <div className="h-28 p-3 bg-gray-25 rounded flex-col justify-start items-start gap-2 flex ">
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
                        <p className="grow shrink basis-0 text-gray-900 text-base font-normal leading-normal">-</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1">
                {status === 'completed'
                    ? <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="#24A148" />
                        </svg>
                        <p className="text-success text-base font-semibold p-3">Image Label Submitted</p>
                    </>
                    : <>
                        {allowSecondOpinion && <button className="h-12 bg-white border border-app_primary disabled:border-gray-400 rounded justify-center items-center flex flex-1 text-app_primary disabled:text-gray-400 text-base font-semibold leading-normal" onClick={sendForSecondOpinion} >
                            Second Opinion
                        </button>}
                        <button
                            className="h-12 bg-app_primary disabled:bg-gray-200 rounded justify-center items-center flex flex-1 text-white text-base font-semibold leading-normal"
                            onClick={() => onSubmit(answers)}
                            disabled={Object.keys(answers).length !== questionnaires?.length}
                        >
                            Submit
                        </button>
                    </>}
            </div>
        </div>
    </div>
}

export { DiagnosisRightBar }
