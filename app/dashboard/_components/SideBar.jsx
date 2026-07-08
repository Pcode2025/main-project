"use client"

import { Progress } from '@/components/ui/progress';
import Image from 'next/image'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useContext, useState, useEffect, useRef } from 'react'
import { HiOutlineHome, HiOutlineSquare3Stack3D, HiOutlineShieldCheck } from "react-icons/hi2";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { useAuth } from '@/app/_context/AuthContext';
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { SunIcon, MoonIcon, BellIcon, UserIcon, LogOutIcon, GraduationCapIcon, ExternalLinkIcon } from 'lucide-react'

function TopNavBar() {
    const { userCourseList } = useContext(UserCourseListContext);
    const router = useRouter();
    const path = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { user, loading, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const navbarRef = useRef(null);
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        const handleClickOutside = (event) => {
            if (isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                navbarRef.current &&
                !navbarRef.current.querySelector('#navbar-toggle')?.contains(event.target)) {
                setIsOpen(false);
            }
            if (isNotificationOpen &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                !event.target.closest('#notification-toggle')) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isNotificationOpen]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    const Menu = [
        { id: 1, name: 'Home', icon: <HiOutlineHome className="text-indigo-500" size={20} />, path: '/dashboard' },
        { id: 2, name: 'Explore', icon: <HiOutlineSquare3Stack3D className="text-indigo-500" size={20} />, path: '/dashboard/explore' },
        { id: 3, name: 'Upgrade', icon: <HiOutlineShieldCheck className="text-indigo-500" size={20} />, path: '/dashboard/upgrade' }
    ]

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    }

    const courseProgress = ((userCourseList?.length || 0) / 5) * 100;

    const dropdownVariants = {
        hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, staggerChildren: 0.05 } }
    };
    const sidebarVariants = {
        hidden: { opacity: 0, x: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut", staggerChildren: 0.05, when: "beforeChildren" } }
    };
    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.2 } }
    };

    const notificationCount = 3;
    const displayName = user?.user_metadata?.full_name || user?.email || 'User';
    const initials = displayName?.[0]?.toUpperCase() || 'U';

    return (
        <>
            <div ref={navbarRef} className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 shadow-md z-50 px-4 transition-colors duration-300">
                <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button id="navbar-toggle" onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                            {isOpen ? <HiX className="text-2xl" /> : <HiMenuAlt2 className="text-2xl" />}
                        </button>
                        <Image src={'/logo.svg'} width={120} height={40} alt="Logo" className="hidden sm:block" />
                    </div>

                    <div className="hidden lg:flex items-center space-x-1">
                        {Menu.map((item) => (
                            <Link key={item.id} href={item.path}>
                                <div className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200 ${item.path === path ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'}`}>
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-3">
                        <div className="relative">
                            <button id="notification-toggle" onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-200 relative">
                                <BellIcon size={20} />
                                {notificationCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{notificationCount}</span>
                                )}
                            </button>
                            <AnimatePresence>
                                {isNotificationOpen && (
                                    <motion.div ref={notificationRef} initial="hidden" animate="visible" exit="hidden" variants={dropdownVariants}
                                        className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{notificationCount}</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                                                    <div className="flex items-start">
                                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <UserIcon size={16} className="text-white" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Welcome {displayName}!</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Ready to continue your learning journey?</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Just now</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
                                                    <div className="flex items-start">
                                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <GraduationCapIcon size={16} className="text-white" />
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Course Progress</h4>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{userCourseList?.length || 0}/5 courses ({Math.round(courseProgress)}%)</p>
                                                            <div className="mt-2">
                                                                <Progress value={courseProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 hours ago</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                                                    <div className="flex items-start">
                                                        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <ExternalLinkIcon size={16} className="text-white" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Check out our design services</h4>
                                                            <a href="https://www.mydesignnexus.in/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 mt-1">
                                                                mydesignnexus.in <ExternalLinkIcon size={12} className="ml-1" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {mounted && (
                            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div key={theme} initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
                                    </motion.div>
                                </AnimatePresence>
                            </button>
                        )}

                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                            {initials}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black z-40 top-16" onClick={() => setIsOpen(false)} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div ref={dropdownRef} initial="hidden" animate="visible" exit="hidden" variants={sidebarVariants}
                        className="fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-40 overflow-y-auto">
                        <div className="p-4">
                            {user && (
                                <motion.div variants={itemVariants} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                                            {initials}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants} className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
                                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{userCourseList?.length || 0}/5</span>
                                </div>
                                <Progress value={courseProgress} className="h-2 bg-gray-200 dark:bg-gray-700 mb-2" />
                                <div className="text-xs text-gray-500 dark:text-gray-400">{5 - (userCourseList?.length || 0)} more courses until upgrade required</div>
                            </motion.div>

                            <nav className="mb-6">
                                <div className="text-xs uppercase font-semibold text-gray-400 dark:text-gray-500 mb-2 px-4">Main Navigation</div>
                                {Menu.map((item) => (
                                    <motion.div key={item.id} variants={itemVariants}>
                                        <Link href={item.path} onClick={() => setIsOpen(false)}>
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors duration-200 ${item.path === path ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                                {item.icon}
                                                <span className="font-medium">{item.name}</span>
                                                {item.path === path && <div className="ml-auto h-2 w-2 rounded-full bg-indigo-500"></div>}
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="mb-6">
                                <div className="text-xs uppercase font-semibold text-gray-400 dark:text-gray-500 mb-2 px-4">Settings</div>
                                <motion.div variants={itemVariants}>
                                    <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-left">
                                        {theme === 'dark' ? <SunIcon size={20} className="text-indigo-500" /> : <MoonIcon size={20} className="text-indigo-500" />}
                                        <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                                    </button>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-left">
                                        <LogOutIcon size={20} />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="px-4">
                                <Link href="/create-course" onClick={() => setIsOpen(false)}>
                                    <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center">
                                        <span className="mr-2">+</span>
                                        Create New Course
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-16"></div>

            <AnimatePresence>
                {isProfileModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black z-50" onClick={() => setIsProfileModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</h2>
                                    <button onClick={() => setIsProfileModalOpen(false)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                                        <HiX size={20} />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {user ? (
                                        <div className="space-y-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-2xl">
                                                    {initials}
                                                </div>
                                                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{displayName}</h3>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                                                <p className="text-gray-900 dark:text-gray-100 font-medium">{user?.email}</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User ID</label>
                                                <p className="text-gray-900 dark:text-gray-100 font-mono text-sm break-all">{user?.id}</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Learning Progress</label>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Courses Created</span>
                                                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{userCourseList?.length || 0}/5</span>
                                                </div>
                                                <Progress value={courseProgress} className="h-3 bg-gray-200 dark:bg-gray-700 mb-2" />
                                                <div className="text-xs text-gray-600 dark:text-gray-400 text-center">{Math.round(courseProgress)}% Complete</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <UserIcon size={48} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-500">Loading user information...</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                                    <button onClick={() => setIsProfileModalOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">Close</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default TopNavBar
