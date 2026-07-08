import React from 'react'
import AddCourse from './_components/AddCourse'
import UserCourseList from './_components/UserCourseList'
import Footer from './_components/Footer'

function Dashboard() {
  return (
    <div>
      <AddCourse />
      <UserCourseList />
      <br />
      <Footer />
    </div>
  )
}

export default Dashboard