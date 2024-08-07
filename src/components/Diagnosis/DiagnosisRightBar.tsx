import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { message } from 'antd';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { IQuestionnaireResponse } from "@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse";
import { executeFhirCqlQuery } from '@/app/loader';
import { DIAGNOSIS_RESULTS_MAPPING } from '@/utils/fhir-utils';

interface DiagnosisRightBarProps {
    id: string;
    questionnaire?: IQuestionnaire;
    questionResponse?: Partial<IQuestionnaireResponse>;
    status?: IQuestionnaire['status'] | 'completed' | '';
    onSubmit: (answers: any) => void;
    sendForSecondOpinion?: () => void;
    allowSecondOpinion?: boolean
    isSpecialistUser?: boolean
}
interface DiagnosisResult {
    risk: string;
    isSuspicious: boolean;
}

const DiagnosisRightBar: React.FC<DiagnosisRightBarProps> = (props) => {
    const { id, questionnaire, questionResponse, status, onSubmit, sendForSecondOpinion, allowSecondOpinion, isSpecialistUser } = props;
    const { data: session } = useSession();

    const [showRightSidebar, setShowRightSidebar] = useState<boolean>(true);
    const [answers, setAnswers] = useState<{ [key: string]: any }>({});
    const [resizing, setResizing] = useState<boolean>(false);
    const [resizeData, setResizeData] = useState<{ totalWidth: number, left: number }>();
    const [width, setWidth] = useState<number>(320);
    const [diagnosisResults, setDiagnosisResults] = useState<{ risk: string, suspicion: string } | null>();

    useEffect(() => {
        if (questionResponse?.item?.length) {
            const tempQueRes: { [key: string]: any } = {}
            questionResponse?.item?.forEach(item => {
                if (item.linkId) {
                    tempQueRes[item.linkId] = item?.answer ? item?.answer[0] : '';
                }
            })
            setAnswers(tempQueRes);
        }
    }, [questionResponse?.item?.length])

    useEffect(() => {
        if (answers["provisional-diagnosis"]) {
            type DiagnosisKey = keyof typeof DIAGNOSIS_RESULTS_MAPPING;
            const selectedOption: DiagnosisKey = answers["provisional-diagnosis"].valueCoding.display.toLowerCase();
            if (selectedOption && DIAGNOSIS_RESULTS_MAPPING[selectedOption]) {
                setDiagnosisResults({
                    risk: DIAGNOSIS_RESULTS_MAPPING[selectedOption].risk + ' risk',
                    suspicion: DIAGNOSIS_RESULTS_MAPPING[selectedOption].isSuspicious ? 'Suspicious' : 'Non suspicious',
                });
            }
            else {
                setDiagnosisResults(null);
            }
        }
    }, [answers["provisional-diagnosis"]])

    // useEffect(() => {
    // Fetch results of diagnosis
    //     if (session?.accessToken && allowSubmit()) {
    //         const payload = {
    //             resourceType: "Parameters",
    //             parameter: [
    //                 {
    //                     "name": "expression",
    //                     "valueString": `${questionnaire?.id}.\"Available Senior Specialist Reference\"`
    //                 },
    //                 {
    //                     "name": "library",
    //                     "resource": {
    //                         "resourceType": "Parameters",
    //                         "parameter": [
    //                             {
    //                                 "name": "url",
    //                                 "valueUrl": `https://midas.iisc.ac.in/fhir/Library/${questionnaire?.id}`
    //                             }
    //                         ]
    //                     }
    //                 }
    //             ]
    //         }
    //         executeFhirCqlQuery(session?.accessToken, payload)
    //             .then((data) => console.log('data', data))
    //             .catch(error => message.error('Error fetching results of diagnosis'))
    //     }
    // }, [Object.values(answers).length])

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
            if (w >= 260 && w <= 360) {
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

    const onSelectAnswerChange = (itemIndex: number) => (e: any) => {
        const queItem = questionnaire?.item ? questionnaire.item[itemIndex] : null;
        if (queItem) {
            setAnswers(prev => ({ ...prev, [queItem.linkId as string]: JSON.parse(e.target.value) }));
        }
    }

    const onTextAnswerChange = (itemIndex: number) => (e: any) => {
        const queItem = questionnaire?.item ? questionnaire.item[itemIndex] : null;
        if (queItem) {
            setAnswers(prev => ({ ...prev, [queItem.linkId as string]: { valueString: e.target.value } }));
        }
    }

    const allowSubmit = () => {
        return questionnaire?.item?.every(i => (
            i.required
                ? i.linkId && (!!answers[i.linkId]?.valueCoding || !!answers[i.linkId]?.valueString)
                : true)
        )
    }

    return <div className="absolute top-0 right-0 flex flex-col gap-4 border border-gray-100 m-[10px] bg-white min-w-55 max-w-90" style={{ width }}>
        <div className="flex">
            <div className="relative flex-1 min-w-65 mx-w-80 flex justify-between px-6 py-3 bg-primary-10 shadow border-b border-gray-100" >
                {isSpecialistUser && <div
                    className='resize-handle absolute h-full z-10 top-0 left-0'
                    onMouseDown={startResizing}
                />}
                <div className="flex items-center">
                    <p className="text-gray-900 text-base font-semibold leading-normal ">
                        Diagnosis
                    </p>
                    {!isSpecialistUser && <p className="truncate text-gray-900 text-base font-semibold leading-normal ml-1" style={{ width: width - 170 }}>
                        {id}
                    </p>}
                </div>
                <button className={`h-8 px-2 py-1 rounded border border-gray-100 justify-start items-center gap-1 inline-flex ${!showRightSidebar ? 'bg-primary-400 border-0' : 'bg-white'}`} onClick={() => setShowRightSidebar(prev => !prev)} >
                    {/* <div className={`text-base font-normal ${!showRightSidebar ? 'text-white' : ''}`}>Close</div> */}
                    <div className={`w-5 h-5 relative transition-all ${!showRightSidebar ? 'rotate-180' : ''}`} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 9.02399L5.87529 13.1488L4.69678 11.9703L10 6.66699L15.3034 11.9703L14.1249 13.1488L10 9.02399Z" fill={showRightSidebar ? "#101010" : '#ffffff'} />
                        </svg>
                    </div>
                </button>
            </div>
        </div>

        <div className={`px-4 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-470px)] ${!showRightSidebar ? 'hidden' : ''}`}>
            {questionnaire?.item?.map((question, qIndex) => {
                // media-id question will be hidden
                if (question.linkId === 'media-id') return;
                const elementType = question.extension && question.extension[0]?.valueCodeableConcept?.coding && question.extension[0]?.valueCodeableConcept?.coding[0]?.code
                if (question.type === 'choice' && elementType === 'radio-button') {
                    return <div key={qIndex} className="bg-white flex-col justify-start items-start gap-2 flex">
                        <div className="self-stretch h-7 pb-1">
                            <h6 className="self-stretch text-gray-900 text-base font-medium leading-normal">{question.text}</h6>
                        </div>
                        {question.answerOption?.map(({ valueCoding }) => {
                            const isDefaultChecked = question?.linkId ? JSON.stringify(answers[question.linkId]) === JSON.stringify({ valueCoding }) ?? false : false;
                            return <div key={valueCoding?.code} className="custom-radio py-1">
                                <input type="radio" className='w-5 h-5' id={valueCoding?.code} name="diagnosis" checked={isDefaultChecked} value={JSON.stringify({ valueCoding })} onChange={onSelectAnswerChange(qIndex)} disabled={status === 'completed'} />
                                <label htmlFor={valueCoding?.code} className="text-gray-900 text-base font-normal leading-6">{valueCoding?.display}</label>
                            </div>
                        })}
                    </div>
                }
                if (question.type === 'choice' && elementType === 'drop-down') {
                    return <div key={qIndex} className="bg-white flex-col justify-start items-start gap-2 flex">
                        <div className="self-stretch h-7 pb-1">
                            <h6 className="self-stretch text-gray-900 text-base font-medium leading-normal">{question.text}</h6>
                        </div>
                        <select className="custom-select h-10 self-stretch grow shrink bg-white rounded border text-gray-900 px-4 disabled:bg-gray-25" value={question?.linkId ? JSON.stringify(answers[question.linkId]) ?? '' : ''} onChange={onSelectAnswerChange(qIndex)} disabled={status === 'completed'} >
                            <option value='' disabled hidden>Select</option>
                            {question.answerOption?.map(({ valueCoding }, aIndex) => {
                                return <option key={aIndex} value={JSON.stringify({ valueCoding })} >{valueCoding?.display}</option>
                            })}
                        </select>
                    </div>
                }
                if (question.type === 'text') {
                    return <div key={qIndex} className="bg-white flex-col justify-start items-start gap-2 flex">
                        <div className="self-stretch h-7 pb-1">
                            <h6 className="self-stretch text-gray-900 text-base font-medium leading-normal">{question.text}</h6>
                        </div>
                        <textarea
                            key={qIndex}
                            className="p-4 min-h-[100px] self-stretch grow shrink bg-white rounded border text-gray-900 px-4 disabled:bg-gray-25 resize-none"
                            placeholder="Add.."
                            onChange={onTextAnswerChange(qIndex)}
                            defaultValue={question?.linkId ? answers[question.linkId]?.valueString : ''}
                            disabled={status === 'completed'}
                        />
                    </div>
                }
                if (question.type === 'string') {
                    return <div key={qIndex} className="bg-white flex-col justify-start items-start gap-2 flex">
                        <div className="self-stretch h-7 pb-1">
                            <h6 className="self-stretch text-gray-900 text-base font-medium leading-normal">{question.text}</h6>
                        </div>
                        <input
                            key={qIndex}
                            className="p-4 h-10 self-stretch grow shrink bg-white rounded border text-gray-900 px-4 disabled:bg-gray-25 resize-none"
                            placeholder="Add.."
                            onChange={onTextAnswerChange(qIndex)}
                            defaultValue={question?.linkId ? answers[question.linkId]?.valueString : ''}
                            disabled={status === 'completed'}
                        />
                    </div>
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
                        <p className="grow shrink basis-0 text-gray-900 text-base font-normal leading-normal ml-1">{diagnosisResults?.risk ?? '-'}</p>
                    </div>
                    <div className="justify-start items-start gap-1 inline-flex">
                        <p className="w-20 text-gray-900 text-base font-normal leading-normal">Suspicion</p>
                        <p className="text-gray-900 text-base font-normal leading-normal">:</p>
                        <p className="grow shrink basis-0 text-gray-900 text-base font-normal leading-normal ml-1">{diagnosisResults?.suspicion ?? '-'}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1">
                {status === 'completed'
                    ? <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z" fill="#24A148" />
                        </svg>
                        <p className="text-success text-base font-semibold p-3">Diagnosis Submitted</p>
                    </>
                    : <>
                        {allowSecondOpinion && <button className="h-12 bg-white border border-primary-400 disabled:border-gray-400 rounded justify-center items-center flex flex-1 text-primary-400 disabled:text-gray-400 text-base font-semibold leading-normal" onClick={sendForSecondOpinion} disabled={!questionnaire?.id} >
                            Second Opinion
                        </button>}
                        <button
                            className="h-12 bg-primary-400 disabled:bg-gray-200 rounded justify-center items-center flex flex-1 text-white text-base font-semibold leading-normal"
                            onClick={() => onSubmit(answers)}
                            disabled={!allowSubmit()}
                        >
                            Submit
                        </button>
                    </>}
            </div>
        </div>
    </div>
}

export { DiagnosisRightBar }
