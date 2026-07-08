"use client"
import React, { useState } from 'react'
import Header from '@/app/dashboard/_components/Header'
import { UserInputContext } from '@/app/_context/UserInputContext'
import AuthGuard from '@/app/_components/AuthGuard'

export default function CreateCourseClient({ children }) {
  const [userCourseInput, setUserCourseInput] = useState([]);

  return (
    <AuthGuard>
      <UserInputContext.Provider value={{ userCourseInput, setUserCourseInput }}>
        <Header />
        {children}
      </UserInputContext.Provider>
    </AuthGuard>
  )
}
