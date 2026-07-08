'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/app/_context/AuthContext'
import { useTheme } from 'next-themes'
import { Sun as SunIcon, Moon as MoonIcon, Chrome as Home } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function Header() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <span className="hidden sm:inline text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              AI Course Generator
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {mounted && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            )}

            {!user && (
              <Link href="/sign-in" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
