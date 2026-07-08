"use client"

import { UserCourseListContext } from '@/app/_context/UserCourseListContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/app/_context/AuthContext'
import Link from 'next/link';
import React, { useContext, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb as LightbulbIcon, Sparkles as SparklesIcon, Share2 as Share2Icon, DollarSign as DollarSignIcon, ChevronRight as ChevronRightIcon, ChartBar as BarChartIcon } from 'lucide-react';
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { useTheme } from 'next-themes';

function AddCourse() {
    const { user } = useAuth();
    const { userCourseList, setUserCourseList } = useContext(UserCourseListContext);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        // Animate the progress value
        const timer = setTimeout(() => {
            setProgress((userCourseList?.length / 5) * 100);
        }, 300);

        // Click outside handler for menu
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) && 
                !document.getElementById('hamburger-button')?.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [userCourseList?.length, isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    const menuVariants = {
        hidden: { 
            opacity: 0,
            x: -20,
            transition: {
                duration: 0.2
            }
        },
        visible: { 
            opacity: 1,
            x: 0,
            transition: { 
                duration: 0.2,
                staggerChildren: 0.05
            }
        }
    };

    const menuItemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.2 }
        }
    };

    // Menu items
    const menuItems = [
        { id: 1, name: 'Dashboard', path: '/dashboard' },
        { id: 2, name: 'My Courses', path: '/courses' },
        { id: 3, name: 'Create Course', path: '/create-course' },
        { id: 4, name: 'Settings', path: '/settings' },
        { id: 5, name: 'Help & Support', path: '/support' },
    ];

    return (
        <div style={{marginLeft: '0'}} className="relative px-4 sm:px-6 md:px-8">
           
            
            {/* Slide-out Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        ref={menuRef}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Menu</h2>
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                                >
                                    <HiX className="text-xl text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                            
                            {/* User Info */}
                            {user && (
                                <motion.div 
                                    variants={menuItemVariants}
                                    className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {user?.user_metadata?.full_name || 'User'}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {user?.email}
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Menu Items */}
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <motion.div key={item.id} variants={menuItemVariants}>
                                        <Link 
                                            href={item.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors duration-200"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                            
                            {/* Progress Section in Menu */}
                            <motion.div 
                                variants={menuItemVariants}
                                className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700"
                            >
                                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Course Progress
                                </div>
                                <Progress 
                                    value={progress} 
                                    className="h-2 bg-gray-200 dark:bg-gray-700 mb-2"
                                />
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {userCourseList?.length}/5 Courses Created
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Overlay when menu is open */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className='flex flex-col md:flex-row md:items-center md:justify-between 
                       p-6 mt-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 
                       dark:from-gray-900 dark:to-gray-800 shadow-lg'
            >
                <motion.div variants={itemVariants} className="mb-6 md:mb-0 md:max-w-[60%]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="mb-1 inline-block"
                    >
                        <motion.div
                            className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 
                                 text-indigo-700 dark:text-indigo-300 text-xs font-medium"
                            whileHover={{ scale: 1.05 }}
                        >
                            {userCourseList?.length}/5 Courses Created
                        </motion.div>
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className='text-3xl md:text-4xl font-medium mb-2 text-gray-800 dark:text-gray-100'
                    >
                        Hello,{" "}
                        <span className='font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600'>
                            {user?.fullName || user?.user_metadata?.full_name || 'Creator'}
                        </span>
                    </motion.h2>

                    {/* Progress Bar Section */}
                    <motion.div 
                        variants={itemVariants}
                        className="mt-3 mb-4"
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                <BarChartIcon size={16} className="mr-1 text-indigo-500" />
                                Course Creation Progress
                            </span>
                            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                {userCourseList?.length}/5
                            </span>
                        </div>
                        
                        <div className="relative w-full">
                            <Progress 
                                value={progress} 
                                className="h-2.5 bg-gray-200 dark:bg-gray-700"
                            />
                            
                            {/* Milestone markers */}
                            <div className="flex justify-between mt-1 w-full px-0.5">
                                <div className="w-1 h-1"></div>
                                {[1, 2, 3, 4, 5].map((milestone) => (
                                    <div 
                                        key={milestone} 
                                        className={`relative flex flex-col items-center ${milestone === 5 ? "right-0.5" : ""}`}
                                    >
                                        <div 
                                            className={`w-2 h-2 rounded-full ${
                                                userCourseList?.length >= milestone 
                                                    ? "bg-indigo-500" 
                                                    : "bg-gray-300 dark:bg-gray-600"
                                            }`}
                                        ></div>
                                        {milestone === userCourseList?.length && (
                                            <motion.div 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                                className="absolute -top-1 -left-1 w-4 h-4 rounded-full border-2 border-indigo-500 bg-transparent"
                                            ></motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col space-y-2">
                        <motion.p className='text-sm md:text-base text-gray-600 dark:text-gray-300'>
                            What would you like to create today?
                        </motion.p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center"
                                whileHover={{ scale: 1.05, color: '#818cf8' }}
                            >
                                <SparklesIcon size={16} className="mr-1 text-indigo-500" />
                                <span>AI-Powered</span>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex items-center"
                                whileHover={{ scale: 1.05, color: '#818cf8' }}
                            >
                                <Share2Icon size={16} className="mr-1 text-indigo-500" />
                                <span>Sharable</span>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="flex items-center"
                                whileHover={{ scale: 1.05, color: '#818cf8' }}
                            >
                                <DollarSignIcon size={16} className="mr-1 text-indigo-500" />
                                <span>Monetizable</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="relative"
                >
                    {userCourseList?.length >= 5 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-10 right-0 bg-amber-100 dark:bg-amber-900/30 
                                 text-amber-700 dark:text-amber-300 text-xs px-3 py-1 rounded-lg"
                        >
                            Upgrade to create more
                        </motion.div>
                    )}

                    <Link href={userCourseList?.length >= 5 ? 'https://www.tubeguruji.com/tubeguruji-pro' : '/create-course'}>
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button className="relative overflow-hidden group px-6 py-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-lg">
                                <motion.span
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    animate={{
                                        background: [
                                            "linear-gradient(to right, rgb(79, 70, 229), rgb(124, 58, 237))",
                                            "linear-gradient(to right, rgb(124, 58, 237), rgb(79, 70, 229))",
                                            "linear-gradient(to right, rgb(79, 70, 229), rgb(124, 58, 237))"
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                />
                                <span className="relative flex items-center text-base">
                                    <LightbulbIcon size={18} className="mr-2" />
                                    + Create AI Course
                                </span>
                            </Button>
                        </motion.div>
                    </Link>
                    
                    {/* Course quota indicator */}
                    {userCourseList?.length < 5 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex justify-center mt-3 text-xs text-gray-500 dark:text-gray-400"
                        >
                            <span>{5 - userCourseList?.length} free course{(5 - userCourseList?.length) !== 1 ? 's' : ''} remaining</span>
                            <ChevronRightIcon size={14} className="ml-1" />
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    )
}

export default AddCourse