import React from 'react';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { Loader } from "@/components/UI/Loader";

interface TaskTableProps {
    data?: ITask[];
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onClick: (id: string) => void;
    loading?: boolean;
}

const TaskTable = ({ loading, data, currentPage, itemsPerPage, totalItems, onPageChange, onClick }: TaskTableProps) => {
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
                    <span className="font-semibold text-gray-900 text-base py-2">Image ID</span>
                    <div className='w-[100px]'>
                        <span className="font-semibold text-gray-900 text-base py-2">Action</span>
                    </div>
                </li>
                {loading
                    ? <div className='relative min-h-[200px]'><Loader /></div>
                    : data && data?.length > 0
                        ? data?.map((task, i) => (
                            <li key={i} className="flex items-center justify-between mb-2 border-b last:border-b-0 border-gray-3 py-2 px-4">
                                <span className="font-normal text-gray-900 text-base">{task?.id}</span>
                                <div className='w-[100px]'>
                                    <button onClick={() => { onClick(task.id as string); }} className="bg-primary-400 text-white text-sm font-semilight py-1 px-4 rounded">
                                        View
                                    </button>
                                </div>
                            </li>
                        )) : <div className='min-h-[200px] flex items-center justify-center'>
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
                        className="text-gray-800 font-bold py-2 px-4 border-l border-gray-3"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <span className="material-symbols-outlined mt-1">arrow_left</span>
                    </button>
                    <button
                        className="text-gray-800 font-bold py-2 px-4 border-l border-gray-3"
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
