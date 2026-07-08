"use client"
import { supabase } from '@/configs/supabase';
import { useAuth } from '@/app/_context/AuthContext';
import React, { useEffect, useState } from 'react'
import CourseBasicInfo from '../_components/CourseBasicInfo';
import { useRouter } from 'next/navigation';
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

function FinishScreen({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const { user } = useAuth();
  const [course, setCourse] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (params) GetCourse();
  }, [params, user])

  const GetCourse = async () => {
    const { data, error } = await supabase
      .from('courseList')
      .select('*')
      .eq('courseId', params?.courseId)
      .eq('user_id', user?.id)
      .maybeSingle();

    if (!error && data) setCourse(data);
  }

  return (
    <div className='px-10 md:px-20 lg:px-44 my-7'>
      <h2 className='text-center font-bold text-2xl my-3 text-primary'>Congrats! Your course is Ready</h2>
      <CourseBasicInfo course={course} refreshData={() => console.log()} />
      <h2 className='mt-3'>Course URL:</h2>
      <h2 className='text-center text-gray-400 border p-2 round flex gap-5 items-center'>
        {process.env.NEXT_PUBLIC_HOST_NAME}/course/{course?.courseId}
        <HiOutlineClipboardDocumentCheck
          className='h-5 w-5 cursor-pointer'
          onClick={async () => await navigator.clipboard.writeText(process.env.NEXT_PUBLIC_HOST_NAME + "/course/" + course?.courseId)}
        />
      </h2>
    </div>
  )
}

export default FinishScreen
