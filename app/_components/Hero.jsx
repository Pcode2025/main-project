// app/_components/Hero.jsx
'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import HowItWorks from './HowItWorks'
import CoreFeatures from './CoreFeatures'
import LiveDemo from './LiveDemo'
import Testimonials from './Testimonials'
import BlogPreview from './BlogPreview'
import Developers from './Developers'
import Footer from './Footer'
import Chatbot from './Chatbot'
import PageLoader from './PageLoader'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

// Modern Grid Background Component
const GridBackground = () => {
  const { theme } = useTheme()
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary Grid Pattern */}
      <svg 
        className="absolute w-full h-full" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="grid" 
            width="50" 
            height="50" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}
              strokeWidth="1"
            />
          </pattern>
          
          {/* Accent Grid Pattern */}
          <pattern 
            id="accent-grid" 
            width="200" 
            height="200" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M 200 0 L 0 0 0 200" 
              fill="none" 
              stroke={theme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.08)'}
              strokeWidth="1.5"
            />
          </pattern>
          
          {/* Animated Gradient */}
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: theme === 'dark' ? '#7c3aed' : '#a78bfa', stopOpacity: 0.1 }}>
              <animate 
                attributeName="stop-color" 
                values={theme === 'dark' ? '#7c3aed;#3b82f6;#7c3aed' : '#a78bfa;#60a5fa;#a78bfa'} 
                dur="10s" 
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" style={{ stopColor: theme === 'dark' ? '#3b82f6' : '#60a5fa', stopOpacity: 0 }}>
              <animate 
                attributeName="stop-color" 
                values={theme === 'dark' ? '#3b82f6;#7c3aed;#3b82f6' : '#60a5fa;#a78bfa;#60a5fa'} 
                dur="10s" 
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#accent-grid)" />
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
      
      {/* Animated Lines */}
      <svg 
        className="absolute w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <motion.line
          x1="0" y1="100" x2="100" y2="0"
          stroke={theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}
          strokeWidth="0.2"
          animate={{
            strokeDashoffset: [0, 300],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          strokeDasharray="10 20"
        />
        <motion.line
          x1="0" y1="0" x2="100" y2="100"
          stroke={theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}
          strokeWidth="0.2"
          animate={{
            strokeDashoffset: [0, -300],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          strokeDasharray="10 20"
        />
      </svg>
    </div>
  )
}

function Hero() {
  const [isLoading, setIsLoading] = useState(true)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    // Simulate page load
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Adjust time as needed

    return () => clearTimeout(timer)
  }, [])

  // If still loading, show PageLoader
  if (isLoading) {
    return <PageLoader />
  }

  const handleButtonClick = (e) => {
    e.preventDefault()
    setIsButtonLoading(true)
    
    // Simulate loading process
    setTimeout(() => {
      window.location.href = '/dashboard'
    }, 2000) // Redirect after 2 seconds
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // SVG Icons as components
  const TemplateIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )

  const SupportIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black transition-colors">
        {/* Modern Grid Background */}
        <GridBackground />
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
              <span className="block text-gray-900 dark:text-white">Generate Complete</span>
              <span className="block mt-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                AI-Powered Courses
              </span>
              <span className="block text-gray-900 dark:text-white">in Minutes</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Built for Students, Professors, and Coaches. Create engaging study plans, curriculum, and assessments powered by advanced AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 animate-fade-in-up animation-delay-400">
              <Link href="/dashboard" className="group">
                <Button 
                  size="lg" 
                  onClick={handleButtonClick}
                  disabled={isButtonLoading}
                  className={`
                    w-full 
                    sm:w-auto 
                    px-8 
                    py-6 
                    bg-gradient-to-r 
                    from-violet-600 
                    to-indigo-600 
                    hover:from-violet-700 
                    hover:to-indigo-700 
                    text-white 
                    text-lg 
                    font-semibold 
                    rounded-2xl 
                    shadow-lg 
                    shadow-violet-500/30 
                    hover:shadow-xl 
                    hover:shadow-violet-500/40 
                    transform 
                    transition-all 
                    duration-200
                    relative
                    ${isButtonLoading ? 'cursor-not-allowed opacity-90' : 'hover:scale-105'}
                  `}
                >
                  {isButtonLoading ? (
                    <div className="flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          transition: {
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                          }
                        }}
                        className="w-6 h-6 border-4 border-t-4 border-white border-t-violet-400 rounded-full mr-2"
                      />
                      Loading...
                    </div>
                  ) : (
                    <>
                      Try it Free
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </Button>
              </Link>
              <Button 
                size="lg"
                onClick={openModal}
                className="w-full sm:w-auto px-8 py-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-2xl hover:border-violet-500 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transform hover:scale-105 transition-all duration-200"
              >
                Watch Demo
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Hero Image/Animation - Responsive with moving glowing border */}
          <div className="mt-20 relative px-4 animate-fade-in animation-delay-600">
            <div className="relative max-w-5xl mx-auto">
              {/* Glow effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl"></div>
              
              {/* Glowing border container */}
              <div className="relative">
                {/* Animated glowing border with moving effect */}
                <motion.div 
                  className="absolute -inset-0.5 rounded-2xl z-0 overflow-hidden"
                >
                  {/* Left to right moving glow */}
                  <motion.div
                    className="absolute top-0 -left-96 w-96 h-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0), rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0), transparent)"
                    }}
                    animate={{
                      x: ["-100%", "300%"]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Right to left moving glow (delayed) */}
                  <motion.div
                    className="absolute bottom-0 -right-96 w-96 h-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0), rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0), transparent)"
                    }}
                    animate={{
                      x: ["300%", "-100%"]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2.5
                    }}
                  />
                  
                  {/* Top to bottom moving glow */}
                  <motion.div
                    className="absolute left-0 -top-96 w-full h-96"
                    style={{
                      background: "linear-gradient(180deg, transparent, rgba(139, 92, 246, 0), rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0), transparent)"
                    }}
                    animate={{
                      y: ["-100%", "300%"]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.25
                    }}
                  />
                  
                  {/* Bottom to top moving glow (delayed) */}
                  <motion.div
                    className="absolute right-0 -bottom-96 w-full h-96"
                    style={{
                      background: "linear-gradient(180deg, transparent, rgba(139, 92, 246, 0), rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0), transparent)"
                    }}
                    animate={{
                      y: ["300%", "-100%"]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 3.75
                    }}
                  />
                  
                  {/* Base gradient background for the border */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-indigo-600/30" />
                  
                  {/* Rotating gradient overlay for extra effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-indigo-600/10"
                    animate={{
                      rotate: 360
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
                
                {/* Main content box */}
                <div className="relative aspect-video w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl z-10">
                  {/* Grid overlay with rotating animation */}
                  <motion.div 
                    className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"
                    animate={{
                      rotate: 360
                    }}
                    transition={{
                      duration: 240,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Floating orbs */}
                  <motion.div 
                    className="absolute w-24 h-24 rounded-full bg-violet-500/20 blur-md"
                    animate={{
                      x: [0, 100, 50, 0],
                      y: [0, 50, 100, 0],
                      scale: [1, 1.2, 0.8, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      top: '20%',
                      left: '10%'
                    }}
                  />
                  
                  <motion.div 
                    className="absolute w-20 h-20 rounded-full bg-blue-500/20 blur-md"
                    animate={{
                      x: [0, -50, -100, 0],
                      y: [0, 100, 50, 0],
                      scale: [1, 0.8, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{
                      duration: 18,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                    style={{
                      top: '15%',
                      right: '15%'
                    }}
                  />
                  
                  {/* Floating UI elements */}
                  <div className="absolute inset-0 p-8">
                    <motion.div 
                      className="absolute top-8 left-8 w-32 h-8 bg-gray-700/50 rounded-lg"
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div 
                      className="absolute top-8 right-8 w-24 h-8 bg-gray-700/50 rounded-lg"
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                    <motion.div 
                      className="absolute bottom-8 left-8 right-8 h-16 bg-gray-700/50 rounded-lg"
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                      }}
                    />
                  </div>
                  
                  {/* Central Logo/Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="relative"
                      animate={{
                        scale: [1, 1.02, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Image 
                        src="/download.jpg" 
                        alt="AI Course Generator" 
                        width={1472}
                        height={832}
                        style={{height: '100%'}}
                        className="rounded-lg shadow-2xl"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Responsive */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<TemplateIcon />}
              title="25+ Templates"
              description="Ready-to-use course templates for different subjects"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard 
              icon="/creative.png"
              title="Customizable"
              description="Tailor courses to your specific needs"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard 
              icon="/lotus.png"
              title="Free to Use"
              description="Start creating courses at no cost"
              gradient="from-emerald-500 to-teal-500"
            />
            <FeatureCard 
              icon={<SupportIcon />}
              title="24/7 Support"
              description="Get help whenever you need it"
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                >
                  <source src="/video.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional Sections in Sequence */}
      <HowItWorks />
      <CoreFeatures />
      <LiveDemo />
      <Testimonials />
      <BlogPreview />
      <Developers />
      <Footer />
      <Chatbot />
    </>
  )
}

const FeatureCard = ({ icon, title, description, gradient }) => (
  <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    {/* Gradient overlay on hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
    
    <div className={`relative w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-${gradient.split('-')[1]}-500/30`}>
      {typeof icon === 'string' ? (
        <Image
          src={icon}
          alt={title}
          width={24}
          height={24}
          className="w-6 h-6 filter brightness-0 invert"
        />
      ) : (
        icon
      )}
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {description}
    </p>
  </div>
)

export default Hero