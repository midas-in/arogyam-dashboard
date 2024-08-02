'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { message } from 'antd';
import { IQuestionnaire } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IQuestionnaire';

import { CustomModal } from '@/components/UI/CustomModal';
import { fetchFhirSingleResource } from '@/app/loader';
import { OBSERVATION_CODE_LABEL_MAPPING_REVERSE } from '@/utils/fhir-utils';

const ReportsFilterModal = ({ setFilter }: { setFilter: (params: any) => void }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuestionnaire, setFilterQuestionnaire] = useState<any>([]);
  const [selectedFilter, setSelectedFilter] = useState<any>({});

  useEffect(() => {
    if (session?.accessToken) {
      fetchFhirSingleResource(session.accessToken, { resourceType: 'Questionnaire', id: 'OralCancerPatientRegistration' })
        .then((questionnaire: IQuestionnaire) => {
          const fQuestionnaire: any = [
            { text: 'Username', answerOption: [{ valueCoding: { code: 'Practitioner/flw1', display: 'flw1' } }] },
            {
              text: 'Gender',
              answerOption: [
                {
                  "valueCoding": {
                    "system": "http://hl7.org/fhir/administrative-gender",
                    "code": "male",
                    "display": "Male"
                  }
                },
                {
                  "valueCoding": {
                    "system": "http://hl7.org/fhir/administrative-gender",
                    "code": "female",
                    "display": "Female"
                  }
                },
                {
                  "valueCoding": {
                    "system": "http://hl7.org/fhir/administrative-gender",
                    "code": "other",
                    "display": "Other"
                  }
                }
              ]
            }
          ];
          const habitHistoryGroup = questionnaire?.item?.find(i => i.linkId === 'habit-history-group');
          const screeningGroup = questionnaire?.item?.find((i: any) => i.linkId === 'screening-group');
          const screeningOralExamination = screeningGroup?.item?.find((i: any) => i.linkId === 'patient-screening-question-group');
          if (habitHistoryGroup?.item) fQuestionnaire.push(...habitHistoryGroup?.item)
          if (screeningOralExamination?.item) fQuestionnaire.push(...screeningOralExamination?.item)
          setFilterQuestionnaire(fQuestionnaire);
        })
        .catch((error: any) => message.error('Error fetching Filter questionnaire'));
    }
  }, [session?.accessToken])

  const onFilterChange = (title: string, option: any) => (e: any) => {
    const payload = { ...selectedFilter };
    let key = '', value = option.valueCoding.code;
    if (title === 'Username') {
      key = 'general-practitioner';
    } else if (title === 'Gender') {
      key = 'gender';
    } else {
      key = '_has:Observation:subject:code-value-concept';
      value = `${OBSERVATION_CODE_LABEL_MAPPING_REVERSE[title]}$${option.valueCoding.code}`;
    }
    if (e.target.checked) {
      if (!payload[key]) {
        payload[key] = value;
      } else if (Array.isArray(payload[key])) {
        payload[key].push(value);
      }
      else {
        payload[key] = [payload[key], value]
      }
    }
    else {
      if (Array.isArray(payload[key])) {
        const index = payload[key].indexOf(value);
        if (index > -1) {
          payload[key].splice(index, 1);
        }
      }
      else {
        delete payload[key];
      }
    }
    setSelectedFilter(payload);
  }

  const resetFilter = () => {
    setFilter({});
    setIsOpen(false);
  }

  const applyFilter = () => {
    setFilter(selectedFilter);
    setIsOpen(false);
  }

  return <>
    <div className="px-[15px] py-1 rounded-sm border border-gray-100 justify-center items-center gap-2 flex cursor-pointer" onClick={() => setIsOpen(true)}>
      <p className="text-center text-gray-900 text-base font-normal">Filters</p>
      <div className="w-6 h-6 relative" >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" fill="white" />
          <path d="M13.5 21H10.5C10.1022 21 9.72064 20.842 9.43934 20.5607C9.15804 20.2794 9 19.8978 9 19.5V13.8075L3.4425 8.25C3.16081 7.96999 3.00167 7.58968 3 7.1925V4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H19.5C19.8978 3 20.2794 3.15804 20.5607 3.43934C20.842 3.72064 21 4.10218 21 4.5V7.1925C20.9983 7.58968 20.8392 7.96999 20.5575 8.25L15 13.8075V19.5C15 19.8978 14.842 20.2794 14.5607 20.5607C14.2794 20.842 13.8978 21 13.5 21ZM4.5 4.5V7.1925L10.5 13.1925V19.5H13.5V13.1925L19.5 7.1925V4.5H4.5Z" fill="#101010" />
        </svg>
      </div>
    </div>
    <CustomModal isOpen={isOpen} >
      <div className="z-10 w-[629px] h-2/3 relative bg-white">
        <div className="h-[48px] px-6 py-2.5 shadow border-b border-gray-100 justify-between items-center flex">
          <p className="text-gray-900 text-xl font-normal leading-7">Filters-Reports</p>
          <div className="w-5 h-5 relative cursor-pointer" onClick={() => setIsOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9.99983 8.82404L14.1247 4.69922L15.3032 5.87773L11.1783 10.0025L15.3032 14.1273L14.1247 15.3058L9.99983 11.181L5.87505 15.3058L4.69653 14.1273L8.82133 10.0025L4.69653 5.87773L5.87505 4.69922L9.99983 8.82404Z" fill="black" />
            </svg>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-4 h-[calc(100%-104px)] overflow-auto">
          {filterQuestionnaire.map((filterQuestion: any, i: number) => {
            return <React.Fragment key={i}>
              <div className="flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch justify-between items-center flex">
                  <p className="text-gray-900 text-base font-semibold">{filterQuestion?.text}</p>
                  {/* <div className="items-center gap-2 inline-flex">
                    <input type="checkbox" id={'Select-all' + i} className="w-5 h-5 cursor-pointer" />
                    <label htmlFor={"Select-all" + i} className="text-gray-600 text-base font-normal cursor-pointer">Select all</label>
                  </div> */}
                </div>
                <div className="self-stretch justify-start items-center gap-6 inline-flex">
                  {filterQuestion?.answerOption?.map((option: any, j: number) => {
                    return <div key={j} className="w-[112px] justify-start items-center gap-2 inline-flex">
                      <input type="checkbox" id={option.valueCoding.code + i} className="w-5 h-5 cursor-pointer" onChange={onFilterChange(filterQuestion?.text, option)} />
                      <label htmlFor={option.valueCoding.code + i} className="text-base font-normal cursor-pointer">{option.valueCoding.display}</label>
                    </div>
                  })}
                </div>
              </div>
              {i < filterQuestionnaire.length - 1 && <div className="border-t border-gray-100" />}
            </React.Fragment>
          })}
        </div>

        <div className="p-2.5 border-t border-gray-100 justify-center items-center flex gap-3">
          <button
            className="w-[138px] h-9 bg-white rounded border border-primary-300 flex-col justify-center items-center inline-flex text-primary-300 text-sm font-semibold leading-5"
            onClick={resetFilter}>
            Reset
          </button>
          <button
            className="w-[138px] h-9 bg-primary-300 rounded flex-col justify-center items-center inline-flex text-white text-sm font-semibold leading-5"
            onClick={applyFilter}>
            Apply filter
          </button>
        </div>
      </div>
    </CustomModal>
  </>
}

export { ReportsFilterModal }
