"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import {
    HiOutlineBookOpen,
    HiMiniEllipsisVertical,
    HiOutlineStar,
    HiStar,
    HiOutlineVideoCamera,
    HiOutlineShieldCheck
} from "react-icons/hi2";
import DropdownOption from './DropdownOption';
import { supabase } from '@/configs/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DEFAULT_BANNERS = [
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
];

function getDefaultBanner(courseId) {
  if (!courseId) return DEFAULT_BANNERS[0];
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = ((hash << 5) - hash) + courseId.charCodeAt(i);
    hash |= 0;
  }
  return DEFAULT_BANNERS[Math.abs(hash) % DEFAULT_BANNERS.length];
}

function CourseCard({ course, refreshData, displayUser = false }) {
    const [isHovered, setIsHovered] = useState(false);
    const [rating, setRating] = useState(0);
    const [hasVideos, setHasVideos] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Generate a random rating between 4.0 and 5.0
        const randomRating = (4 + Math.random()).toFixed(1);
        setRating(randomRating);

        // Randomly determine if course has videos (70% chance)
        setHasVideos(Math.random() > 0.3);

        // Check if device is mobile
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkIsMobile();

        // Add resize listener
        window.addEventListener('resize', checkIsMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [course?.id]);

    const handleOnDelete = async () => {
        const { error } = await supabase
            .from('courseList')
            .delete()
            .eq('id', course?.id);

        if (!error) {
            refreshData()
        }
    }

    // Extract first letter of each word for the fallback banner
    const getInitials = (name) => {
        if (!name) return "C";
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    // Color variants based on category
    const getCategoryColor = (category) => {
        const categoryMap = {
            'Programming': 'bg-blue-500',
            'Design': 'bg-pink-500',
            'Business': 'bg-green-500',
            'Marketing': 'bg-yellow-500',
            'Development': 'bg-purple-500',
            'Photography': 'bg-orange-500',
            'Music': 'bg-red-500',
            'Health': 'bg-teal-500'
        };

        return categoryMap[category] || 'bg-indigo-500';
    };

    const categoryColor = getCategoryColor(course?.category);

    // Render star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<HiStar key={`full-${i}`} className="text-yellow-400" />);
        }

        // Add half star if needed (using full star for simplicity)
        if (hasHalfStar) {
            stars.push(<HiStar key="half" className="text-yellow-400" />);
        }

        // Empty stars
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<HiOutlineStar key={`empty-${i}`} className="text-yellow-400" />);
        }

        return stars;
    }

    return (
        <>
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={!isMobile ? {
                        y: -5,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transition: { duration: 0.2 }
                    } : {}}
                    onHoverStart={() => !isMobile && setIsHovered(true)}
                    onHoverEnd={() => !isMobile && setIsHovered(false)}
                    // Added responsive width classes
                    className='relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 w-full'
                >
                    {/* Top Right Badge for Course Level */}
                    <div className="absolute top-2 right-2 z-10">
                        <div className="px-2 py-1 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700 text-xs md:text-sm font-medium flex items-center gap-1">
                            <HiOutlineShieldCheck className="text-indigo-500" />
                            <span className="text-gray-700 dark:text-gray-200">{course?.level || "All Levels"}</span>
                        </div>
                    </div>

                    {/* "Has Video" Badge */}
                    {hasVideos && (
                        <div className="absolute top-2 left-2 z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="px-2 py-1 rounded-lg bg-red-500 text-white text-xs md:text-sm font-medium flex items-center gap-1 shadow-sm"
                            >
                                <HiOutlineVideoCamera className="text-white" />
                                <span>Video</span>
                            </motion.div>
                        </div>
                    )}

                    <Link href={'/course/' + course?.courseId}>
                        <div className="relative aspect-[16/9] overflow-hidden">
                            {course?.courseBanner ? (
                                <motion.div
                                    animate={{
                                        scale: isHovered ? 1.05 : 1
                                    }}
                                    transition={{ duration: 0.4 }}
                                    className="h-full w-full"
                                >
                                    <Image
                                        src={course?.courseBanner}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        alt={course?.courseOutput?.course?.name || "Course banner"}
                                        className='object-cover w-full h-full'
                                        priority
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    animate={{
                                        scale: isHovered ? 1.05 : 1
                                    }}
                                    transition={{ duration: 0.4 }}
                                    className="h-full w-full"
                                >
                                    <img
                                        src={getDefaultBanner(course?.courseId)}
                                        alt={course?.courseOutput?.course?.name || "Course banner"}
                                        className='object-cover w-full h-full'
                                    />
                                </motion.div>
                            )}

                            {/* Category Tag */}
                            <div className="absolute bottom-3 left-3">
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-md ${categoryColor} text-white text-xs font-medium shadow-md`}
                                >
                                    {course?.category || "Course"}
                                </motion.div>
                            </div>

                            {/* Hover Overlay - Only visible on non-mobile */}
                            {!isMobile && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isHovered ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end"
                                >
                                    <div className="p-3 sm:p-4 w-full">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-white text-sm font-medium flex items-center justify-between"
                                        >
                                            <span>View Course</span>
                                            <span className="bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm text-xs">
                                                {hasVideos ? 'Includes Videos' : 'Text-based'}
                                            </span>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Always visible on mobile devices */}
                            {isMobile && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                    <div className="p-3 w-full">
                                        <div className="text-white text-xs font-medium flex items-center justify-between">
                                            <span>Tap to View</span>
                                            <span className="bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm text-xs">
                                                {hasVideos ? 'Videos' : 'Text'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Link>

                    <div className='p-3 sm:p-4'>
                        <div className="flex justify-between items-start mb-2">
                            <Link href={'/course/' + course?.courseId} className="block flex-1">
                                <h2 className='font-semibold text-base sm:text-lg text-gray-800 dark:text-white line-clamp-2 leading-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'>
                                    {course?.courseOutput?.course?.name || "Untitled Course"}
                                </h2>
                            </Link>

                            {!displayUser && (
                                <div className="ml-2">
                                    <DropdownOption handleOnDelete={() => handleOnDelete()}>
                                        <HiMiniEllipsisVertical className="text-gray-500 dark:text-gray-400 text-xl" />
                                    </DropdownOption>
                                </div>
                            )}
                        </div>

                        {/* Star Rating - Amazon Style */}
                        <div className="flex items-center mb-2">
                            <div className="flex items-center mr-2 text-sm sm:text-base">
                                {renderStars(rating)}
                            </div>
                            <span className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                {rating}/5
                            </span>
                        </div>

                        <div className="flex justify-between items-center flex-wrap gap-y-2">
                            <div className='flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-xs text-gray-700 dark:text-gray-300'>
                                <HiOutlineBookOpen className="text-indigo-500 dark:text-indigo-400" />
                                <span>{course?.courseOutput?.course?.numberOfChapters || 0} Chapters</span>
                            </div>

                            {/* "Prime" like badge if it has videos */}
                            {hasVideos && (
                                <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-sm font-medium">
                                    Premium
                                </span>
                            )}
                        </div>

                        {displayUser && (
                            <div className='flex items-center mt-3 border-t pt-3 border-gray-100 dark:border-gray-700'>
                                <div className="relative h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3">
                                    {course?.userProfileImage ? (
                                        <Image
                                            src={course?.userProfileImage}
                                            fill
                                            sizes="32px"
                                            alt={course?.userName || "User"}
                                            className='rounded-full object-cover border-2 border-white dark:border-gray-800'
                                        />
                                    ) : (
                                        <div className="h-full w-full rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                                            <span className="text-indigo-600 dark:text-indigo-300 text-xs font-medium">
                                                {getInitials(course?.userName)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className='text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200'>
                                        {course?.userName || "Anonymous"}
                                    </h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        Course Creator
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Amazon-style "Free Shipping" equivalent */}
                        <div className="mt-3 text-xs text-green-600 dark:text-green-400 font-medium truncate">
                            Free lifetime access {hasVideos && "with video content"}
                        </div>
                    </div>

                    {/* Progress indicator - maintained from original */}
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "35%" }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className={`h-full ${categoryColor}`}
                        ></motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default CourseCard