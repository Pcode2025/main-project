"use client"
import { supabase } from '@/configs/supabase'
import { useAuth } from '@/app/_context/AuthContext'
import React, { useEffect, useState } from 'react'
import CourseBasicInfo from './_components/CourseBasicInfo'
import CourseDetail from './_components/CourseDetail'
import ChapterList from './_components/ChapterList'
import { Button } from '@/components/ui/button'
import { GenerateChapterContent_AI } from '@/configs/AiModel'
import LoadingDialog from '../_components/LoadingDialog'
import service from '@/configs/service'
import { useRouter } from 'next/navigation'

function CourseLayout({ params }) {
  const { user } = useAuth();
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const GenerateChapterContent = async () => {
    setLoading(true);
    const chapters = course?.courseOutput?.course?.chapters;
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index];
      const PROMPT = 'Explain the concept in Detail on Topic:' + course?.name + ', Chapter:' + chapter?.name + ', in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable';
      try {
        let videoId = '';
        const videos = await service.getVideos(course?.name + ':' + chapter?.name);
        videoId = videos[0]?.id?.videoId || '';

        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        const content = JSON.parse(result?.response?.text());

        await supabase.from('chapters').insert({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId
        });
      } catch (e) {
        console.log(e);
      }
    }

    await supabase.from('courseList').update({ publish: true }).eq('courseId', course?.courseId);
    setLoading(false);
    router.replace('/create-course/' + course?.courseId + '/finish');
  }

  return (
    <div className='mt-10 px-7 md:px-20 lg:px-44'>
      <h2 className='font-bold text-center text-2xl'>Course Layout</h2>
      <LoadingDialog loading={loading} />
      <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
      <CourseDetail course={course} />
      <ChapterList course={course} refreshData={() => GetCourse()} />
      <Button onClick={GenerateChapterContent} className="my-10">Generate Course Content</Button>
    </div>
  )
}

export default CourseLayout
