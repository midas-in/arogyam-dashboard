import React, { ImgHTMLAttributes, useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

export const NextImage: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({ alt = '', ...props }) => {
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (props.src) {
            setIsError(false);
        }
    }, [props.src])

    if (isError) {
        return <div className={props.className} />
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img onError={() => setIsError(true)} {...props} alt={alt} />
}
