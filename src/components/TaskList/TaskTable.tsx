import React from 'react';

const TaskTable = () => {
    const imageIds = [12201, 12206, 12057, 12293, 13204, 15897, 19725, 13109];

    return (
        <div className='mt-5'>
            <ul className='border border-gray-300 rounded'>
                <li className="flex items-center justify-between mb-2 bg-gray-100 border-b border-gray-300 py-2 px-4">
                    <span className="font-medium text-sm py-2">Image ID</span>
                    <div className='w-[100px]'>
                        <span className="font-medium text-sm py-2">Action</span>
                    </div>
                </li>
                {imageIds.map((id) => (
                    <li key={id} className="flex items-center justify-between mb-2 border-b last:border-b-0 border-gray-300 py-2 px-4">
                        <span className="font-light text-sm">{id}</span>
                        <div className='w-[100px]'>
                            <button className="bg-primary-100 text-white text-sm font-semilight py-1 px-4 rounded">
                                View
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-between items-center mt-4 bg-gray-100 border border-gray-300 rounded">
                <span className="font-light text-sm py-2 px-4">1 - 11 of 25 items</span>
                <div className='flex items-center'>
                    <span className="font-light text-sm border-l border-gray-300 py-2 px-4">
                        <select className='bg-gray-100'>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </select>
                        of 2 pages
                    </span>
                    <button className="text-gray-800 font-bold py-2 px-4 border-l border-gray-300">
                        <span className="material-symbols-outlined">arrow_left</span>
                    </button>
                    <button className="text-gray-800 font-bold py-2 px-4 border-l border-gray-300">
                        <span className="material-symbols-outlined">arrow_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskTable;