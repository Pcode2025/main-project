import React from 'react'
import { HiOutlineClock, HiCheckCircle } from "react-icons/hi2";

function ChapterListCard({ chapter, index, isCompleted }) {
  return (
    <div className='grid grid-cols-5 p-4 items-center border-b border-gray-100 dark:border-gray-700'>
      <div>
        {isCompleted ? (
          <HiCheckCircle className='w-8 h-8 text-green-500' />
        ) : (
          <h2 className='p-1 bg-primary w-8 h-8 text-white rounded-full text-center text-sm flex items-center justify-center'>
            {index + 1}
          </h2>
        )}
      </div>
      <div className='col-span-4'>
        <h2 className={`font-medium text-sm ${isCompleted ? 'text-green-700 dark:text-green-400' : ''}`}>
          {chapter?.name}
        </h2>
        <h2 className='flex items-center gap-1 text-xs text-gray-500 mt-0.5'>
          <HiOutlineClock />
          {chapter?.duration}
        </h2>
      </div>
    </div>
  )
}

export default ChapterListCard
