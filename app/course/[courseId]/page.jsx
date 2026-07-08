"use client"
import Header from '@/app/_components/Header'
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList'
import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo'
import CourseDetail from '@/app/create-course/[courseId]/_components/CourseDetail'
import { supabase } from '@/configs/supabase'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function Course() {
  const params = useParams();
  const courseId = params?.courseId;
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courseId) GetCourse();
  }, [courseId])

  const GetCourse = async () => {
    const { data, error } = await supabase
      .from('courseList')
      .select('*')
      .eq('courseId', courseId)
      .maybeSingle();

    if (!error && data) setCourse(data);
  }

  return (
    <div>
      <Header />
      <div className='px-10 p-10 md:px-20 lg:px-44'>
        <CourseBasicInfo course={course} edit={false} />
        <CourseDetail course={course} />
        <ChapterList course={course} edit={false} />
      </div>
      <h2 className='text-sm text-gray-400 text-center mb-10'>
        This course created on
        <Link href={'https://www.mydesignnexus.in'}><br /> www.mydesignnexus.in</Link>
      </h2>
    </div>
  )
}

export default Course
