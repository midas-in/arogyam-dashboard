import React, { useState, } from "react";
import { useSession } from "next-auth/react";
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';
import { IMedia } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedia';

import { NextImage } from "@/components/UI/NextImage";
import { getAge, formatDate } from "@/utils";
import { OBSERVATION_CODE_LABEL_MAPPING } from "@/utils/fhir-utils";

interface DiagnosisLeftBarProps {
  patient?: IPatient;
  encounter?: IEncounter;
  observations?: IObservation[];
  medias?: IMedia[];
  activeMediaIndex: number;
  setActiveMediaIndex: Function;
}

const DiagnosisLeftBar: React.FC<DiagnosisLeftBarProps> = (props) => {
  const { patient, encounter, observations, medias, activeMediaIndex, setActiveMediaIndex } = props;
  const { data: session } = useSession();

  const [collapseSidebar, setCollapseSidebar] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{ totalWidth: number, left: number }>();
  const [width, setWidth] = useState(320);

  const startResizing = React.useCallback((e: any) => {
    setResizing(true);
    const totalWidth = e.currentTarget.parentElement.getBoundingClientRect()
      .width;
    const left = e.currentTarget.parentElement.getBoundingClientRect().left;
    setResizeData({ totalWidth, left })
  }, []);

  const stopResizing = React.useCallback(() => {
    setResizing(false);
  }, [])

  const resizeHandler = React.useCallback((e: any) => {
    if (resizing && resizeData) {
      const w = e.clientX + 6 - resizeData?.left;
      if (w >= 220 && w <= 320) {
        setWidth(w);
      }
    }
  }, [resizing, resizeData])

  React.useEffect(() => {
    window.addEventListener("mousemove", resizeHandler);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resizeHandler);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resizeHandler, stopResizing]);


  return <div className={`absolute top-0 left-0 flex flex-col gap-4 border border-gray-100 m-[10px] bg-white min-w-55 max-w-80`} style={{ width }}>
    <div className={`flex`} >
      <div className="relative flex flex-1 justify-between px-4 py-3 bg-primary-10 shadow border-b border-gray-100">
        <div className="flex items-center">
          <p className="text-gray-900 text-base font-semibold leading-normal ">
            Case ID -
          </p>
          <p className="truncate text-gray-900 text-base font-semibold leading-normal ml-1" style={{ width: width - 150 }} >
            {patient?.id}
          </p>
        </div>
        <button className={`h-8 px-2 py-1 rounded border border-gray-100 justify-start items-center gap-1 inline-flex ${collapseSidebar ? 'bg-primary-400 border-0' : 'bg-white'}`} onClick={() => setCollapseSidebar(prev => !prev)} >
          {/* <div className={`text-base font-normal ${collapseSidebar ? 'text-white' : ''}`}>Close</div> */}
          <div className={`w-5 h-5 relative transition-all ${collapseSidebar ? 'rotate-180' : ''}`} >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 9.02399L5.87529 13.1488L4.69678 11.9703L10 6.66699L15.3034 11.9703L14.1249 13.1488L10 9.02399Z" fill={!collapseSidebar ? "#101010" : '#ffffff'} />
            </svg>
          </div>
        </button>
        <div
          className='resize-handle absolute h-full z-10 top-0 right-0'
          onMouseDown={startResizing}
        />
      </div>
    </div>

    {/* <div className={`h-6 px-4 justify-start items-start inline-flex ${collapseSidebar ? 'hidden' : ''}`}>
      <h4 className="text-gray-900 text-base font-semibold leading-normal">Patient details</h4>
    </div> */}

    <div className={`overflow-y-auto h-[calc(100vh-261px)] px-4 flex-col justify-start items-start gap-2 inline-flex ${collapseSidebar ? 'hidden' : ''}`}>
      <div className="flex-col justify-start items-start gap-2 flex border-b border-gray-100">
        <h6 className="text-gray-900 text-sm font-semibold leading-tight">Registration Details</h6>
        <div className="pr-4 py-2 rounded justify-start items-start inline-flex">
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <div className="justify-start items-start gap-2 inline-flex">
              <p className="text-gray-900 text-sm font-semibold leading-tight" style={{ width: (width / 2) - 32 }}>Age</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">:</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">{patient?.birthDate ? getAge(patient?.birthDate) : '-'}</p>
            </div>
            <div className="justify-start items-start gap-2 inline-flex">
              <p className="text-gray-900 text-sm font-semibold leading-tight" style={{ width: (width / 2) - 32 }}>Gender</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">:</p>
              <p className="text-gray-900 text-sm font-normal leading-tight capitalize">{patient?.gender}</p>
            </div>
            <div className="justify-start items-start gap-2 inline-flex">
              <p className="text-gray-900 text-sm font-semibold leading-tight" style={{ width: (width / 2) - 32 }}>Captured on</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">:</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">{encounter?.period?.end ? formatDate(encounter?.period?.end) : '-'}</p>
            </div>
            <div className="justify-start items-start gap-2 inline-flex">
              <p className="text-gray-900 text-sm font-semibold leading-tight" style={{ width: (width / 2) - 32 }}>State</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">:</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">{patient?.address ? patient?.address[0]?.state : '-'}</p>
            </div>
            <div className="justify-start items-start gap-2 inline-flex">
              <p className="text-gray-900 text-sm font-semibold leading-tight" style={{ width: (width / 2) - 32 }}>District</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">:</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">{patient?.address ? patient?.address[0]?.district : '-'}</p>
            </div>
            <div className="justify-start items-start gap-2 inline-flex">
              <p className="text-gray-900 text-sm font-semibold leading-tight" style={{ width: (width / 2) - 32 }}>Captured by</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">:</p>
              <p className="text-gray-900 text-sm font-normal leading-tight">{patient?.generalPractitioner ? patient?.generalPractitioner[0]?.reference?.split('/')[1] ?? '-' : '-'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col justify-start items-start gap-2 flex border-b border-gray-100">
        <div className="text-gray-900 text-sm font-semibold leading-tight">Habit History</div>
        <div className="pr-4 py-2 rounded justify-start items-start inline-flex">
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            {observations?.map((observation, i) => {
              const [label] = observation?.code?.coding ?? [];
              const [value] = observation?.valueCodeableConcept?.coding ?? [];
              return <div key={i} className="justify-start items-start gap-2 inline-flex">
                <p className="text-gray-900 text-sm font-semibold leading-tight" style={{ width: (width / 2) - 32 }}>
                  {label?.code ? OBSERVATION_CODE_LABEL_MAPPING[label?.code] ?? label?.code : '-'}
                </p>
                <p className="text-gray-900 text-sm font-normal leading-tight">:</p>
                <p className="text-gray-900 text-sm font-normal leading-tight flex-1">{value ? value?.display : '-'}</p>
              </div>
            })}
          </div>
        </div>
      </div>
      <div className="h-[68px] flex-col justify-start items-start gap-2 flex" style={{ width: width - 40 }}>
        <div className="text-gray-900 text-sm font-semibold leading-tight">Images</div>
        <div className="rounded justify-start items-start gap-1 inline-flex flex-wrap pb-3" >
          {medias?.map((media, i) => {
            return <div
              key={i}
              className={`cursor-pointer relative bg-white rounded ${i === activeMediaIndex ? 'outline outline-offset-[-2px] outline-2 outline-primary-400' : ''}`}
              onClick={() => setActiveMediaIndex(i)}>
              <NextImage
                width={10}
                height={10}
                className={`h-10 w-10 bg-gray-100 object-cover rounded`}
                src={media ? `${media?.content?.url}&authToken=${session?.accessToken}` ?? '' : ''}
                alt={"Image"}
                sizes="100vw"
              />
            </div>
          })}
        </div>
      </div>
    </div>
  </div>
}

export { DiagnosisLeftBar }
