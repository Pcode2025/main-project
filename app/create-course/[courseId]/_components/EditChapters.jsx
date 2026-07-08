'use client'

import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HiPencilSquare } from "react-icons/hi2";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogClose } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/configs/supabase';

function EditChapters({ course, index, refreshData }) {
  const chapters = course?.courseOutput?.course?.chapters;
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  useEffect(() => {
    if (chapters?.[index]) {
      setName(chapters[index].name);
      setAbout(chapters[index].about);
    }
  }, [course, index])

  const onUpdateHandler = async () => {
    const updatedCourseOutput = { ...course.courseOutput };
    updatedCourseOutput.course.chapters[index].name = name;
    updatedCourseOutput.course.chapters[index].about = about;

    const { error } = await supabase
      .from('courseList')
      .update({ courseOutput: updatedCourseOutput })
      .eq('id', course?.id);

    if (!error) refreshData(true);
  }

  return (
    <Dialog>
      <DialogTrigger><HiPencilSquare /></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>
          <DialogDescription>
            <div className='mt-3'>
              <label>Chapter Title</label>
              <Input
                defaultValue={chapters?.[index]?.name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='mt-3'>
              <label>Description</label>
              <Textarea
                className="h-40"
                defaultValue={chapters?.[index]?.about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button onClick={onUpdateHandler}>Update</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditChapters
