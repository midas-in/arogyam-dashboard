'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { message } from 'antd';
import update from 'immutability-helper';
import { v4 } from 'uuid';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';
import { IQuestionnaireResponse } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaireResponse';
import { IMedia } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedia';

import { DiagnosisImage } from '@/components/Reader/DiagnosisImage';
import { DiagnosisRightBar } from "@/components/Reader/DiagnosisRightBar";
import { Loader } from "@/components/UI/Loader";
import { fetchFhirResource, fetchFhirSingleResource, updateFhirResource } from '@/app/loader';
import { getResourcesFromBundle } from '@/utils/fhir-utils';

export default function Diagnosis() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [activeTaskIndex, setActiveTaskIndex] = useState<number>(-1);
    const [questionnaire, setQuestionnaire] = useState<IQuestionnaire>();
    const [media, setMedia] = useState<IMedia>();
    const [submitting, setSubmitting] = useState(false);
    const activeTask: ITask = tasks[activeTaskIndex]
    console.log('task', activeTask);
    console.log('questionnaire', questionnaire);
    console.log('media', media);


    useEffect(() => {
        if (session?.accessToken && !tasks?.length) {
            const params = {
                resourceType: 'Task',
                query: {
                    // owner: `Practitioner/${session?.resourceId}`, //TODO
                    status: 'requested'
                }
            }
            fetchFhirResource(session.accessToken, params)
                .then((data: IBundle) => {
                    setTasks(getResourcesFromBundle<ITask>(data));

                })
                .catch((error: any) => { console.log(error); message.error('Error fetching Tasks', error) });

        }
    }, [session?.accessToken])

    useEffect(() => {
        if (tasks?.length && id) {
            const index = tasks.findIndex(task => task.id === id);
            setActiveTaskIndex(index);
        }
    }, [tasks?.length, id])

    useEffect(() => {
        // When id/index changes
        if (session?.accessToken && tasks?.length && activeTaskIndex !== undefined) {
            if (activeTask && activeTask.input && activeTask.input.length > 0 && activeTask.input[0]) {
                // Fetch Questionnaire
                const [questionnaireResourceType, questionnaireId] = activeTask.input[0]?.valueReference?.reference?.split('/') ?? []
                // Fetch media(images) as well
                const [mediaResourceType, mediaId] = activeTask.focus?.reference?.split('/') ?? []

                Promise.all([
                    fetchFhirSingleResource(session?.accessToken, { resourceType: questionnaireResourceType, id: questionnaireId }),
                    fetchFhirSingleResource(session?.accessToken, { resourceType: mediaResourceType, id: mediaId })
                ])
                    .then(([ques, mda]: [IQuestionnaire, IMedia]) => {
                        setQuestionnaire(ques);
                        setMedia(mda);
                        setLoading(false);
                    })
                    .catch((error: any) => {
                        console.log(error);
                        message.error('Error fetching Questionnaire/Media', error);
                    });
            }
        }
    }, [id, activeTaskIndex])

    const onClickPrevious = () => {
        if (activeTaskIndex > 0) {
            // setActiveTaskIndex(prev => (prev ?? 0) - 1);
            router.push(`/tasks/${tasks[activeTaskIndex - 1].id}/diagnosis`);
        }
    }

    const onClickNext = () => {
        if (tasks?.length && activeTaskIndex < tasks?.length - 1) {
            // setActiveTaskIndex(prev => (prev ?? 0) + 1);
            router.push(`/tasks/${tasks[activeTaskIndex + 1].id}/diagnosis`);
        }
    }

    const onSubmit = async (answer?: NonNullable<NonNullable<IQuestionnaire['item']>[number]['answerOption']>[number]) => {
        setSubmitting(true);

        try {
            // create a resource QuestionnaireResponse
            const item: any = questionnaire?.item?.map(({ answerOption, ...itm }: any) => {
                itm.answer = [answer];
                return itm;
            });

            const responsePayload: IQuestionnaireResponse = {
                resourceType: 'QuestionnaireResponse',
                id: v4(),
                questionnaire: activeTask.input?.length ? activeTask.input[0].valueReference?.reference : undefined,
                status: 'completed',
                author: activeTask.for,
                source: activeTask.owner,
                item,
                authored: new Date().toISOString(),
            }
            console.log('responsePayload', responsePayload);
            await updateFhirResource(session?.accessToken as string, responsePayload);
            // update status to completed
            const taskPayload: ITask = {
                ...activeTask,
                status: 'completed'
            }
            // await updateFhirResource(session?.accessToken as string, taskPayload);
            setTasks(update(tasks, { [activeTaskIndex]: { $merge: taskPayload } }));
            onClickNext();
        }
        catch (e) {
            console.log(e);
            message.error(`Error while submitting question answer`);
        }
        finally {
            setSubmitting(false)
        }
    }


    return <div className="flex flex-1 flex-col gap-3 m-[25px]">
        <div className="flex align-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <Link href={'/tasks'}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" fill="#212121" />
                    </svg>
                </Link>
                <div className="text-gray-900 text-2xl leading-8">{questionnaire?.item ? questionnaire?.item[0]?.text : ''}</div>
            </div>
            {/* pagination */}
            <div className="flex items-center justify-center gap-3">
                <button className="w-[98px] h-8 p-1 bg-gray-25 rounded justify-center items-center gap-1 inline-flex disabled:opacity-50" onClick={onClickPrevious} disabled={activeTaskIndex === 0}>
                    <div className="w-6 h-6 relative" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z" fill="black" />
                        </svg>
                    </div>
                    <div className="text-black text-base font-normal">Previous</div>
                </button>
                <p className="text-black text-base font-normal border-l border-r px-3 border-gray-100 inline-flex align-center justify-center align-bottom	leading-8">{(activeTaskIndex ?? 0) + 1}/{tasks?.length}</p>
                <button className="w-[70px] h-8 p-1 bg-gray-25 rounded justify-start items-center gap-1 inline-flex disabled:opacity-50" onClick={onClickNext} disabled={activeTaskIndex === (tasks?.length ?? 0) - 1}>
                    <div className="text-black text-base font-normal">Next</div>
                    <div className="w-6 h-6 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" fill="black" />
                        </svg>
                    </div>
                </button>
            </div>
        </div>

        <div className={`min-h-[calc(100vh-190px)] relative flex items-center justify-center ${loading ? 'bg-gray-100' : 'bg-black'}`}>
            {loading
                ? <Loader />
                : <>
                    <DiagnosisImage media={media} />
                    <DiagnosisRightBar
                        id={id as string}
                        questionnaire={questionnaire}
                        status={(tasks?.length ? activeTask?.status : '') as IQuestionnaire['status'] | 'completed' | ''}
                        onSubmit={onSubmit}
                    />
                </>
            }
            {submitting && <div className="absolute flex flex-col items-center justify-center z-20 h-full w-full">
                <div className="absolute flex flex-1 bg-gray-900 opacity-40 h-full w-full" />
                <p className="text-white text-base font-semibold z-10">Submitting & loading next image</p>
                <div className="w-[200px] h-2 relative bg-white rounded mt-4 ">
                    <div className="h-2 left-0 top-0 absolute bg-app_primary rounded animate-linear" />
                </div>
            </div>}
        </div>
    </div >
}
