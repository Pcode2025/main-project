"use client"
import React, { useEffect } from 'react'
import SideBar from './_components/SideBar'
import { useAuth } from '@/app/_context/AuthContext'
import { useRouter } from 'next/navigation'

function DashboardLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div>
      <SideBar />
      {children}
    </div>
  )
}

export default DashboardLayout