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
  const [error, setError] = useState('');

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
    setError('');
    const chapters = course?.courseOutput?.course?.chapters;
    if (!chapters?.length) {
      setError('No chapters found in course.');
      setLoading(false);
      return;
    }
    try {
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
        const PROMPT = 'Explain the concept in Detail on Topic:' + course?.name + ', Chapter:' + chapter?.name + ', in JSON Format with list of array with field as title, description in detail, Code Example(Code field in <precode> format) if applicable';
        let videoId = '';
        try {
          const videos = await service.getVideos(course?.name + ':' + chapter?.name);
          videoId = videos[0]?.id?.videoId || '';
        } catch (videoErr) {
          console.warn('Video fetch failed for chapter', index, videoErr);
        }

        const result = await GenerateChapterContent_AI.sendMessage(PROMPT);
        const text = result?.response?.text();
        if (!text) throw new Error('Empty AI response for chapter ' + chapter?.name);
        const content = JSON.parse(text);

        const { error: insertError } = await supabase.from('chapters').insert({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId
        });
        if (insertError) throw new Error('Failed to save chapter: ' + insertError.message);
      }

      await supabase.from('courseList').update({ publish: true }).eq('courseId', course?.courseId);
      router.replace('/create-course/' + course?.courseId + '/finish');
    } catch (e) {
      console.error('Chapter generation error:', e);
      setError('Error generating content: ' + (e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='mt-10 px-7 md:px-20 lg:px-44'>
      <h2 className='font-bold text-center text-2xl'>Course Layout</h2>
      <LoadingDialog loading={loading} />
      {error && (
        <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}
      <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
      <CourseDetail course={course} />
      <ChapterList course={course} refreshData={() => GetCourse()} />
      <Button onClick={GenerateChapterContent} className="my-10">Generate Course Content</Button>
    </div>
  )
}

export default CourseLayout
