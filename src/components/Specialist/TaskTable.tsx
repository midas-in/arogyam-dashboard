import React from 'react';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { Loader } from "@/components/UI/Loader";
import { getAge, formatDate } from "@/utils";

interface IExtendedTask extends ITask {
    patient: IPatient;
    encounterData: IEncounter;
}

interface TaskTableProps {
    data?: IExtendedTask[];
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onClick: (id: string) => void;
    showLabelledOn?: boolean;
    loading?: boolean;
}

const TaskTable = (props: TaskTableProps) => {
    const { loading, data, currentPage, itemsPerPage, totalItems, onPageChange, onClick, showLabelledOn } = props;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className='mt-4'>
            <ul className='border border-gray-3 rounded'>
                <li className="flex items-center justify-between mb-2 bg-primary-10 border-b border-gray-3 py-2 px-4">
                    <span className="flex-1 font-semibold text-gray-900 text-base py-2">Case ID</span>
                    <span className="w-[140px] font-semibold text-gray-900 text-base py-2">Age</span>
                    <span className="w-[140px] font-semibold text-gray-900 text-base py-2">Gender</span>
                    <span className="w-[140px] font-semibold text-gray-900 text-base py-2">Captured on</span>
                    {showLabelledOn && <span className="w-[200px] font-semibold text-gray-900 text-base py-2">Labelled on</span>}
                    <span className="w-[100px] font-semibold text-gray-900 text-base py-2 pl-1">Action</span>
                </li>
                {loading
                    ? <div className='relative min-h-[200px]'><Loader /></div>
                    : data && data?.length > 0
                        ? data?.map((task, i) => (
                            <li key={i} className="flex items-center justify-between mb-2 border-b last:border-b-0 border-gray-3 py-2 px-4">
                                <span className="flex-1 font-normal text-gray-900 text-base">{task?.for?.reference?.split('/')[1]}</span>
                                <span className="w-[140px] font-normal text-gray-900 text-base">{task?.patient?.birthDate ? getAge(task?.patient?.birthDate) : '-'}</span>
                                <span className="w-[140px] font-normal text-gray-900 text-base capitalize">{task?.patient?.gender ?? '-'}</span>
                                <span className="w-[140px] font-normal text-gray-900 text-base">{task?.patient?.extension && task?.patient.extension[0]?.valueDateTime ? formatDate(task.patient.extension[0]?.valueDateTime) : '-'}</span>
                                {showLabelledOn && <span className="w-[200px] font-normal text-gray-900 text-base">-</span>}
                                <div className='w-[100px]'>
                                    <button onClick={() => { onClick(task.id as string); }} className="ml-1 bg-primary-400 text-white text-sm font-semilight py-1 px-4 rounded">
                                        View
                                    </button>
                                </div>
                            </li>
                        ))
                        : <div className='min-h-[200px] flex items-center justify-center'>
                            <p className='text-gray-900'>There are no tasks</p>
                        </div>}
            </ul>
            {data && data.length > 0 && <div className="flex justify-between items-center mt-4 bg-primary-10 border border-gray-3 rounded text-gray-600">
                <span className="font-light text-sm py-2 px-4">
                    {`${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
                </span>
                <div className='flex items-center '>
                    <span className="font-light text-sm border-l border-gray-3 py-3 px-4 text-gray-900 text-center h-full">
                        <select
                            className='bg-primary-10 mr-1'
                            value={currentPage}
                            onChange={(e) => onPageChange(Number(e.target.value))}
                        >
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                        <span className="font-light text-sm text-gray-900 text-center">
                            of {totalPages} pages
                        </span>
                    </span>
                    <button
                        className="text-gray-800 font-bold py-2 px-4 border-l border-gray-3 disabled:opacity-30"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <span className="material-symbols-outlined mt-1">arrow_left</span>
                    </button>
                    <button
                        className="text-gray-800 font-bold py-2 px-4 border-l border-gray-3 disabled:opacity-30"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        <span className="material-symbols-outlined mt-1">arrow_right</span>
                    </button>
                </div>
            </div>}
        </div>
    );
};

export { TaskTable };