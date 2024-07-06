import React, { ReactNode, useState } from "react";
import Image, { ImageProps } from "next/image";

export const NextImage: React.FC<ImageProps> = ({ alt = '', ...props }) => {
    const [isError, setIsError] = useState(false);

    if (isError) {
        return <div className={props.className} />
    }

    return <Image onError={() => setIsError(true)} {...props} alt={alt} />
}
