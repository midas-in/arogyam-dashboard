'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { message } from 'antd';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { CustomModal } from '@/components/UI/CustomModal';
import { Loader } from "@/components/UI/Loader";
import { fetchFhirResource, fetchReports } from '@/app/loader';
import { PRACTITIONER_USER_TYPE_CODE, getResourcesFromBundle } from '@/utils/fhir-utils';
import { formatDate, formatDateTime } from "@/utils";

const COLUMNS = [
  {
    id: 'flw-name',
    name: 'FLW name',
    widthClass: 'flex-1',
    getValue: (data: any) => data.practitioner.reference?.split('/')[1]
  },
  {
    id: 'cases-count',
    name: 'No. of cases registered',
    widthClass: 'w-[240px]',
    getValue: (data: any) => data.casesCount
  },
  {
    id: 'images-count',
    name: 'No. of images captured',
    widthClass: 'w-[240px]',
    getValue: (data: any) => data.capturedImagesCount
  },
]

interface IExtendedPractitionerRole extends IPractitionerRole {
  casesCount: number;
  capturedImagesCount: number;
}

const PerformanceReport = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [datePickerState, setDatePickerState] = useState(
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  );
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFLWs = async () => {
    if (session && session.accessToken) {
      try {
        setLoading(true);
        const data: IBundle = await fetchFhirResource(session?.accessToken, { resourceType: 'PractitionerRole', query: { role: PRACTITIONER_USER_TYPE_CODE, active: true } })
        const practitionerRoles = getResourcesFromBundle<IExtendedPractitionerRole>(data);

        await Promise.all(practitionerRoles.map(async (practitionerRole) => {
          const casesParams: any = {
            'general-practitioner': practitionerRole.practitioner?.reference,
            _summary: 'count'
          }
          if (startDate && endDate) {
            casesParams['registration-date'] = [`gt${new Date(startDate).toISOString()}`, `le${new Date(endDate).toISOString()}`]
          }
          const casesData = await fetchReports(session?.accessToken as string, casesParams);
          practitionerRole.casesCount = casesData.total ?? 0;
          const mediaParams: any = {
            'type': 'http://terminology.hl7.org/CodeSystem/media-type|image',
            'operator': practitionerRole.practitioner?.reference,
            _summary: 'count'
          }
          if (startDate && endDate) {
            mediaParams['created'] = [`gt${new Date(startDate).toISOString()}`, `le${new Date(endDate).toISOString()}`]
          }
          const data: IBundle = await fetchFhirResource(session?.accessToken as string, { resourceType: 'Media', query: mediaParams })
          practitionerRole.capturedImagesCount = data.total ?? 0;
        }));
        setData(practitionerRoles);
      }
      catch (error) {
        message.error("Failed to fetch data");
      }
      finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchFLWs();
  }, [startDate, endDate])

  const applyFilter = () => {
    setIsOpen(false);
    setStartDate(datePickerState.startDate);
    setEndDate(datePickerState.endDate);
  }

  return <div className="w-full flex flex-col gap-8">
    <div className="py-3 border-b border-gray-100 flex justify-between items-center">
      <h2 className="text-gray-900 text-[28px] leading-9 font-normal">FLW Performance Tracking</h2>
      <div className='flex items-center gap-[10px]'>
        <p className='text-gray-600 text-base font-normal'>Last Updated: {formatDateTime(new Date())}</p>
        <div className="self-stretch border-r border-[#c6c6c6]"></div>
        <div
          className="w-64 h-9 px-3 py-1.5 bg-gray-25 rounded border border-gray-100 justify-between items-center inline-flex cursor-pointer"
          onClick={() => setIsOpen(true)}>
          <p className="text-gray-900 text-base font-normal leading-normal">
            {startDate && endDate ? `${formatDate(startDate, '/')} - ${formatDate(endDate, '/')}` : 'All time'}
          </p>
          <div className="w-5 h-5 relative" >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.99955 10.9763L14.1244 6.85156L15.3029 8.03007L9.99955 13.3334L4.69629 8.03007L5.8748 6.85156L9.99955 10.9763Z" fill="#101010" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div className="min-h-[200px] relative border border-gray-100 rounded">
      {loading && <Loader className='bg-gray-3' />}
      <div className="flex min-w-full">
        {COLUMNS.map((column, i) => {
          return <div key={column.id + i}
            className={`${column.widthClass} flex-shrink-0 bg-primary-10 font-semibold text-gray-900 text-base py-3 px-4`}>
            {column.name}
          </div>
        })}
      </div>
      {data && data?.length > 0 && data?.map((report: any, i: number) => (
        <div key={i} className="flex min-w-full">
          {COLUMNS.map((column, i) => {
            return <div key={column.id}
              className={`${column.widthClass} flex-shrink-0 truncate font-normal text-gray-800 text-base py-3 px-4 border-t border-gray-100`}>
              {column.getValue(report) ?? '-'}
            </div>
          })}
        </div>
      ))}
    </div>

    <CustomModal isOpen={isOpen} >
      <div className='bg-white p-4'>
        <DateRangePicker
          editableDateInputs={false}
          onChange={(item: any) => setDatePickerState(item.selection)}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={[datePickerState]}
          direction="horizontal"
          maxDate={new Date()}
        />
        <div className='flex gap-4 items-center justify-center border-t border-gray-100 pt-4'>
          <button className='bg-gray-200 text-black font-medium px-4 py-2 rounded' onClick={() => setIsOpen(false)} disabled={loading}>Cancel</button>
          <button className='bg-primary-400 text-white font-medium px-4 py-2 rounded' onClick={() => applyFilter()} disabled={loading}>Apply</button>
        </div>
      </div>
    </CustomModal>
  </div>
}
export default PerformanceReport;