'use client'
import React, { useContext } from 'react'
import { UserInputContext } from '@/app/_context/UserInputContext'
import { motion } from 'framer-motion'

const MODELS = [
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    badge: 'Free',
    badgeColor: 'bg-green-100 text-green-700',
    description: 'Fast & free. Great for straightforward course outlines.',
    icon: '🦙',
  },
  {
    id: 'google/gemma-2-9b-it:free',
    name: 'Gemma 2 9B',
    provider: 'Google',
    badge: 'Free',
    badgeColor: 'bg-green-100 text-green-700',
    description: 'Google\'s efficient open model. Reliable JSON output.',
    icon: '💎',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    badge: 'Free',
    badgeColor: 'bg-green-100 text-green-700',
    description: 'Lightweight & fast. Good for quick course generation.',
    icon: '🌊',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    badge: 'Best Value',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: 'Smart & affordable. Excellent structure and detail.',
    icon: '⚡',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    badge: 'Fast',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: 'Very fast Anthropic model. Clean, well-structured output.',
    icon: '🎋',
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    provider: 'Google',
    badge: 'Fast',
    badgeColor: 'bg-blue-100 text-blue-700',
    description: 'Google\'s speedy model. Great for detailed courses.',
    icon: '✨',
  },
  {
    id: 'meta-llama/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    badge: 'Powerful',
    badgeColor: 'bg-orange-100 text-orange-700',
    description: 'Large open model. High quality, comprehensive content.',
    icon: '🦁',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'Premium',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: 'Top-tier quality. Best for complex, in-depth courses.',
    icon: '🎼',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    badge: 'Most Capable',
    badgeColor: 'bg-purple-100 text-purple-700',
    description: 'OpenAI flagship. Exceptional depth and accuracy.',
    icon: '🧠',
  },
]

function SelectModel() {
  const { userCourseInput, setUserCourseInput } = useContext(UserInputContext)

  const handleSelect = (modelId) => {
    setUserCourseInput(prev => ({ ...prev, selectedModel: modelId }))
  }

  return (
    <div className='px-4 md:px-10 lg:px-20'>
      <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1'>
        Choose an AI Model
      </h2>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
        Select which OpenRouter model generates your course. Free models require no credits.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {MODELS.map((model) => {
          const isSelected = userCourseInput?.selectedModel === model.id
          return (
            <motion.div
              key={model.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(model.id)}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                ${isSelected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 bg-white dark:bg-gray-800'
                }`}
            >
              <div className='flex items-start justify-between mb-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-2xl'>{model.icon}</span>
                  <div>
                    <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100'>{model.name}</h3>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>{model.provider}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${model.badgeColor}`}>
                  {model.badge}
                </span>
              </div>
              <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>{model.description}</p>
              {isSelected && (
                <div className='mt-3 flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400'>
                  <div className='w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center'>
                    <svg className='w-2.5 h-2.5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                    </svg>
                  </div>
                  <span className='text-xs font-medium'>Selected</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default SelectModel
