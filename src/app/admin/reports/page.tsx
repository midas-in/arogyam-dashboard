'use client';
import { useState } from 'react';
import { useSession } from "next-auth/react";

import { ReportsFilterModal } from '@/components/Admin/Reports/ReportsFilterModal';
import { ReportTable } from '@/components/Admin/Reports/ReportTable';
import { ReportHistoryTable } from '@/components/Admin/Reports/ReportHistoryTable';
import { SITE_COORDINATOR_USER_TYPE_CODE, SUPERVISOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE } from '@/utils/fhir-utils';


export default function Reports() {
  const { data: session } = useSession();

  const [reports, setReports] = useState<[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return <div className="w-full flex flex-col gap-8">
    <div className="py-3 border-b border-gray-100 flex justify-start items-start ">
      <h2 className="text-gray-900 text-[32px] leading-10 font-normal">Reports</h2>
    </div>

    <div className="flex-col justify-start items-start gap-8 flex">
      <div className="flex-col justify-start items-start gap-[15px] flex">
        <div className="text-black text-base font-semibold">1. Date range</div>
        <div className="justify-start items-start gap-7 inline-flex">
          <div className="w-[336px] border border-gray-100 rounded flex-col justify-start items-start gap-2 inline-flex">
            <div className="self-stretch px-4 py-[11px] justify-start items-start gap-4 inline-flex">
              <div className="grow shrink basis-0 h-6 justify-start items-start gap-4 flex">
                <p className="border-gray-900 text-base font-normal">From</p>
              </div>
              <div className="w-6 h-6 relative" >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" fill="white" />
                  <path d="M19.5 3H16.5V1.5H15V3H9V1.5H7.5V3H4.5C3.675 3 3 3.675 3 4.5V19.5C3 20.325 3.675 21 4.5 21H19.5C20.325 21 21 20.325 21 19.5V4.5C21 3.675 20.325 3 19.5 3ZM19.5 19.5H4.5V9H19.5V19.5ZM19.5 7.5H4.5V4.5H7.5V6H9V4.5H15V6H16.5V4.5H19.5V7.5Z" fill="#101010" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-[336px] border border-gray-100 rounded flex-col justify-start items-start gap-2 inline-flex">
            <div className="self-stretch px-4 py-[11px] justify-start items-start gap-4 inline-flex">
              <div className="grow shrink basis-0 h-6 justify-start items-start gap-4 flex">
                <p className="border-gray-900 text-base font-normal">To</p>
              </div>
              <div className="w-6 h-6 relative" >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" fill="white" />
                  <path d="M19.5 3H16.5V1.5H15V3H9V1.5H7.5V3H4.5C3.675 3 3 3.675 3 4.5V19.5C3 20.325 3.675 21 4.5 21H19.5C20.325 21 21 20.325 21 19.5V4.5C21 3.675 20.325 3 19.5 3ZM19.5 19.5H4.5V9H19.5V19.5ZM19.5 7.5H4.5V4.5H7.5V6H9V4.5H15V6H16.5V4.5H19.5V7.5Z" fill="#101010" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col justify-start items-start gap-4 flex">
        <div className="text-black text-base font-semibold">2. Patient Information</div>
        <div className="justify-start items-start gap-8 inline-flex">
          <div className="w-40 justify-start items-center gap-2 inline-flex">
            <input type="checkbox" id={`Habit history`} className="w-5 h-5" />
            <label htmlFor="Habit-history" className="text-base font-normal">Habit history</label>
          </div>
          <div className="w-40 justify-start items-center gap-2 inline-flex">
            <input type="checkbox" id='Oral-examination' className="w-5 h-5" />
            <label htmlFor="Oral-examination" className="text-base font-normal">Oral examination</label>
          </div>
          <div className="w-40 justify-start items-center gap-2 inline-flex">
            <input type="checkbox" id='Images' className="w-5 h-5" />
            <label htmlFor="Images" className="text-base font-normal">Images</label>
          </div>
        </div>
      </div>
      <div className="flex-col justify-start items-start gap-4 flex">
        <div className="text-black text-base font-semibold">3. Specialist diagnosis</div>
        <div className="justify-start items-start gap-8 inline-flex">
          <div className="w-[54px] justify-start items-center gap-2 inline-flex">
            <input type="checkbox" id='Yes' className="w-5 h-5" />
            <label htmlFor="Yes" className="text-base font-normal">Yes</label>
          </div>
          <div className="w-[54px] justify-start items-center gap-2 inline-flex">
            <input type="checkbox" id='No' className="w-5 h-5" />
            <label htmlFor="No" className="text-base font-normal">No</label>
          </div>
        </div>
      </div>
    </div>

    <div className="justify-center items-start gap-1 flex">
      <button className="w-[142px] h-[44px] rounded border border-primary-300 flex-col justify-center items-center flex text-primary-300 text-sm font-semibold leading-tight">
        Reset
      </button>
      <button className="w-[142px] h-[44px] bg-primary-300 rounded flex-col justify-center items-center flex text-white text-sm font-semibold leading-tight">
        Show report
      </button>
    </div>

    <div className="self-stretch border-t border-gray-100" />

    <div className="flex flex-col">
      {session?.userType && [SUPERVISOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE].includes(session?.userType) &&
        <>
          <div className="h-[50px] py-2 justify-between items-center inline-flex">
            <p className="text-gray-900 text-2xl font-normal">Generated report</p>
            <ReportsFilterModal />
          </div>
          <ReportTable
            data={Array(5).fill(5)}
            currentPage={currentPage}
            itemsPerPage={limit}
            totalItems={5}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </>}

      {session?.userType === SITE_COORDINATOR_USER_TYPE_CODE &&
        <>
          <div className="h-[50px] py-2 justify-between items-center inline-flex">
            <p className="text-gray-900 text-2xl font-normal">Reports History</p>
          </div>
          <ReportHistoryTable
            data={Array(5).fill(5)}
            currentPage={currentPage}
            itemsPerPage={limit}
            totalItems={5}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </>}

    </div>
  </div>
}
