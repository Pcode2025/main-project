import React from 'react'
import SideBar from './_components/SideBar'
import AuthGuard from '../_components/AuthGuard'

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div>
        <SideBar />
        {children}
      </div>
    </AuthGuard>
  )
}
