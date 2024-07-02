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
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';

import { DiagnosisImage } from '@/components/Diagnosis/DiagnosisImage';
import { DiagnosisLeftBar } from "@/components/Specialist/DiagnosisLeftBar";
import { DiagnosisRightBar } from "@/components/Diagnosis/DiagnosisRightBar";
import { Loader } from "@/components/UI/Loader";
import { fetchFhirResource, fetchFhirSingleResource, updateFhirResource, fetchFhirResourceEverything } from '@/app/loader';
import { getResourcesFromBundle, REMOTE_SPECIALIST } from '@/utils/fhir-utils';

export default function RemoteSpecialistDiagnosis() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [activeTaskIndex, setActiveTaskIndex] = useState<number>(-1);
    const [questionnaire, setQuestionnaire] = useState<IQuestionnaire>();
    const [questionResponse, setQuestionResponse] = useState<IQuestionnaireResponse>();
    const [encounter, setEncounter] = useState<IEncounter>();
    const [medias, setMedias] = useState<IMedia[]>();
    const [observations, setObservations] = useState<IObservation[]>();
    const [patient, setPatient] = useState<IPatient>();
    const [submitting, setSubmitting] = useState(false);
    const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

    const activeTask: ITask = tasks[activeTaskIndex]

    useEffect(() => {
        if (session?.accessToken && !tasks?.length) {
            const params = {
                resourceType: 'Task',
                query: {
                    owner: `Practitioner/${session?.resourceId}`,
                    status: searchParams.get('status') ?? 'requested'
                }
            }
            fetchFhirResource(session.accessToken, params)
                .then((data: IBundle) => {
                    setTasks(getResourcesFromBundle<ITask>(data));

                })
                .catch((error: any) => {
                    console.log(error);
                    message.error('Error fetching Tasks', error);
                });

        }
    }, [session?.accessToken])

    useEffect(() => {
        if (tasks?.length && id) {
            const index = tasks.findIndex(task => task.id === id);
            setActiveTaskIndex(index);
            if (index === -1) {
                router.push('/');
                message.error('Case not found');
            }
        }
    }, [tasks?.length, id])

    useEffect(() => {
        // When id/index changes
        if (session?.accessToken && tasks?.length && activeTaskIndex !== undefined && activeTaskIndex !== -1) {
            // Fetch encounter
            const [encounterResourceType, encounterId] = activeTask.encounter?.reference?.split('/') ?? []

            fetchFhirResourceEverything(session?.accessToken, {
                resourceType: encounterResourceType,
                id: encounterId
            })
                .then(async (data: IBundle) => {
                    const bundledData = getResourcesFromBundle<any>(data);
                    setEncounter(bundledData.filter(bd => bd.resourceType === 'Encounter')[0]);
                    setMedias(bundledData.filter(bd => bd.resourceType === 'Media'));
                    setObservations(bundledData.filter(bd => bd.resourceType === 'Observation'));
                    setQuestionnaire(bundledData.filter(bd => bd.resourceType === 'Questionnaire')[0]);
                    setPatient(bundledData.filter(bd => bd.resourceType === 'Patient')[0]);
                    // Get the submitted question response as well when the task is completed
                    if (searchParams.get('status') === 'completed' && activeTask.focus) {

                        const [questionnaireResourceType, questionnaireId] = activeTask?.focus?.reference?.split('/') ?? []
                        const qResponses = await fetchFhirResource(session?.accessToken as string, {
                            resourceType: 'QuestionnaireResponse',
                            query: {
                                questionnaire: questionnaireId,
                                author: `Practitioner/${session?.resourceId}`,
                            }
                        })
                        setQuestionResponse(getResourcesFromBundle<IQuestionnaireResponse>(qResponses)[0]);
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                    message.error('Error fetching Encounter');
                })
                .finally(() => setLoading(false));
        }
    }, [id, activeTaskIndex])

    const onClickPrevious = () => {
        if (activeTaskIndex > 0) {
            router.push(`/diagnosis/${tasks[activeTaskIndex - 1].id}`);
        }
    }

    const onClickNext = () => {
        if (tasks?.length && activeTaskIndex < tasks?.length - 1) {
            router.push(`/diagnosis/${tasks[activeTaskIndex + 1].id}`);
        }
    }

    const sendForSecondOpinion = async () => {
        setSubmitting(true);
        try {
            // TODO
            // // update status to completed
            // const taskPayload: ITask = {
            //     ...activeTask,
            //     status: 'in-progress'
            // }
            // await updateFhirResource(session?.accessToken as string, taskPayload);

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

    const onSubmit = async (answers: { [key: string]: NonNullable<NonNullable<IQuestionnaire['item']>[number]['answerOption']>[number] }) => {
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
                item,
                authored: new Date().toISOString(),
            }
            await updateFhirResource(session?.accessToken as string, responsePayload);

            // update status to completed
            const taskPayload: ITask = {
                ...activeTask,
                status: 'completed'
            }
            await updateFhirResource(session?.accessToken as string, taskPayload);
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

    return <div className="flex flex-1 flex-col gap-3 m-6">
        <div className="flex align-center justify-between p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
                <Link href={'/'}>
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z" fill="#212121" />
                    </svg>
                </Link>
                <div className="text-gray-900 text-2xl leading-8">{questionnaire && questionnaire?.item ? questionnaire?.item[0]?.text : ''}</div>
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
                <p className="text-black text-base font-normal border-l border-r px-3 border-gray-100 inline-flex align-center justify-center align-bottom	leading-8">Case {(activeTaskIndex ?? 0) + 1}/{tasks?.length}</p>
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
                    <DiagnosisImage
                        medias={medias}
                        activeMediaIndex={activeMediaIndex}
                        setActiveMediaIndex={setActiveMediaIndex}
                    />
                    <DiagnosisLeftBar
                        id={id as string}
                        patient={patient}
                        encounter={encounter}
                        observations={observations}
                        medias={medias}
                        activeMediaIndex={activeMediaIndex}
                        setActiveMediaIndex={setActiveMediaIndex}
                    />
                    <DiagnosisRightBar
                        id={id as string}
                        questionnaire={questionnaire}
                        questionResponse={questionResponse}
                        status={(tasks?.length ? activeTask?.status : '') as IQuestionnaire['status'] | 'completed' | ''}
                        onSubmit={onSubmit}
                        sendForSecondOpinion={sendForSecondOpinion}
                        allowSecondOpinion={session?.userType === REMOTE_SPECIALIST}
                        isSpecialistUser={true}
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
