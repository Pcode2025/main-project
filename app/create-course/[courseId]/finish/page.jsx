"use client"
import { supabase } from '@/configs/supabase';
import { useAuth } from '@/app/_context/AuthContext';
import React, { useEffect, useState } from 'react'
import CourseBasicInfo from '../_components/CourseBasicInfo';
import { useParams } from 'next/navigation';
import { HiOutlineClipboardDocumentCheck, HiOutlineShare, HiOutlineCheck } from "react-icons/hi2";
import Link from 'next/link';

function FinishScreen() {
  const params = useParams();
  const courseId = params?.courseId;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const copyLink = async () => {
    if (!courseUrl) return;
    await navigator.clipboard.writeText(courseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: course?.courseOutput?.course?.name || 'Course',
        text: `Check out this course: ${course?.courseOutput?.course?.name}`,
        url: courseUrl,
      });
    } else {
      copyLink();
    }
  }

  return (
    <div className='px-10 md:px-20 lg:px-44 my-7'>
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
          <svg className='w-8 h-8 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
          </svg>
        </div>
        <h2 className='font-bold text-2xl text-primary'>Your Course is Ready!</h2>
        <p className='text-gray-500 mt-1'>Share it with others or start learning right away.</p>
      </div>

      <CourseBasicInfo course={course} refreshData={() => GetCourse()} />

      {/* Share Section */}
      <div className='mt-6 p-5 bg-white dark:bg-gray-900 border rounded-xl shadow-sm'>
        <h3 className='font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3'>Share your course</h3>
        <div className='flex items-center gap-2'>
          <div className='flex-1 bg-gray-50 dark:bg-gray-800 border rounded-lg px-3 py-2.5 text-sm text-gray-600 dark:text-gray-300 truncate'>
            {courseUrl}
          </div>
          <button
            onClick={copyLink}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {copied ? <HiOutlineCheck className='text-lg' /> : <HiOutlineClipboardDocumentCheck className='text-lg' />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={shareNative}
            className='shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
          >
            <HiOutlineShare className='text-lg' />
            Share
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className='mt-6 flex flex-col sm:flex-row gap-3'>
        <Link href={`/course/${courseId}/start`} className='flex-1'>
          <button className='w-full px-5 py-3 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity'>
            Start Learning
          </button>
        </Link>
        <Link href='/dashboard' className='flex-1'>
          <button className='w-full px-5 py-3 border text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'>
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  )
}

export default FinishScreen
