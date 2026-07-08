"use client"
import { supabase } from '@/configs/supabase'
import React, { useEffect, useState } from 'react'
import CourseCard from '../_components/CourseCard';
import { Button } from '@/components/ui/button';

function Explore() {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    GetAllCourse();
  }, [pageIndex])

  const GetAllCourse = async () => {
    const { data, error } = await supabase
      .from('courseList')
      .select('*')
      .range(pageIndex * 9, pageIndex * 9 + 8);

    if (!error && data) setCourseList(data);
  }

  return (
    <div>
      <h2 className='font-bold text-3xl'>Explore More Projects</h2>
      <p>Explore more project build with AI by other users</p>

      <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
        {courseList?.length > 0 ? courseList?.map((course, index) => (
          <div key={index}>
            <CourseCard course={course} displayUser={true} />
          </div>
        )) :
          [1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className='w-full h-[230px] bg-slate-200 rounded-lg'></div>
          ))
        }
      </div>

      <div className='flex justify-between mt-5'>
        {pageIndex != 0 && <Button onClick={() => setPageIndex(pageIndex - 1)}>Previous Page</Button>}
        <Button onClick={() => setPageIndex(pageIndex + 1)}>Next Page</Button>
      </div>
    </div>
  )
}

export default Explore
