'use client'

import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './_context/AuthContext'
import { UserCourseListContext } from './_context/UserCourseListContext'
import { useState } from 'react'

export function Providers({ children }) {
  const [userCourseList, setUserCourseList] = useState([]);

  return (
    <AuthProvider>
      <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </UserCourseListContext.Provider>
    </AuthProvider>
  )
}
