"use client"
import ChapterList from '@/app/create-course/[courseId]/_components/ChapterList'
import CourseBasicInfo from '@/app/create-course/[courseId]/_components/CourseBasicInfo'
import CourseDetail from '@/app/create-course/[courseId]/_components/CourseDetail'
import { supabase } from '@/configs/supabase'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { HiOutlineHome, HiOutlineArrowLeft, HiOutlineBookOpen } from "react-icons/hi2"

function Course() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId;
  const [course, setCourse] = useState(null);
  const [completedChapters, setCompletedChapters] = useState(new Set());

  useEffect(() => {
    if (courseId) GetCourse();
  }, [courseId])

  useEffect(() => {
    if (courseId) {
      const stored = localStorage.getItem(`course-progress-${courseId}`);
      if (stored) {
        setCompletedChapters(new Set(JSON.parse(stored)));
      }
    }
  }, [courseId])

  const GetCourse = async () => {
    const { data, error } = await supabase
      .from('courseList')
      .select('*')
      .eq('courseId', courseId)
      .maybeSingle();

    if (!error && data) setCourse(data);
  }

  const totalChapters = course?.courseOutput?.course?.chapters?.length || 0;
  const progressPercent = totalChapters > 0 ? Math.round((completedChapters.size / totalChapters) * 100) : 0;

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-950'>
      {/* Top Navigation Bar */}
      <div className='sticky top-0 z-20 bg-white dark:bg-gray-900 border-b shadow-sm'>
        <div className='max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
              title='Go back'
            >
              <HiOutlineArrowLeft className='text-xl text-gray-600 dark:text-gray-300' />
            </button>
            <Link
              href='/dashboard'
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors'
              title='Go to dashboard'
            >
              <HiOutlineHome className='text-xl text-gray-600 dark:text-gray-300' />
            </Link>
          </div>
          <Link
            href={`/course/${courseId}/start`}
            className='px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity'
          >
            Start Learning
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='max-w-6xl mx-auto px-4 md:px-8 pt-6'>
        <div className='bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
              <HiOutlineBookOpen className='text-primary' />
              Course Progress
            </span>
            <span className='text-sm font-bold text-primary'>
              {completedChapters.size}/{totalChapters} chapters
            </span>
          </div>
          <div className='w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary rounded-full transition-all duration-500 ease-out'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className='flex items-center justify-between mt-2'>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {progressPercent === 0 ? 'Not started yet' : progressPercent === 100 ? 'Course completed!' : `${progressPercent}% complete`}
            </p>
            {progressPercent > 0 && progressPercent < 100 && (
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {totalChapters - completedChapters.size} chapters remaining
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className='max-w-6xl mx-auto px-4 md:px-8 py-6'>
        <CourseBasicInfo course={course} edit={false} />
        <CourseDetail course={course} />
        <ChapterList course={course} edit={false} />
      </div>
    </div>
  )
}

export default Course
