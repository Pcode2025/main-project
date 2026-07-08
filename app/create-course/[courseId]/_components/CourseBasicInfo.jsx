import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { HiOutlinePuzzle } from "react-icons/hi";
import { HiOutlineRectangleStack } from "react-icons/hi2";
import EditCourseBasicInfo from './EditCourseBasicInfo';
import { supabase } from '@/configs/supabase';
import Link from 'next/link';

function CourseBasicInfo({ course, refreshData, edit = true }) {
  const [selectedFile, setSelectedFile] = useState();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (course) {
      setSelectedFile(course?.courseBanner);
    }
  }, [course]);

  const onFileSelected = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setSelectedFile(URL.createObjectURL(file));
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const filePath = `banner-${course?.courseId}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-banners')
        .getPublicUrl(uploadData.path);

      await supabase
        .from('courseList')
        .update({ courseBanner: publicUrl })
        .eq('id', course?.id);

      setSelectedFile(publicUrl);
      if (refreshData) refreshData(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className='p-10 border rounded-xl shadow-sm mt-5 relative'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div>
          <h2 className='font-bold text-3xl'>{course?.courseOutput?.course?.name}
            {edit && <EditCourseBasicInfo course={course} refreshData={() => refreshData(true)} />}
          </h2>
          <p className='text-sm text-gray-400 mt-3'>{course?.courseOutput?.course?.description}</p>
          <h2 className='font-medium mt-2 flex gap-2 items-center text-primary'><HiOutlineRectangleStack />{course?.category}</h2>
          {!edit && (
            <Link href={'/course/' + course?.courseId + "/start"}>
              <Button className="w-full mt-5">Start</Button>
            </Link>
          )}
        </div>
        <div>
          <label htmlFor='upload-image'>
            <div className="relative">
              <Image
                src={selectedFile ? selectedFile : '/placeholder.png'}
                width={300}
                height={300}
                className='w-full rounded-xl h-[250px] object-cover cursor-pointer'
                alt="Course banner"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                  <div className="text-white">Uploading...</div>
                </div>
              )}
            </div>
          </label>
          {edit && (
            <input
              type="file"
              id="upload-image"
              accept="image/*"
              className='opacity-0'
              onChange={onFileSelected}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseBasicInfo
