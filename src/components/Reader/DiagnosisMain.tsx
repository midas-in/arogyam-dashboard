'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { message } from 'antd';
import update from 'immutability-helper';
import { v4 } from 'uuid';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';
import { IMedia } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedia';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';

import { DiagnosisImage } from '@/components/Diagnosis/DiagnosisImage';
import { DiagnosisRightBar } from "@/components/Diagnosis/DiagnosisRightBar";
import { Loader } from "@/components/UI/Loader";
import {
    fetchFhirResource, fetchFhirSingleResource, updateFhirResource,
    extractQuestionnaireResponse, createMultipleFhirResources
} from '@/app/loader';
import { getResourcesFromBundle } from '@/utils/fhir-utils';

interface QueryParams {
    sort: string;
    dateAfter?: string | Date;
    dateBefore?: string | Date;
    limit: number;
}

export default function ReaderDiagnosis() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [taskCount, setTaskCount] = useState<number>(0);
    const [activeTask, setActiveTask] = useState<ITask>();
    const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
    const [nextTaskId, setNextTaskId] = useState<string | null>(null);
    const [prevTaskId, setPrevTaskId] = useState<string | null>(null);
    const [questionnaire, setQuestionnaire] = useState<IQuestionnaire>();
    const [media, setMedia] = useState<IMedia>();
    // const [patient, setPatient] = useState<IPatient>();
    const [questionResponse, setQuestionResponse] = useState<Partial<IQuestionnaireResponse>>();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id && typeof id === 'string') {
            fetchTaskAndAdjacentTaskIds(id);
        }
    }, [id]);

    async function fetchTaskIndex(task: ITask) {
        if (task && session?.accessToken) {
            const params: any = {
                resourceType: 'Task',
                query: {
                    owner: `Practitioner/${session?.resourceId}`,
                    status: searchParams.get('status') ?? 'requested',
                    _sort: 'authored-on,_lastUpdated',
                    _count: 1,
                    _summary: 'count',
                }
            }
            fetchFhirResource(session.accessToken, params)
                .then((data: IBundle) => {
                    setTaskCount(data.total || 0);
                })
                .catch((error: any) => { console.log(error); message.error('Error fetching Tasks count') })
                .finally(() => setLoading(false));

            // Get number of tasks before the current task
            if (task?.authoredOn) {
                params.query['authored-on'] = `lt${new Date(task?.authoredOn).toISOString()}`;
            }
            fetchFhirResource(session.accessToken, params)
                .then((indexData: IBundle) => {
                    const tasksBeforeCurrent = indexData.total ?? 0;

                    // Calculate current index (add 1 because index is 0-based)
                    setActiveTaskIndex(tasksBeforeCurrent + 1);
                })
                .catch((error: any) => { console.log(error); message.error('Error fetching Tasks count') })
                .finally(() => setLoading(false));
        }
    }

    async function fetchTask(taskId: string) {
        if (session?.accessToken) {
            try {
                const payload = {
                    resourceType: 'Task',
                    id: taskId
                }
                const taskData: ITask = await fetchFhirSingleResource(session?.accessToken, payload)
                setActiveTask(taskData);
                fetchTaskIndex(taskData)
                return taskData;
            }
            catch (error) {
                console.log(error);
                message.error('Failed to fetch task');
            }
        }
    }

    async function fetchTaskAndAdjacentTaskIds(taskId: string): Promise<void> {
        const currentTask = await fetchTask(taskId);

        if (currentTask) {
            const prevTask = await searchTasks({
                sort: '-authored-on,-_lastUpdated',
                dateBefore: currentTask.authoredOn,
                limit: 1
            });
            const nextTask = await searchTasks({
                sort: 'authored-on,_lastUpdated',
                dateAfter: currentTask.authoredOn,
                limit: 1
            });
            setNextTaskId(nextTask && nextTask[0]?.id || null);
            setPrevTaskId(prevTask && prevTask[0]?.id || null);
        }
    }

    async function searchTasks(params: QueryParams) {
        if (session?.accessToken) {
            try {
                const queryParams: any = {
                    owner: `Practitioner/${session?.resourceId}`,
                    status: searchParams.get('status') ?? 'requested',
                    _sort: params.sort,
                    _count: params.limit.toString(),
                };

                if (params.dateAfter) queryParams['authored-on'] = `gt${new Date(params.dateAfter).toISOString()}`;
                if (params.dateBefore) queryParams['authored-on'] = `lt${new Date(params.dateBefore).toISOString()}`;

                const data = await fetchFhirResource(session.accessToken, { resourceType: 'Task', query: queryParams });
                return getResourcesFromBundle<ITask>(data);
            }
            catch (error) {
                console.log(error);
                message.error('Failed to fetch tasks');
            }
        }
    }

    // useEffect(() => {
    //     if (session?.accessToken && !tasks?.length) {
    //         const params = {
    //             resourceType: 'Task',
    //             query: {
    //                 owner: `Practitioner/${session?.resourceId}`,
    //                 status: searchParams.get('status') ?? 'requested',
    //                 _count: 100,
    //             }
    //         }
    //         fetchFhirResource(session.accessToken, params)
    //             .then((data: IBundle) => {
    //                 setTasks(getResourcesFromBundle<ITask>(data));

    //             })
    //             .catch((error: any) => { console.log(error); message.error('Error fetching Tasks') });

    //     }
    // }, [session?.accessToken])

    // useEffect(() => {
    //     if (tasks?.length && id) {
    //         const index = tasks.findIndex(task => task.id === id);
    //         setActiveTaskIndex(index);
    //         if (index === -1) {
    //             router.push('/');
    //             message.error('Image not found');
    //         }
    //     }
    // }, [tasks?.length, id])

    useEffect(() => {
        // When id/index changes
        if (session?.accessToken && activeTask?.id) {
            if (activeTask && activeTask.input && activeTask.input.length > 0 && activeTask.input[0]) {
                // Fetch media(images)
                const [mediaResourceType, mediaId] = activeTask.input[0]?.valueReference?.reference?.split('/') ?? []
                // Fetch Questionnaire
                const [questionnaireResourceType, questionnaireId] = activeTask.focus?.reference?.split('/') ?? []
                // Fetch patient as well
                // const [patientResourceType, patientId] = activeTask.for?.reference?.split('/') ?? []

                Promise.all([
                    fetchFhirSingleResource(session?.accessToken, { resourceType: questionnaireResourceType, id: questionnaireId }),
                    fetchFhirSingleResource(session?.accessToken, { resourceType: mediaResourceType, id: mediaId }),
                    // fetchFhirSingleResource(session?.accessToken, { resourceType: patientResourceType, id: patientId }),
                ])
                    .then(async ([ques, mda]: [IQuestionnaire, IMedia]) => {
                        setQuestionnaire(ques);
                        setMedia(mda);
                        // For reader, there will be media-id question, which will be hidden and submitted in background
                        if (ques?.item?.some(item => item.linkId === 'media-id')) {
                            const mediaIdItem = ques?.item?.find(item => item.linkId === 'media-id');
                            if (mediaIdItem) {
                                setQuestionResponse({ item: [{ ...mediaIdItem, answer: [{ valueString: `Media/${mda?.id}` }] }] });
                            }
                        }
                        if (activeTask.status === 'completed' && ques && ques?.url) {
                            const qResponse = await fetchFhirResource(session?.accessToken as string, {
                                resourceType: 'QuestionnaireResponse',
                                query: {
                                    questionnaire: ques.url,
                                    encounter: activeTask.encounter?.reference,
                                    author: `Practitioner/${session?.resourceId}`,
                                }
                            }).catch(e => console.log('Error fetching QuestionnaireResponse'));
                            setQuestionResponse(getResourcesFromBundle<IQuestionnaireResponse>(qResponse)[0])

                        }
                        setLoading(false);
                    })
                    .catch((error: any) => {
                        console.log(error);
                        message.error('Error fetching Questionnaire/Media');
                    });
            }
        }
    }, [activeTask?.id])

    // const onClickPrevious = () => {
    //     if (activeTaskIndex > 0) {
    //         // setActiveTaskIndex(prev => (prev ?? 0) - 1);
    //         const params = new URLSearchParams(searchParams.toString());
    //         router.push(`/diagnosis/${tasks[activeTaskIndex - 1].id}?${params.toString()}`);
    //     }
    // }

    // const onClickNext = () => {
    //     if (tasks?.length && activeTaskIndex < tasks?.length - 1) {
    //         // setActiveTaskIndex(prev => (prev ?? 0) + 1);
    //         const params = new URLSearchParams(searchParams.toString());
    //         router.push(`/diagnosis/${tasks[activeTaskIndex + 1].id}?${params.toString()}`);
    //     }
    // }

    const navigateToTask = (taskId: string): void => {
        console.log('navigateToTask,', taskId);
        if (taskId) {
            const params = new URLSearchParams(searchParams.toString());
            router.push(`/diagnosis/${taskId}?${params.toString()}`);
        }
    }

    const onSubmit = async (answers: { [key: string]: NonNullable<NonNullable<IQuestionnaire['item']>[number]['answerOption']>[number] }) => {
        if (activeTask) {
            setSubmitting(true);

            try {
                // create a resource QuestionnaireResponse
                const item: any = questionnaire?.item?.map(({ answerOption, ...itm }: any) => {
                    itm.answer = [answers[itm?.linkId as string]];
                    return itm;
                });

                const responsePayload: IQuestionnaireResponse = {
                    resourceType: 'QuestionnaireResponse',
                    id: v4(),
                    questionnaire: questionnaire?.url,
                    status: 'completed',
                    subject: activeTask.for,
                    author: activeTask.owner,
                    encounter: activeTask.encounter,
                    item,
                    authored: new Date().toISOString(),
                }
                const extractPayload = {
                    resourceType: "Parameters",
                    parameter: [
                        {
                            name: "questionnaire-response",
                            resource: responsePayload
                        }
                    ]
                }
                const extractedResponse = await extractQuestionnaireResponse(session?.accessToken as string, extractPayload);
                extractedResponse.entry?.push({
                    resource: responsePayload,
                    request: {
                        method: 'PUT',
                        url: `${responsePayload.resourceType}/${responsePayload.id}`
                    }
                });
                // update status to completed
                const taskPayload: ITask = {
                    ...activeTask,
                    status: 'completed'
                }
                extractedResponse.entry?.push({
                    resource: taskPayload,
                    request: {
                        method: 'PUT',
                        url: `${taskPayload.resourceType}/${taskPayload.id}`
                    }
                });
                await createMultipleFhirResources(session?.accessToken as string, extractedResponse);
                message.success('Submitted successfully');
                setTasks(update(tasks, { [activeTaskIndex]: { $merge: taskPayload } }));
                nextTaskId && navigateToTask(nextTaskId);
            }
            catch (e) {
                console.log(e);
                message.error(`Error while submitting question answer`);
            }
            finally {
                setSubmitting(false)
            }
        }
    }

    return <div className="flex flex-1 flex-col gap-3 mx-6 my-4">
        <div className="flex align-center justify-between px-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <Link href={'/'}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" fill="#212121" />
                    </svg>
                </Link>
                <p className="text-gray-900 text-2xl leading-8 font-normal">{questionnaire?.item ? questionnaire?.item[0]?.text : ''}</p>
            </div>
            {/* pagination */}
            <div className="flex items-center justify-center gap-3">
                <button className="w-[98px] h-8 p-1 bg-gray-25 rounded justify-center items-center gap-1 inline-flex disabled:opacity-50" onClick={() => prevTaskId && navigateToTask(prevTaskId)} disabled={activeTaskIndex === 0}>
                    <div className="w-6 h-6 relative" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" fill="black" />
                        </svg>
                    </div>
                    <div className="text-black text-base font-normal">Previous</div>
                </button>
                <p className="text-black text-base font-normal border-l border-r px-3 border-gray-100 inline-flex align-center justify-center align-bottom	leading-8">{activeTaskIndex}/{taskCount}</p>
                <button className="w-[70px] h-8 p-1 bg-gray-25 rounded justify-start items-center gap-1 inline-flex disabled:opacity-50" onClick={() => nextTaskId && navigateToTask(nextTaskId)} disabled={activeTaskIndex === (taskCount ?? 0)}>
                    <div className="text-black text-base font-normal">Next</div>
                    <div className="w-6 h-6 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" fill="black" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>

        <div className={`min-h-[calc(100vh-154px)] relative flex items-center justify-center ${loading ? 'bg-gray-100' : 'bg-black'}`}>
            {loading
                ? <Loader />
                : <>
                    <DiagnosisImage medias={media ? [media] : []} />
                    <DiagnosisRightBar
                        id={id as string}
                        questionnaire={questionnaire}
                        questionResponse={questionResponse}
                        status={(activeTask?.status ?? '') as IQuestionnaire['status'] | 'completed' | ''}
                        onSubmit={onSubmit}
                    />
                </>
            }
            {submitting && <div className="absolute flex flex-col items-center justify-center z-20 h-full w-full">
                <div className="absolute flex flex-1 bg-gray-900 opacity-40 h-full w-full" />
                <p className="text-white text-base font-semibold z-10">Submitting & loading next image</p>
                <div className="w-[200px] h-2 relative bg-white rounded mt-4 ">
                    <div className="h-2 left-0 top-0 absolute bg-primary-400 rounded animate-linear" />
                </div>
            </div>}
        </div>
    </div >
}
