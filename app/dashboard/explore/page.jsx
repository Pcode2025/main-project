"use client"
import { supabase } from '@/configs/supabase'
import React, { useEffect, useState, useMemo } from 'react'
import CourseCard from '../_components/CourseCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineXMark, HiOutlineAcademicCap } from "react-icons/hi2"
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  'All',
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Development',
  'Photography',
  'Music',
  'Health',
  'Finance',
  'Science',
]

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

const PAGE_SIZE = 12

function Explore() {
  const [courseList, setCourseList] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [showFilters, setShowFilters] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    GetAllCourses()
  }, [pageIndex, selectedCategory, selectedLevel, searchQuery])

  const GetAllCourses = async () => {
    setLoading(true)
    let query = supabase
      .from('courseList')
      .select('*', { count: 'exact' })

    if (selectedCategory !== 'All') {
      query = query.ilike('category', `%${selectedCategory}%`)
    }

    if (selectedLevel !== 'All Levels') {
      query = query.ilike('level', `%${selectedLevel}%`)
    }

    if (searchQuery.trim()) {
      query = query.ilike('name', `%${searchQuery.trim()}%`)
    }

    const { data, error, count } = await query
      .order('id', { ascending: false })
      .range(pageIndex * PAGE_SIZE, pageIndex * PAGE_SIZE + PAGE_SIZE - 1)

    if (!error) {
      setCourseList(data || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const hasActiveFilters = selectedCategory !== 'All' || selectedLevel !== 'All Levels' || searchQuery.trim()

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedLevel('All Levels')
    setSearchQuery('')
    setPageIndex(0)
  }

  const handleSearch = (value) => {
    setSearchQuery(value)
    setPageIndex(0)
  }

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat)
    setPageIndex(0)
  }

  const handleLevelChange = (level) => {
    setSelectedLevel(level)
    setPageIndex(0)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          Explore Courses
        </h1>
        <p className="mt-1 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Discover AI-generated courses created by the community
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button (mobile) */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden h-11 gap-2"
          >
            <HiOutlineFunnel className="text-lg" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>

          {/* Desktop Filters */}
          <div className="hidden sm:flex gap-2 items-center">
            {/* Level Select */}
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="h-11 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-red-500 gap-1"
              >
                <HiOutlineXMark className="text-base" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">Level</label>
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => handleLevelChange(level)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedLevel === level
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full gap-1">
                    <HiOutlineXMark /> Clear All Filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {totalCount} course{totalCount !== 1 ? 's' : ''} found
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-2 text-indigo-500 hover:underline">
              clear filters
            </button>
          )}
        </div>
      )}

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-xl aspect-[16/9]" />
              <div className="mt-3 space-y-2 px-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : courseList.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {courseList.map((course, index) => (
            <motion.div
              key={course.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CourseCard course={course} displayUser={true} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <HiOutlineAcademicCap className="text-3xl sm:text-4xl text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
            No courses found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            {hasActiveFilters
              ? 'Try adjusting your search or filter criteria'
              : 'Be the first to create a course!'}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="mt-4 gap-1">
              <HiOutlineXMark /> Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex(pageIndex - 1)}
            className="h-9 px-4"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let page = i
              if (totalPages > 5) {
                if (pageIndex < 3) page = i
                else if (pageIndex > totalPages - 4) page = totalPages - 5 + i
                else page = pageIndex - 2 + i
              }
              return (
                <button
                  key={page}
                  onClick={() => setPageIndex(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    pageIndex === page
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {page + 1}
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={pageIndex >= totalPages - 1}
            onClick={() => setPageIndex(pageIndex + 1)}
            className="h-9 px-4"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default Explore
