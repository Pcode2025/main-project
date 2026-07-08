import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { HiOutlineRectangleStack } from "react-icons/hi2";
import EditCourseBasicInfo from './EditCourseBasicInfo';
import { supabase } from '@/configs/supabase';
import Link from 'next/link';

const DEFAULT_BANNERS = [
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
];

function getDefaultBanner(courseId) {
  if (!courseId) return DEFAULT_BANNERS[0];
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = ((hash << 5) - hash) + courseId.charCodeAt(i);
    hash |= 0;
  }
  return DEFAULT_BANNERS[Math.abs(hash) % DEFAULT_BANNERS.length];
}

function CourseBasicInfo({ course, refreshData, edit = true }) {
  const [selectedFile, setSelectedFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (course) {
      setSelectedFile(course?.courseBanner);
    }
  }, [course]);

  const onFileSelected = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setUploadError('');
      setSelectedFile(URL.createObjectURL(file));
      setUploading(true);

      const fileExt = file.name.split('.').pop().toLowerCase();
      const filePath = `banner-${course?.courseId}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('course-banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-banners')
        .getPublicUrl(uploadData.path);

      const { error: dbError } = await supabase
        .from('courseList')
        .update({ courseBanner: publicUrl })
        .eq('id', course?.id);

      if (dbError) throw dbError;

      setSelectedFile(publicUrl);
      if (refreshData) refreshData(true);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Upload failed');
      setSelectedFile(course?.courseBanner || null);
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
              {/* Plain img tag handles both blob: preview URLs and Supabase storage URLs */}
              <img
                src={selectedFile || getDefaultBanner(course?.courseId)}
                className='w-full rounded-xl h-[250px] object-cover cursor-pointer'
                alt="Course banner"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                  <div className="text-white font-medium">Uploading...</div>
                </div>
              )}
              {!uploading && edit && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 bg-black/30 transition-opacity duration-200">
                  <div className="bg-white/90 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg">
                    Click to change image
                  </div>
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
