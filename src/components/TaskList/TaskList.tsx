import React from 'react';
import TaskTable from './TaskTable';

const TaskList = () => {
    return <div className='lg:mx-[150px] lg:my-[50px] mx-[10px] my-[10px] justify-center'>
        <div className='flex justify-between'>
            <h2 className="text-xl font-light leading-7 text-gray-900 ">Tasks</h2>
            <button className="bg-primary-100 text-white font-medium text-sm py-2 px-4 rounded mb-4">
                Start Labelling
            </button>
        </div>
        <hr />
        <div className="flex border-gray-300 mt-5">
            <div className="border-b-2 border-blue-500 font-medium text-sm py-2 px-4 cursor-pointer">New</div>
            <div className="border-b-2 py-2 px-4 font-light text-sm text-gray-400 cursor-pointer">Completed</div>
        </div>
        <TaskTable />
    </div>
}
export default TaskList;