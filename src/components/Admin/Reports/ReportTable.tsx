import React from 'react';
import { useSession } from "next-auth/react";

import { Loader } from "@/components/UI/Loader";
import { getAge, formatDate, capitalizeFirstLetter } from "@/utils";

interface ReportTableProps {
  data?: object[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const COLUMNS = [
  {
    id: 'id',
    name: 'Unique case ID',
    width: 200,
    getValue: (data: any) => data.id
  },
  {
    id: 'meta.lastUpdated',
    name: 'Date of case registered',
    width: 200,
    getValue: (data: any) => formatDate(data.meta.lastUpdated)
  },
  {
    id: 'username',
    name: 'FLW username',
    width: 200,
    getValue: (data: any) => data.generalPractitioner ? data.generalPractitioner[0].reference.split("/")[1] : '-'
  },
  {
    id: 'age',
    name: 'Age',
    width: 200,
    getValue: (data: any) => data.birthDate ? getAge(data?.birthDate) : '-'
  },
  {
    id: 'gender',
    name: 'Gender',
    width: 200,
    getValue: (data: any) => capitalizeFirstLetter(data.gender),
  },
  {
    id: 'cigarette/bidi',
    name: 'Cigarette/Bidi',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Cigarette/Bidi'] : '-'
  },
  {
    id: 'smokeless-tobacco',
    name: 'Smokeless tobacco',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Smokeless Tobacco'] : '-'
  },
  {
    id: 'areca-nut',
    name: 'Areca nut',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Areca Nut'] : '-'
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.habitHistory['Alcohol'] : '-'
  },
  {
    id: 'open-mouth',
    name: 'Able to open mouth',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.oralExaminations['Able to open mouth?'] : '-'
  },
  {
    id: 'lesion-patch',
    name: 'Lesion/patch',
    width: 200,
    getValue: (data: any) => data.habitHistory ? data.oralExaminations['Lesion/Patch'] : '-'
  },
  // {
  //   id: 'specialist-diagnosis',
  //   name: 'Specialist diagnosis',
  //   width: 200,
  //   getValue: (data: any) => data.meta.lastUpdated
  // },
  {
    id: 'image-1',
    name: 'Image 1',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 1'] ? <a className='text-primary-400' href={`${data.images['Image 1']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-2',
    name: 'Image 2',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 2'] ? <a className='text-primary-400' href={`${data.images['Image 2']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-3',
    name: 'Image 3',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 3'] ? <a className='text-primary-400' href={`${data.images['Image 3']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-4',
    name: 'Image 4',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 4'] ? <a className='text-primary-400' href={`${data.images['Image 4']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-5',
    name: 'Image 5',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 5'] ? <a className='text-primary-400' href={`${data.images['Image 5']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-6',
    name: 'Image 6',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 6'] ? <a className='text-primary-400' href={`${data.images['Image 6']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-7',
    name: 'Image 7',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 7'] ? <a className='text-primary-400' href={`${data.images['Image 7']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-8',
    name: 'Image 8',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 8'] ? <a className='text-primary-400' href={`${data.images['Image 8']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-9',
    name: 'Image 9',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 9'] ? <a className='text-primary-400' href={`${data.images['Image 9']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-10',
    name: 'Image 10',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 10'] ? <a className='text-primary-400' href={`${data.images['Image 10']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-11',
    name: 'Image 11',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 11'] ? <a className='text-primary-400' href={`${data.images['Image 11']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-12',
    name: 'Image 12',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 12'] ? <a className='text-primary-400' href={`${data.images['Image 12']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
  {
    id: 'image-13',
    name: 'Image 13',
    width: 200,
    getValue: (data: any, accessToken?: string) => data.images && data.images['Image 13'] ? <a className='text-primary-400' href={`${data.images['Image 13']}&authToken=${accessToken}`} target='_blank'>view</a> : '-'
  },
];

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
