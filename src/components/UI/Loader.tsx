
const Loader = () => {
    return (
        <div className="absolute z-10 inline-flex flex-col items-center justify-center rotate w-full h-full">
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 74 74" fill="none">
                <mask id="mask0_49_2752" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="75" height="75">
                    <rect width="74.0049" height="74.0049" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_49_2752)">
                    <path d="M36.8353 67.8377C32.6212 67.8377 28.6383 67.0283 24.8866 65.4094C21.135 63.7906 17.8587 61.5807 15.0578 58.7798C12.257 55.979 10.0471 52.7027 8.42824 48.9511C6.80938 45.1994 5.99995 41.2165 5.99995 37.0024C5.99995 32.7368 6.80938 28.7411 8.42824 25.0151C10.0471 21.2892 12.257 18.0258 15.0578 15.2249C17.8587 12.424 21.135 10.2141 24.8866 8.59528C28.6383 6.97642 32.6212 6.16699 36.8353 6.16699C37.709 6.16699 38.4413 6.4625 39.0323 7.05351C39.6234 7.64452 39.9189 8.37686 39.9189 9.25053C39.9189 10.1242 39.6234 10.8565 39.0323 11.4475C38.4413 12.0386 37.709 12.3341 36.8353 12.3341C30.0001 12.3341 24.18 14.7367 19.3748 19.5418C14.5696 24.347 12.167 30.1672 12.167 37.0024C12.167 43.8375 14.5696 49.6577 19.3748 54.4629C24.18 59.2681 30.0001 61.6707 36.8353 61.6707C43.6705 61.6707 49.4907 59.2681 54.2958 54.4629C59.101 49.6577 61.5036 43.8375 61.5036 37.0024C61.5036 36.1287 61.7991 35.3964 62.3901 34.8053C62.9811 34.2143 63.7135 33.9188 64.5872 33.9188C65.4608 33.9188 66.1932 34.2143 66.7842 34.8053C67.3752 35.3964 67.6707 36.1287 67.6707 37.0024C67.6707 41.2165 66.8613 45.1994 65.2424 48.9511C63.6235 52.7027 61.4137 55.979 58.6128 58.7798C55.8119 61.5807 52.5485 63.7906 48.8226 65.4094C45.0966 67.0283 41.1009 67.8377 36.8353 67.8377Z" fill="#0075EB" />
                </g>
            </svg>
            <p className="text-base font-normal text-app_primary">Loading</p>
        </div>
    );
};

export { Loader };