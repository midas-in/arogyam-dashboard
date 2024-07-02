'use client';

import Image from "next/image";
import { useState, useRef } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchState } from 'react-zoom-pan-pinch';
import { IMedia } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IMedia';

export function DiagnosisImage({ medias, activeMediaIndex = 0, setActiveMediaIndex }: { medias?: IMedia[], activeMediaIndex?: number, setActiveMediaIndex?: Function }) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const transformWrapperRef = useRef(null);

  // const imgUrl = 'https://s3-alpha-sig.figma.com/img/d5b1/15da/8f90a01d74ab376a4f3456aad62eda3e?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VWgspSxqBpMViUn27z8-Q1uLC1eUFkyMz0MruBKW5WvKU7R~CLdSYNgXjicHXl0Aujxgm4G1qDu70Wk0H36wCwsTE5MsIV7COV8oHmOYTXy8iC1sEsC6dC~dR3Yel7dY58-iAjkQJ0iQbyrDUEaWrHpF5OJnkOAptbkRYh93Ljh1JcHUrqPGIJlQqIDE-nlru1t-Fuas2XaJxUuCs7W45io5yAFvrk-X1ouHEd7OTxAkUqHziRftmlbPJs1ALa9gtxiY2hwWBgUkeBohAlkukzKK-jSznXRT4GBG9WmfVBnw5CfeAB4mhJVXbWBcD0Z~v6Ft9ubanjWy-71~0KJSwQ__';

  const handleZoom = (zoom: { state: ReactZoomPanPinchState }) => {
    setZoomLevel(zoom.state.scale);
  };

  const previousImage = () => {
    if (activeMediaIndex > 0 && setActiveMediaIndex) {
      setActiveMediaIndex((activeMediaIndex ?? 0) - 1);
    }
  }

  const nextImage = () => {
    if (medias?.length && activeMediaIndex < medias?.length - 1 && setActiveMediaIndex) {
      setActiveMediaIndex((activeMediaIndex ?? 0) + 1);
    }
  }

  return <TransformWrapper
    ref={transformWrapperRef}
    initialScale={1}
    minScale={0.5}
    onTransformed={handleZoom}
    centerZoomedOut={true}
    centerOnInit={true}
  >
    {({ zoomIn, zoomOut, resetTransform }) => (
      <>
        {/* zoom */}
        <div className="absolute z-10 bottom-[16px] h-8 p-1 bg-white border border-gray-100 justify-center items-center gap-2 inline-flex rounded">
          {medias && medias?.length > 1 && <div className="inline-flex justify-center items-center gap-2  border-r">
            <div className="w-5 h-5 relative origin-top-left cursor-pointer" onClick={previousImage} >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.02362 9.99746L13.1484 14.1223L11.9699 15.3008L6.66662 9.99746L11.9699 4.69421L13.1484 5.87271L9.02362 9.99746Z" fill="#424141" />
              </svg>
            </div>
            <div className="text-neutral-700 text-sm font-normal leading-tight">Image {activeMediaIndex + 1}/{medias?.length}</div>
            <div className="w-5 h-5 relative cursor-pointer" onClick={nextImage} >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10.9764 10.0025L6.85156 5.87773L8.03008 4.69922L13.3334 10.0025L8.03008 15.3058L6.85156 14.1273L10.9764 10.0025Z" fill="#424141" />
              </svg>
            </div>
          </div>}

          <div className="w-6 h-6 relative cursor-pointer" onClick={() => zoomOut()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549ZM7.25488 9.25488H12.2549V10.2549H7.25488V9.25488Z" fill="#424141" />
            </svg>
          </div>
          <div className="text-stone-950 text-sm font-normal leading-tight cursor-pointer" onClick={() => resetTransform()}>
            {(zoomLevel * 100).toFixed(0)}%
          </div>
          <div className="w-6 h-6 relative cursor-pointer" onClick={() => zoomIn()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.7549 14.2549H14.9649L14.6849 13.9849C15.6649 12.8449 16.2549 11.3649 16.2549 9.75488C16.2549 6.16488 13.3449 3.25488 9.75488 3.25488C6.16488 3.25488 3.25488 6.16488 3.25488 9.75488C3.25488 13.3449 6.16488 16.2549 9.75488 16.2549C11.3649 16.2549 12.8449 15.6649 13.9849 14.6849L14.2549 14.9649V15.7549L19.2549 20.7449L20.7449 19.2549L15.7549 14.2549ZM9.75488 14.2549C7.26488 14.2549 5.25488 12.2449 5.25488 9.75488C5.25488 7.26488 7.26488 5.25488 9.75488 5.25488C12.2449 5.25488 14.2549 7.26488 14.2549 9.75488C14.2549 12.2449 12.2449 14.2549 9.75488 14.2549ZM10.2549 7.25488H9.25488V9.25488H7.25488V10.2549H9.25488V12.2549H10.2549V10.2549H12.2549V9.25488H10.2549V7.25488Z" fill="#424141" />
            </svg>
          </div>
        </div>
        <TransformComponent wrapperClass='!h-[calc(100vh-185px)] !w-full cursor-grab' contentClass='!h-full'>
          <Image
            width={700}
            height={700}
            className={`h-[700px] w-[700px] bg-gray-100 object-cover`}
            src={medias && medias?.length ? medias[activeMediaIndex]?.content?.url?.replace('fhir', 'fhir-temp') ?? '' : ''}
            alt={"Image"}
            sizes="100vw"
          />
        </TransformComponent>
      </>
    )}
  </TransformWrapper>
}
