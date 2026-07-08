"use client"
import { supabase } from '@/configs/supabase';
import { useAuth } from '@/app/_context/AuthContext';
import React, { useEffect, useState } from 'react'
import CourseBasicInfo from '../_components/CourseBasicInfo';
import { useParams } from 'next/navigation';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

function FinishScreen() {
  const params = useParams();
  const courseId = params?.courseId;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId && user) GetCourse();
  }, [courseId, user])

  const GetCourse = async () => {
    const { data, error } = await supabase
      .from('courseList')
      .select('*')
      .eq('courseId', courseId)
      .eq('user_id', user?.id)
      .maybeSingle();

    if (!error && data) setCourse(data);
  }

  const hostName = process.env.NEXT_PUBLIC_HOST_NAME || (typeof window !== 'undefined' ? window.location.origin : '');
  const courseUrl = course?.courseId ? `${hostName}/course/${course.courseId}` : '';

  return (
    <div className='px-10 md:px-20 lg:px-44 my-7'>
      <h2 className='text-center font-bold text-2xl my-3 text-primary'>Congrats! Your course is Ready</h2>
      <CourseBasicInfo course={course} refreshData={() => {}} />
      <h2 className='mt-3'>Course URL:</h2>
      <h2 className='text-center text-gray-400 border p-2 rounded flex gap-5 items-center'>
        {courseUrl}
        {courseUrl && (
          <HiOutlineClipboardDocumentCheck
            className='h-5 w-5 cursor-pointer'
            onClick={async () => await navigator.clipboard.writeText(courseUrl)}
          />
        )}
      </h2>
    </div>
  )
}

export default FinishScreen
