"use client"
import { supabase } from '@/configs/supabase'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ChapterListCard from './_components/ChapterListCard'
import ChapterContent from './_components/ChapterContent'
import QuizModal from './_components/QuizModal'
import { HiOutlineBookOpen, HiOutlineAcademicCap } from "react-icons/hi2"

function CourseStart() {
  const params = useParams();
  const courseId = params?.courseId;
  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState(null);
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [showQuiz, setShowQuiz] = useState(false);

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

    if (!error && data) {
      setCourse(data);
      const firstChapter = data?.courseOutput?.course?.chapters?.[0];
      if (firstChapter) {
        setSelectedChapter(firstChapter);
        setSelectedChapterIndex(0);
        GetSelectedChapterContent(0);
      }
    }
  }

  const GetSelectedChapterContent = async (chapterId) => {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('chapterId', chapterId)
      .eq('courseId', courseId)
      .maybeSingle();

    if (!error && data) setChapterContent(data);
  }

  const markChapterComplete = (index) => {
    const updated = new Set(completedChapters);
    updated.add(index);
    setCompletedChapters(updated);
    localStorage.setItem(`course-progress-${courseId}`, JSON.stringify([...updated]));
  }

  const handleChapterSelect = (chapter, index) => {
    setSelectedChapter(chapter);
    setSelectedChapterIndex(index);
    GetSelectedChapterContent(index);
    markChapterComplete(index);
  }

  const totalChapters = course?.courseOutput?.course?.chapters?.length || 0;
  const progressPercent = totalChapters > 0 ? Math.round((completedChapters.size / totalChapters) * 100) : 0;

  return (
    <div>
      {/* Sidebar */}
      <div className='fixed md:w-72 hidden md:flex md:flex-col h-screen border-r shadow-sm bg-white dark:bg-gray-900 z-10'>
        {/* Course Title */}
        <div className='shrink-0 bg-primary p-4'>
          <h2 className='font-medium text-lg text-white leading-tight'>
            {course?.courseOutput?.course?.name}
          </h2>
        </div>

        {/* Progress Section */}
        <div className='shrink-0 px-4 py-3 border-b bg-gray-50 dark:bg-gray-800'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1'>
              <HiOutlineBookOpen className='text-primary' />
              Progress
            </span>
            <span className='text-xs font-bold text-primary'>
              {completedChapters.size}/{totalChapters}
            </span>
          </div>
          <div className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary rounded-full transition-all duration-500 ease-out'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className='text-[11px] text-gray-500 dark:text-gray-400 mt-1 text-right'>
            {progressPercent}% complete
          </p>
        </div>

        {/* Scrollable Chapter List */}
        <div className='flex-1 overflow-y-auto'>
          {course?.courseOutput?.course?.chapters?.map((chapter, index) => (
            <div key={index}
              className={`cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-800 transition-colors
                ${selectedChapterIndex === index ? 'bg-purple-100 dark:bg-gray-700 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
              onClick={() => handleChapterSelect(chapter, index)}
            >
              <ChapterListCard
                chapter={chapter}
                index={index}
                isCompleted={completedChapters.has(index)}
              />
            </div>
          ))}
        </div>
        {/* Quiz Button */}
        <div className='shrink-0 p-3 border-t bg-gray-50 dark:bg-gray-800'>
          <button
            onClick={() => setShowQuiz(true)}
            className='w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors'
          >
            <HiOutlineAcademicCap className='text-lg' />
            Take Quiz
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className='md:hidden sticky top-0 z-10 bg-white dark:bg-gray-900 border-b shadow-sm'>
        <div className='bg-primary px-4 py-2'>
          <h2 className='font-medium text-sm text-white truncate'>
            {course?.courseOutput?.course?.name}
          </h2>
        </div>
        <div className='px-4 py-2'>
          <div className='flex items-center justify-between mb-1'>
            <span className='text-xs text-gray-600 dark:text-gray-300'>{progressPercent}% complete</span>
            <span className='text-xs font-medium text-primary'>{completedChapters.size}/{totalChapters}</span>
          </div>
          <div className='w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
            <div
              className='h-full bg-primary rounded-full transition-all duration-500'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {/* Mobile chapter selector */}
        <div className='overflow-x-auto flex items-center gap-1 px-4 pb-2'>
          {course?.courseOutput?.course?.chapters?.map((chapter, index) => (
            <button key={index}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors
                ${selectedChapterIndex === index
                  ? 'bg-primary text-white border-primary'
                  : completedChapters.has(index)
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'bg-gray-100 text-gray-600 border-gray-200'}`}
              onClick={() => handleChapterSelect(chapter, index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setShowQuiz(true)}
            className='shrink-0 ml-2 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-green-600 text-white border border-green-600'
          >
            <HiOutlineAcademicCap /> Quiz
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className='md:ml-72'>
        <ChapterContent chapter={selectedChapter} content={chapterContent} />
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal course={course} onClose={() => setShowQuiz(false)} />
      )}
    </div>
  )
}

export default CourseStart
