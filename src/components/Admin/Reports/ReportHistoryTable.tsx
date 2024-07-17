import React from 'react';
import { Loader } from "@/components/UI/Loader";

interface ReportHistoryTableProps {
  data?: object[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onClick?: (id: string) => void;
  loading?: boolean;
}

const COLUMNS = [
  {
    id: 'id',
    name: 'Report type',
    width: 300
  },
  {
    id: 'date',
    name: 'Date range',
    width: 300
  },
  {
    id: 'username',
    name: 'Sites selected',
    width: 300
  },
  {
    id: 'age',
    name: 'Generated on',
    width: 300
  },
  {
    id: 'action',
    name: 'Action',
    width: 200,
  },
]

const ReportHistoryTable = (props: ReportHistoryTableProps) => {
  const { loading, data, currentPage, itemsPerPage, totalItems, onPageChange } = props;

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

  if (loading) {
    return <div className='relative min-h-[200px]'><Loader /></div>
  }

  if (!loading && data && data?.length === 0) {
    return <div className="relative mt-4 h-11 p-2.5 bg-gray-25 block w-fit">
      <p className="text-gray-900 text-base font-normal ">Your reports will be shown here</p>
    </div>
  }

  return (
    <div className='relative mt-4'>
      <div className=''>
        <div className="flex min-w-full">
          {COLUMNS.map((column, i) => {
            return <div key={column.id}
              className={`w-2/6 last:w-1/6 bg-primary-10 font-semibold text-gray-800 text-base py-3 px-4 border-t first:border-l border-r-0 last:border-r border-b border-gray-100`}>
              {column.name}
            </div>
          })}
        </div>
        {data && data?.length > 0 && data?.map((report: any, i) => (
          <div key={i} className="flex min-w-full">
            {COLUMNS.map((column, i) => {
              return <div key={column.id}
                className={`w-2/6 last:w-1/6 font-normal text-gray-800 text-base py-3 px-4 first:border-l border-r-0 last:border-r border-b border-gray-100`}>
                {column.id === 'action'
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='cursor-pointer'>
                    <rect width="24" height="24" fill="white" style={{ mixBlendMode: 'multiply' }} />
                    <path d="M19.5 18V21H4.5V18H3V21C3 21.3978 3.15804 21.7794 3.43934 22.0607C3.72064 22.342 4.10218 22.5 4.5 22.5H19.5C19.8978 22.5 20.2794 22.342 20.5607 22.0607C20.842 21.7794 21 21.3978 21 21V18H19.5Z" fill="#38476D" />
                    <path d="M19.5 10.5L18.4425 9.4425L12.75 15.1275V1.5H11.25V15.1275L5.5575 9.4425L4.5 10.5L12 18L19.5 10.5Z" fill="#38476D" />
                  </svg>
                  : report[column.id] ?? 'empty'}
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

export { ReportHistoryTable };
