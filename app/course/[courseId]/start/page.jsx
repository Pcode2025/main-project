"use client"
import { supabase } from '@/configs/supabase'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ChapterListCard from './_components/ChapterListCard'
import ChapterContent from './_components/ChapterContent'

function CourseStart() {
  const params = useParams();
  const courseId = params?.courseId;
  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);

  useEffect(() => {
    if (courseId) GetCourse();
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

  return (
    <div>
      <div className='fixed md:w-72 hidden md:block h-screen border-r shadow-sm'>
        <h2 className='font-medium text-lg bg-primary p-4 text-white'>
          {course?.courseOutput?.course?.name}
        </h2>
        <div>
          {course?.courseOutput?.course?.chapters?.map((chapter, index) => (
            <div key={index}
              className={`cursor-pointer hover:bg-purple-50 ${selectedChapter?.name == chapter?.name ? 'bg-purple-100' : ''}`}
              onClick={() => { setSelectedChapter(chapter); GetSelectedChapterContent(index) }}
            >
              <ChapterListCard chapter={chapter} index={index} />
            </div>
          ))}
        </div>
      </div>
      <div className='md:ml-72'>
        <ChapterContent chapter={selectedChapter} content={chapterContent} />
      </div>
    </div>
  )
}

export default CourseStart
