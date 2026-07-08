"use client"
import React from 'react'
import YouTube from 'react-youtube'
import ReactMarkdown from 'react-markdown'

function ChapterContent({ chapter, content }) {
  const opts = {
    width: '100%',
    playerVars: {
      autoplay: 0,
      rel: 0,
    },
  };

  return (
    <div className='p-5 md:p-10'>
      <h2 className='font-medium text-2xl'>{chapter?.name}</h2>
      <p className='text-gray-500 dark:text-gray-400 mt-1'>{chapter?.about}</p>

      {content?.videoId && (
        <div className='flex justify-center my-6'>
          <div className='w-full max-w-2xl aspect-video rounded-lg overflow-hidden'>
            <YouTube
              videoId={content.videoId}
              opts={opts}
              className='w-full h-full'
              iframeClassName='w-full h-full'
            />
          </div>
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
