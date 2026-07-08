import { UserInputContext } from '@/app/_context/UserInputContext'
import React, { useContext } from 'react'
import { Input } from '@/components/ui/input'

function SelectCategory() {
    const { userCourseInput, setUserCourseInput } = useContext(UserInputContext);

    const handleCategoryChange = (e) => {
        setUserCourseInput(prev => ({
            ...prev,
            category: e.target.value
        }))
    }

    return (
        <div className='px-10 md:px-20'>
            <h2 className='my-5 text-lg font-medium'>Enter the Course Category</h2>
            <p className='text-sm text-gray-500 mb-3'>
                Type the category for your course (e.g., Programming, Marketing, Design, Finance, Music)
            </p>
            <Input
                placeholder='e.g., Web Development'
                value={userCourseInput?.category || ''}
                onChange={handleCategoryChange}
                className='max-w-md'
            />
        </div>
    )
}

export default SelectCategory
