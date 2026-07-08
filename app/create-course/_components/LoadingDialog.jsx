import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog"

const STEPS = [
  { label: 'Analyzing your topic...', duration: 2000 },
  { label: 'Structuring course outline...', duration: 3000 },
  { label: 'Generating chapters...', duration: 4000 },
  { label: 'Adding details & descriptions...', duration: 3000 },
  { label: 'Finalizing course layout...', duration: 2000 },
]

function LoadingDialog({ loading }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setProgress(0);
      setStepIndex(0);
      return;
    }

    let currentProgress = 0;
    const totalDuration = STEPS.reduce((sum, s) => sum + s.duration, 0);
    const interval = 100;
    let elapsed = 0;
    let currentStep = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      currentProgress = Math.min(90, (elapsed / totalDuration) * 90);
      setProgress(Math.round(currentProgress));

      let stepElapsed = 0;
      for (let i = 0; i < STEPS.length; i++) {
        stepElapsed += STEPS[i].duration;
        if (elapsed < stepElapsed) {
          currentStep = i;
          break;
        }
        currentStep = i;
      }
      setStepIndex(currentStep);
    }, interval);

    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading && progress > 0) {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className='max-w-md'>
        <AlertDialogHeader>
          <AlertDialogDescription>
            <div className='flex flex-col items-center py-6'>
              <div className='w-14 h-14 mb-5 rounded-full bg-primary/10 flex items-center justify-center'>
                <div className='w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin'></div>
              </div>

              <h3 className='text-base font-semibold text-gray-900 dark:text-gray-100 mb-1'>
                Generating Your Course
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-5'>
                {STEPS[stepIndex]?.label}
              </p>

              {/* Progress bar */}
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden'>
                <div
                  className='h-full bg-primary rounded-full transition-all duration-300 ease-out'
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                {progress}% complete
              </p>

              {/* Steps indicator */}
              <div className='mt-5 w-full space-y-2'>
                {STEPS.map((step, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs ${
                    i < stepIndex ? 'text-green-600' :
                    i === stepIndex ? 'text-primary font-medium' :
                    'text-gray-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      i < stepIndex ? 'bg-green-100' :
                      i === stepIndex ? 'bg-primary/10' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {i < stepIndex ? (
                        <svg className='w-2.5 h-2.5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                        </svg>
                      ) : i === stepIndex ? (
                        <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
                      ) : (
                        <div className='w-1.5 h-1.5 bg-gray-300 rounded-full'></div>
                      )}
                    </div>
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LoadingDialog
