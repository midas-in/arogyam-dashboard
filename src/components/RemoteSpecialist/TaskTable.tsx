import React from 'react';

const TaskTable = ({ onClick, showLabelledOn }: { onClick: Function, showLabelledOn?: boolean }) => {
    const imageIds = Array(10).fill('bc787a9b-e715-4aa6-aca6-f3cc94373dd0');

    return (
        <div className='mt-4'>
            <ul className='border border-gray-3 rounded'>
                <li className="flex items-center justify-between mb-2 bg-primary-10 border-b border-gray-3 py-2 px-4">
                    <span className="flex-1 font-semibold text-base py-2">Case ID</span>
                    <span className="w-[140px] font-semibold text-base py-2">Age</span>
                    <span className="w-[140px] font-semibold text-base py-2">Gender</span>
                    <span className="w-[140px] font-semibold text-base py-2">Captured on</span>
                    {showLabelledOn && <span className="w-[200px] font-semibold text-base py-2">Labelled on</span>}
                    <span className="w-[100px] font-semibold text-base py-2 pl-1">Action</span>
                </li>
                {imageIds.map((id, i) => (
                    <li key={i} className="flex items-center justify-between mb-2 border-b last:border-b-0 border-gray-3 py-2 px-4">
                        <span className="flex-1 text-gray-900  font-normal text-base">{id}</span>
                        <span className="w-[140px] text-gray-900 font-normal text-base">24</span>
                        <span className="w-[140px] text-gray-900 font-normal text-base">Male</span>
                        <span className="w-[140px] text-gray-900 font-normal text-base">24-04-2024</span>
                        {showLabelledOn && <span className="w-[200px] text-gray-900 font-normal text-base">24-04-2024 | 19:05</span>}
                        <div className='w-[100px]'>
                            <button onClick={() => { onClick(); }} className="ml-1 bg-app_primary text-white text-sm font-semilight py-1 px-4 rounded">
                                View
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center mt-4 bg-primary-10 border border-gray-3 rounded text-gray-600">
                <span className="font-light text-sm py-2 px-4">1 - 11 of 25 items</span>
                <div className='flex items-center '>
                    <span className="font-light text-sm border-l border-gray-3 py-3 px-4 text-gray-900 text-center h-full">
                        <select className='bg-primary-10 mr-1'>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </select>
                        <span className="font-light text-sm text-gray-900 text-center">
                            of 2 pages
                        </span>
                    </span>
                    <button className="text-gray-800 font-bold py-2 px-4 border-l border-gray-3">
                        <span className="material-symbols-outlined mt-1">arrow_left</span>
                    </button>
                    <button className="text-gray-800 font-bold py-2 px-4 border-l border-gray-3">
                        <span className="material-symbols-outlined mt-1">arrow_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskTable;