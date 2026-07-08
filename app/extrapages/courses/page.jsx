"use client"

import { supabase } from '@/configs/supabase'
import React, { useEffect, useState } from 'react'
import CourseCard from '@/app/dashboard/_components/CourseCard'
import { Button } from '@/components/ui/button'

function CoursesPage() {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCourses();
  }, [pageIndex])

  const getAllCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courseList')
      .select('*')
      .eq('publish', true)
      .range(pageIndex * 9, pageIndex * 9 + 8);

    if (!error && data) setCourseList(data);
    setLoading(false);
  }

  return (
    <div className='p-10 md:px-20 lg:px-44'>
      <h2 className='font-bold text-3xl'>All Courses</h2>
      <p className='text-gray-500 mt-1'>Browse AI-generated courses from our community</p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8'>
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className='w-full h-[300px] bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse' />
          ))
        ) : courseList?.length > 0 ? (
          courseList.map((course, index) => (
            <div key={index}>
              <CourseCard course={course} displayUser={true} />
            </div>
          ))
        ) : (
          <div className='col-span-full text-center py-10 text-gray-500'>
            No published courses found yet.
          </div>
        )}
      </div>

      <div className='flex justify-between mt-8'>
        {pageIndex > 0 && (
          <Button onClick={() => setPageIndex(pageIndex - 1)}>Previous Page</Button>
        )}
        {courseList?.length === 9 && (
          <Button onClick={() => setPageIndex(pageIndex + 1)} className='ml-auto'>Next Page</Button>
        )}
      </div>
    </div>
  )
}

export default CoursesPage
