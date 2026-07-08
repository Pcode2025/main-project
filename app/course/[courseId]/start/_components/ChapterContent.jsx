"use client"
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { HiPlay } from "react-icons/hi2"

function ChapterContent({ chapter, content }) {
  return (
    <div className='p-5 md:p-10'>
      <h2 className='font-medium text-2xl'>{chapter?.name}</h2>
      <p className='text-gray-500 dark:text-gray-400 mt-1'>{chapter?.about}</p>

      {content?.videoId && (
        <div className='flex justify-center my-6'>
          <a
            href={`https://www.youtube.com/watch?v=${content.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className='relative block w-full max-w-2xl aspect-video rounded-lg overflow-hidden group shadow-lg'
          >
            <img
              src={`https://img.youtube.com/vi/${content.videoId}/hqdefault.jpg`}
              alt={chapter?.name || 'Chapter video thumbnail'}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />
            <div className='absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center'>
              <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300'>
                <HiPlay className='text-white text-3xl ml-1' />
              </div>
            </div>
            <div className='absolute bottom-3 left-3 right-3'>
              <span className='bg-black/70 text-white text-xs px-2 py-1 rounded'>
                Watch on YouTube
              </span>
            </div>
          </a>
        </div>
      )}

      <div>
        {content?.content?.map((item, index) => (
          <div key={index} className='p-5 bg-purple-50 dark:bg-gray-800 shadow-sm mb-3 rounded-lg'>
            <h2 className='font-medium text-2xl'>{item.title}</h2>
            <ReactMarkdown className='text-lg text-black dark:text-gray-200 leading-9'>
              {item?.description}
            </ReactMarkdown>
            {item.codeExample && (
              <div className='p-4 bg-black text-white rounded-md mt-3 overflow-x-auto'>
                <pre>
                  <code>{item.codeExample.replace(/<\/?precode>/g, '')}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChapterContent
