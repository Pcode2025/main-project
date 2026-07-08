"use client"
import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react'
import { HiMiniSquares2X2, HiLightBulb, HiClipboardDocumentCheck, HiSparkles } from "react-icons/hi2";
import SelectCategory from './_components/SelectCategory';
import TopicDescription from './_components/TopicDescription';
import SelectOption from './_components/SelectOption';
import SelectModel from './_components/SelectModel';
import { UserInputContext } from '../_context/UserInputContext';
import { generateWithOpenRouter, parseJsonSafe } from '@/configs/AiModel';
import LoadingDialog from './_components/LoadingDialog';
import { supabase } from '@/configs/supabase';
import uuid4 from 'uuid4';
import { useAuth } from '@/app/_context/AuthContext';
import { useRouter } from 'next/navigation';

function CreateCourse() {
  const StepperOptions = [
    { id: 1, name: 'Category', icon: <HiMiniSquares2X2 /> },
    { id: 2, name: 'Topic & Desc', icon: <HiLightBulb /> },
    { id: 3, name: 'Options', icon: <HiClipboardDocumentCheck /> },
    { id: 4, name: 'AI Model', icon: <HiSparkles /> },
  ]

  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log(userCourseInput);
  }, [userCourseInput])

  const checkStatus = () => {
    if (!userCourseInput || userCourseInput?.length == 0) return true;
    if (activeIndex == 0 && !userCourseInput?.category) return true;
    if (activeIndex == 1 && !userCourseInput?.topic) return true;
    if (activeIndex == 2 && (
      !userCourseInput?.level || !userCourseInput?.duration ||
      !userCourseInput?.displayVideo || !userCourseInput?.noOfChapter
    )) return true;
    if (activeIndex == 3 && !userCourseInput?.selectedModel) return true;
    return false;
  }

  const GenerateCourseLayout = async () => {
    setLoading(true);
    setError('');
    try {
      const prompt =
        'Generate A Course Tutorial on Following Detail With field as Course Name, Description, Along with Chapter Name, about, Duration: ' +
        'Category: ' + userCourseInput?.category +
        ', Topic: ' + userCourseInput?.topic +
        ', Level: ' + userCourseInput?.level +
        ', Duration: ' + userCourseInput?.duration +
        ', NoOf Chapters: ' + userCourseInput?.noOfChapter +
        '. Return ONLY a JSON object with this exact structure: {"course":{"name":"...","description":"...","chapters":[{"name":"...","about":"...","duration":"..."}],"category":"...","topic":"...","level":"...","duration":"...","numberOfChapters":N}}';

      const text = await generateWithOpenRouter(prompt, userCourseInput?.selectedModel);
      const courseLayout = parseJsonSafe(text);
      await SaveCourseLayoutInDb(courseLayout);
    } catch (e) {
      console.error('Course generation error:', e);
      setError('Failed to generate course: ' + (e.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  const SaveCourseLayoutInDb = async (courseLayout) => {
    const id = uuid4();
    const { error: dbError } = await supabase.from('courseList').insert({
      courseId: id,
      name: userCourseInput?.topic,
      level: userCourseInput?.level,
      category: userCourseInput?.category,
      courseOutput: courseLayout,
      createdBy: user?.email,
      userName: user?.user_metadata?.full_name || user?.email,
      userProfileImage: user?.user_metadata?.avatar_url || null,
      user_id: user?.id,
      aiModel: userCourseInput?.selectedModel,
    });

    if (dbError) throw new Error('Failed to save course: ' + dbError.message);
    router.replace('/create-course/' + id);
  }

  const renderStep = () => {
    switch (activeIndex) {
      case 0: return <SelectCategory />;
      case 1: return <TopicDescription />;
      case 2: return <SelectOption />;
      case 3: return <SelectModel />;
      default: return null;
    }
  }

  return (
    <div>
      <div className='flex flex-col justify-center items-center mt-10'>
        <h2 className='text-4xl text-primary font-medium'>Create Course</h2>
        <div className='flex mt-10'>
          {StepperOptions.map((item, index) => (
            <div key={index} className='flex items-center'>
              <div className='flex flex-col items-center w-[50px] md:w-[100px]'>
                <div className={`bg-gray-200 p-3 rounded-full text-white ${activeIndex >= index && 'bg-purple-500'}`}>
                  {item.icon}
                </div>
                <h2 className='hidden md:block md:text-sm'>{item.name}</h2>
              </div>
              {index != StepperOptions?.length - 1 &&
                <div className={`h-1 w-[50px] md:w-[100px] rounded-full lg:w-[120px] bg-gray-300 ${activeIndex - 1 >= index && 'bg-purple-500'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      <div className='px-10 md:px-20 lg:px-44 mt-10'>
        {renderStep()}
        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className='flex justify-between mt-10'>
          <Button
            disabled={activeIndex == 0}
            variant='outline'
            onClick={() => setActiveIndex(activeIndex - 1)}
          >
            Previous
          </Button>
          {activeIndex < 3 && (
            <Button disabled={checkStatus()} onClick={() => setActiveIndex(activeIndex + 1)}>
              Next
            </Button>
          )}
          {activeIndex == 3 && (
            <Button disabled={checkStatus()} onClick={GenerateCourseLayout}>
              Generate Course Layout
            </Button>
          )}
        </div>
      </div>
      <LoadingDialog loading={loading} />
    </div>
  )
}

export default CreateCourse
