"use client"
import { supabase } from '@/configs/supabase'
import { useAuth } from '@/app/_context/AuthContext'
import { generateWithOpenRouter } from '@/configs/AiModel'
import React, { useEffect, useState } from 'react'
import CourseBasicInfo from './_components/CourseBasicInfo'
import CourseDetail from './_components/CourseDetail'
import ChapterList from './_components/ChapterList'
import { Button } from '@/components/ui/button'
import LoadingDialog from '../_components/LoadingDialog'
import service from '@/configs/service'
import { useRouter, useParams } from 'next/navigation'

function CourseLayoutPage() {
  const params = useParams();
  const courseId = params?.courseId;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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

  const GenerateChapterContent = async () => {
    setLoading(true);
    setError('');
    const chapters = course?.courseOutput?.course?.chapters;
    if (!chapters?.length) {
      setError('No chapters found in course. Please ensure the course layout was generated correctly.');
      setLoading(false);
      return;
    }

    const model = course?.aiModel;
    if (!model) {
      setError('No AI model found for this course. Please recreate the course and select a model.');
      setLoading(false);
      return;
    }

    try {
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
        const prompt =
          'Explain the concept in Detail on Topic: ' + course?.name +
          ', Chapter: ' + chapter?.name +
          '. Return ONLY a JSON array of objects with fields: title (string), description (string, detailed explanation), codeExample (string in <precode> format, or empty string if not applicable).';

        let videoId = '';
        try {
          const query = chapter?.name + ' ' + course?.name + ' tutorial';
          const videos = await service.getVideos(query);
          videoId = videos?.[0]?.id?.videoId || '';
        } catch (videoErr) {
          console.warn('Video fetch failed for chapter', index, videoErr);
        }

        const text = await generateWithOpenRouter(prompt, model);
        const content = JSON.parse(text);

        const { error: insertError } = await supabase.from('chapters').insert({
          chapterId: index,
          courseId: course?.courseId,
          content: content,
          videoId: videoId,
        });
        if (insertError) throw new Error('Failed to save chapter ' + (index + 1) + ': ' + insertError.message);
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

      {course?.aiModel && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>AI Model:</span>
          <span className="font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md">
            {course.aiModel}
          </span>
        </div>
      )}

      <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
      <CourseDetail course={course} />
      <ChapterList course={course} refreshData={() => GetCourse()} />

      <Button onClick={GenerateChapterContent} className="my-10">
        Generate Course Content
      </Button>
    </div>
  )
}

export default CourseLayoutPage
