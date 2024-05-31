'use client';

import Image from "next/image";
import { useState, useRef } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchState } from 'react-zoom-pan-pinch';

export default function DiagnosisImage() {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const transformWrapperRef = useRef(null);

  const imgUrl = 'https://s3-alpha-sig.figma.com/img/d5b1/15da/8f90a01d74ab376a4f3456aad62eda3e?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VWgspSxqBpMViUn27z8-Q1uLC1eUFkyMz0MruBKW5WvKU7R~CLdSYNgXjicHXl0Aujxgm4G1qDu70Wk0H36wCwsTE5MsIV7COV8oHmOYTXy8iC1sEsC6dC~dR3Yel7dY58-iAjkQJ0iQbyrDUEaWrHpF5OJnkOAptbkRYh93Ljh1JcHUrqPGIJlQqIDE-nlru1t-Fuas2XaJxUuCs7W45io5yAFvrk-X1ouHEd7OTxAkUqHziRftmlbPJs1ALa9gtxiY2hwWBgUkeBohAlkukzKK-jSznXRT4GBG9WmfVBnw5CfeAB4mhJVXbWBcD0Z~v6Ft9ubanjWy-71~0KJSwQ__';

  const handleZoom = (zoom: { state: ReactZoomPanPinchState }) => {
    setZoomLevel(zoom.state.scale);
  };

  return <TransformWrapper
    ref={transformWrapperRef}
    initialScale={1}
    minScale={0.5}
    initialPositionX={0}
    initialPositionY={0}
    onTransformed={handleZoom}
    centerZoomedOut={true}>
    {({ zoomIn, zoomOut, resetTransform }) => (

      <>
        {/* zoom */}
        <div className="absolute right-0 w-[102px] h-8 p-1 bg-white border border-gray-100 justify-center items-center gap-2 inline-flex z-10">
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
        <TransformComponent wrapperClass='!h-full cursor-grab' contentClass='!h-full'>
          <Image
            width={500}
            height={500}
            className={`h-full w-full object-cover`}
            // src={'/images/sample-image.png'}
            src={imgUrl}
            alt={"Image"}
            sizes="100vw"
          />
        </TransformComponent>
      </>
    )}
  </TransformWrapper>
}
