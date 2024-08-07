'use client';
import { useState, useEffect, forwardRef } from 'react';
import { useSession } from "next-auth/react";
import { message } from 'antd';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ReportsFilterModal } from '@/components/Admin/Reports/ReportsFilterModal';
import { ReportTable } from '@/components/Admin/Reports/ReportTable';
import { ReportHistoryTable } from '@/components/Admin/Reports/ReportHistoryTable';
import { SITE_COORDINATOR_USER_TYPE_CODE, SUPERVISOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE } from '@/utils/fhir-utils';
import { fetchReports } from '@/app/loader';
import { getResourcesFromBundle, DIAGNOSIS_RESULTS_MAPPING } from '@/utils/fhir-utils';

interface CustomDateInputProps {
  value?: string;
  onClick?: () => void;
  title: string;
}
// eslint-disable-next-line react/display-name
const CustomDateInput = forwardRef<HTMLDivElement, CustomDateInputProps>(
  ({ value, onClick, title }, ref) => (
    <div onClick={onClick} ref={ref} className="w-[336px] border border-gray-100 rounded flex-col justify-start items-start gap-2 inline-flex">
      <div className="self-stretch px-4 py-[11px] justify-start items-start gap-4 inline-flex">
        <div className="grow shrink basis-0 h-6 justify-start items-start gap-4 flex">
          <p className="text-gray-800 text-base font-normal">{value ?? title}</p>
        </div>
        <div className="w-6 h-6 relative" >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="white" />
            <path d="M19.5 3H16.5V1.5H15V3H9V1.5H7.5V3H4.5C3.675 3 3 3.675 3 4.5V19.5C3 20.325 3.675 21 4.5 21H19.5C20.325 21 21 20.325 21 19.5V4.5C21 3.675 20.325 3 19.5 3ZM19.5 19.5H4.5V9H19.5V19.5ZM19.5 7.5H4.5V4.5H7.5V6H9V4.5H15V6H16.5V4.5H19.5V7.5Z" fill="#101010" />
          </svg>
        </div>
      </div>
    </div>
  ),
);

export default function Reports() {
  const { data: session } = useSession();

  const [reports, setReports] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [reportFetched, setReportFetched] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>({});
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (session?.accessToken) {
      setReportFetched(true);
      fetchReportData();
    }
  }, [currentPage, limit, JSON.stringify(filter)])

  const getCommonParams = () => {
    const commonParams = {
      ...filter,
      _revinclude: 'QuestionnaireResponse:subject',
      _sort: '-registration-date',
    }
    if (startDate && endDate) {
      commonParams['registration-date'] = [`gt${new Date(startDate).toISOString().split('T')[0]}`, `lt${new Date(endDate).toISOString().split('T')[0]}`]
    }
    return commonParams;
  }
  const fetchReportData = (forcedCurrentPage?: number) => {
    if (session?.accessToken) {
      setLoading(true);
      const commonParams = getCommonParams();
      const params = {
        ...commonParams,
        _count: limit,
        _getpagesoffset: ((forcedCurrentPage ?? currentPage) - 1) * limit,
      }
      fetchReports(session.accessToken, params)
        .then((data: IBundle) => {
          const allData = getResourcesFromBundle<any>(data);
          const cases = allData.filter(d => d.resourceType === 'Patient');
          cases.forEach(c => {
            const questionnaireResponse = allData.find(d => {
              return d.resourceType === "QuestionnaireResponse" &&
                d.subject.reference === `Patient/${c.id}` &&
                d.questionnaire === 'Questionnaire/OralCancerPatientRegistration'
            });
            if (questionnaireResponse) {
              // Extract basic info question answers
              const basicInfoGroup = questionnaireResponse?.item.find((i: any) => i.linkId === 'basic-info-group');
              const basicInfo = basicInfoGroup?.item.reduce((prev: any, curr: any) => {
                return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueCoding?.display ?? curr.answer[0].valueString ?? curr.answer[0].valueInteger : '' });
              }, {});
              c.basicInfo = basicInfo;
              // Extract habit history question answers
              const habitHistoryGroup = questionnaireResponse?.item.find((i: any) => i.linkId === 'habit-history-group');
              const habitHistory = habitHistoryGroup?.item.reduce((prev: any, curr: any) => {
                return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueCoding?.display : '' });
              }, {});
              c.habitHistory = habitHistory;
              // Extract screening info like oral examination and images
              const screeningGroup = questionnaireResponse?.item.find((i: any) => i.linkId === 'screening-group');
              const screeningOralExamination = screeningGroup?.item.find((i: any) => i.linkId === 'patient-screening-question-group');
              const oralExaminations = screeningOralExamination?.item.reduce((prev: any, curr: any) => {
                return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueCoding?.display : '' });
              }, {});
              c.oralExaminations = oralExaminations;
              const screeningImages = screeningGroup?.item.find((i: any) => i.linkId === 'patient-screening-image-group');
              const images = screeningImages?.item.reduce((prev: any, curr: any) => {
                return Object.assign({}, prev, { [curr.text]: curr.answer ? curr.answer[0].valueAttachment?.url : '' });
              }, {});
              c.images = images;
            }
            const diagnosisQuestionnaireResponse = allData.find(d => {
              return d.resourceType === "QuestionnaireResponse" &&
                d.subject.reference === `Patient/${c.id}` &&
                (d.questionnaire === 'https://midas.iisc.ac.in/fhir/Questionnaire/OralCancerScreenPatient'
                  || d.questionnaire === 'https://midas.iisc.ac.in/fhir/Questionnaire/OralCancerLabelImage')
            });

            if (diagnosisQuestionnaireResponse) {
              const provisionalDiagnosis = diagnosisQuestionnaireResponse?.item.find((i: any) => i.linkId === 'provisional-diagnosis');
              const selectedOption: string = provisionalDiagnosis?.answer ? provisionalDiagnosis?.answer[0].valueCoding.display.toLowerCase() : null;
              c.provisionalDiagnosis = DIAGNOSIS_RESULTS_MAPPING[selectedOption]?.isSuspicious ? 'Suspicious' : 'Non suspicious';
              const recommendation = diagnosisQuestionnaireResponse?.item.find((i: any) => i.linkId === 'recommendation');
              c.recommendation = recommendation?.answer ? recommendation?.answer[0].valueCoding.display : null;
            }
          })
          setReports(cases);
        })
        .catch((error: any) => {
          console.log(error);
          message.error('Error fetching Report Data');
        })
        .finally(() => setLoading(false));

      fetchReports(session.accessToken, { ...commonParams, _summary: 'count' })
        .then((data: IBundle) => {
          setTotalItems(data.total || 0);
        })
        .catch((error: any) => {
          console.log(error);
          message.error('Error fetching Report count');
        })
        .finally(() => setLoading(false));
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const showReportBtnClick = () => {
    setReportFetched(true);
    setCurrentPage(1);
    fetchReportData(1);
  }

  const resetBtnClick = () => {
    setReports([]);
    setTotalItems(0);
    setStartDate(null);
    setEndDate(null);
    setReportFetched(false);
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const params = getCommonParams();
      const response = await fetch('/dashboard/api/download-report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'userType': `${session?.userType}`,
        },
        body: JSON.stringify({ params }),
      });
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cases.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.log('Download failed', error)
      message.error('Failed to download CSV. Please try again.');
    }
    finally {
      setIsDownloading(false);
    }
  };

  return <div className="w-full flex flex-col gap-8">
    <div className="py-3 border-b border-gray-100 flex justify-start items-start ">
      <h2 className="text-gray-900 text-[32px] leading-10 font-normal">Reports</h2>
    </div>

    <div className="flex-col justify-start items-start gap-8 flex">
      <div className="flex-col justify-start items-start gap-[15px] flex">
        <div className="text-black text-base font-semibold">1. Date range</div>
        <div className="flex gap-7">
          <div className="">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomDateInput title="From" />}
            />
          </div>
          <div className="">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              customInput={<CustomDateInput title="To" />}
            />
          </div>
        </div>
      </div>

      {/* <div className="flex-col justify-start items-start gap-4 flex">
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
      </div> */}
      {/* <div className="flex-col justify-start items-start gap-4 flex">
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
      </div> */}
    </div>

    <div className="justify-center items-start gap-4 flex">
      <button
        className="w-[142px] h-[44px] rounded border border-primary-300 flex-col justify-center items-center flex text-primary-300 text-sm font-semibold leading-tight disabled:opacity-50"
        onClick={resetBtnClick} disabled={!reportFetched}>
        Reset
      </button>
      <button
        className="w-[142px] h-[44px] bg-primary-300 rounded flex-col justify-center items-center flex text-white text-sm font-semibold leading-tight"
        onClick={showReportBtnClick}
        disabled={loading}
      >
        Show report
      </button>
    </div>

    <div className="self-stretch border-t border-gray-100" />

    <div className="flex flex-col">
      {/* {session?.userType && [SUPERVISOR_USER_TYPE_CODE, SITE_ADMIN_TYPE_CODE].includes(session?.userType) && */}
      {/* <> */}
      <div className="h-[50px] py-2 justify-between items-center inline-flex">
        <div className='flex align-items-center'>
          <p className="text-gray-900 text-2xl font-normal">Generated report</p>
          {reportFetched && session?.userType === SITE_COORDINATOR_USER_TYPE_CODE &&
            <button
              className="ml-8 px-2 rounded border border-primary-300 justify-center items-center flex text-primary-300 text-sm font-normal leading-4 disabled:bg-gray-100 disabled:border-gray-100 disabled:text-white "
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 22" fill="none" className='cursor-pointer fill-current'>
                <rect width="24" height="24" fill="white" style={{ mixBlendMode: 'multiply' }} />
                <path d="M19.5 18V21H4.5V18H3V21C3 21.3978 3.15804 21.7794 3.43934 22.0607C3.72064 22.342 4.10218 22.5 4.5 22.5H19.5C19.8978 22.5 20.2794 22.342 20.5607 22.0607C20.842 21.7794 21 21.3978 21 21V18H19.5Z" />
                <path d="M19.5 10.5L18.4425 9.4425L12.75 15.1275V1.5H11.25V15.1275L5.5575 9.4425L4.5 10.5L12 18L19.5 10.5Z" />
              </svg>
              <span className='ml-1'>Download csv</span>
            </button>
          }
        </div>
        {reportFetched && <ReportsFilterModal setFilter={setFilter} />}
      </div>
      <ReportTable
        data={reports}
        currentPage={currentPage}
        itemsPerPage={limit}
        totalItems={totalItems ?? 0}
        onPageChange={handlePageChange}
        loading={loading}
      />
      {/* </>} */}

      {/* {session?.userType === SITE_COORDINATOR_USER_TYPE_CODE &&
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
        </>} */}

    </div>
  </div>
}
