import React from 'react';
import { useSession } from "next-auth/react";

import { Loader } from "@/components/UI/Loader";
import { COLUMNS } from './ReportColumnConfig';

interface ReportTableProps {
  data?: object[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}


const ReportTable = (props: ReportTableProps) => {
  const { loading, data, currentPage, itemsPerPage, totalItems, onPageChange } = props;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { data: session } = useSession();

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

  if (loading) {
    return <div className='relative min-h-[200px]'><Loader /></div>
  }

  if (!loading && data && data?.length === 0) {
    return <div className="relative mt-4 h-11 p-2.5 bg-gray-25 block w-fit">
      <p className="text-gray-900 text-base font-normal ">Your report will be shown here</p>
    </div>
  }

  return (
    <div className='relative mt-4 w-[calc(100vw-360px)]'>
      {/* Fixed first row */}
      <div className='absolute top-0 left-0 bg-white first-column-shadow'>
        <div key={COLUMNS[0].id}
          className={`w-[${COLUMNS[0].width}px] truncate bg-primary-10 font-semibold text-gray-800 text-base py-3 px-4 border border-r-0 border-gray-100`}>
          {COLUMNS[0].name}
        </div>
        {data?.map((report: any, i) => (
          <div key={COLUMNS[0].id + i}
            className={`w-[${COLUMNS[0].width}px] truncate font-normal text-gray-800 text-base py-3 px-4 border-l border-b border-gray-100`}>
            {report[COLUMNS[0].id] ?? '-'}
          </div>
        ))}
      </div>
      <div className='pb-4 overflow-x-auto gray-scroll whitespace-nowrap'>
        <div className="flex min-w-full">
          {COLUMNS.slice(1).map((column, i) => {
            return <div key={column.id + i}
              className={`${i == 0 ? 'ml-[200px]' : ''} flex-shrink-0 w-[${column.width}px] bg-primary-10 font-semibold text-gray-800 text-base py-3 px-4 border-t border-r-0 last:border-r border-b border-gray-100`}>
              {column.name}
            </div>
          })}
        </div>
        {data && data?.length > 0 && data?.map((report: any, i) => (
          <div key={i} className="flex min-w-full">
            {COLUMNS.slice(1).map((column, i) => {
              return <div key={column.id}
                className={`${i == 0 ? 'ml-[200px]' : ''} flex-shrink-0 w-[${column.width}px] truncate font-normal text-gray-800 text-base py-3 px-4 last:border-r border-b border-gray-100`}>
                {column.getValue(report, session?.accessToken) ?? '-'}
              </div>
            })}
          </div>
        ))}
      </div>

      {data && data.length > 0 && <div className="flex justify-between items-center mt-4 bg-primary-10 border border-gray-100 rounded">
        <span className="font-light text-sm py-2 px-4">
          {`${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} items`}
        </span>
        <div className='flex items-center'>
          <span className="font-light text-sm border-l border-gray-100 py-3 px-4 text-gray-800 text-center h-full">
            <select
              className='bg-primary-10 mr-1'
              value={currentPage}
              onChange={(e) => onPageChange(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>
            <span className="font-light text-sm text-gray-800 text-center">
              of {totalPages} pages
            </span>
          </span>
          <button
            className="text-gray-800 font-bold py-2 px-4 border-l border-gray-100 disabled:opacity-30"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <span className="material-symbols-outlined mt-1">arrow_left</span>
          </button>
          <button
            className="text-gray-800 font-bold py-2 px-4 border-l border-gray-100 disabled:opacity-30"
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

export { ReportTable };
