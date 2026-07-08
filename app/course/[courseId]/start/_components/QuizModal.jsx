"use client"
import React, { useState } from 'react'
import { generateWithOpenRouter, parseJsonSafe } from '@/configs/AiModel'
import { HiOutlineTrophy, HiOutlineXMark, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi2"

function QuizModal({ course, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const courseName = course?.courseOutput?.course?.name || 'this course';
      const chapters = course?.courseOutput?.course?.chapters || [];
      const chapterNames = chapters.map(ch => ch.name).join(', ');

      const prompt = `Generate a quiz with 10 multiple-choice questions for a course titled "${courseName}". The course covers these chapters: ${chapterNames}.

Return valid JSON in this exact format:
{
  "questions": [
    {
      "question": "What is...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

Each question must have exactly 4 options. correctAnswer is the zero-based index of the correct option.`;

      const model = course?.aiModel || 'google/gemini-2.0-flash-001';
      const result = await generateWithOpenRouter(prompt, model);
      const parsed = parseJsonSafe(result);

      if (parsed.questions && parsed.questions.length > 0) {
        setQuestions(parsed.questions);
        setCurrentQ(0);
        setSelectedAnswers({});
        setShowResults(false);
      } else {
        setError('Failed to generate questions. Please try again.');
      }
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const selectAnswer = (questionIndex, optionIndex) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  }

  const submitQuiz = () => {
    setShowResults(true);
  }

  const getScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correct++;
    });
    return correct;
  }

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  const score = getScore();
  const scorePercent = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b dark:border-gray-700'>
          <h2 className='text-xl font-bold flex items-center gap-2'>
            <HiOutlineTrophy className='text-primary text-2xl' />
            Course Quiz
          </h2>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'>
            <HiOutlineXMark className='text-xl' />
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 overflow-y-auto p-5'>
          {/* Initial state - no questions yet */}
          {questions.length === 0 && !loading && !error && (
            <div className='text-center py-10'>
              <div className='w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                <HiOutlineTrophy className='text-primary text-4xl' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>Test Your Knowledge</h3>
              <p className='text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto'>
                Generate a 10-question quiz based on this entire course to test how much you've learned.
              </p>
              <button
                onClick={generateQuiz}
                className='px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity'
              >
                Generate Quiz
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className='text-center py-10'>
              <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-gray-600 dark:text-gray-400'>Generating quiz questions...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className='text-center py-10'>
              <p className='text-red-500 mb-4'>{error}</p>
              <button
                onClick={generateQuiz}
                className='px-5 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity'
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {showResults && (
            <div className='mb-6'>
              <div className='text-center py-4 mb-4 bg-gray-50 dark:bg-gray-800 rounded-xl'>
                <div className={`text-5xl font-bold mb-1 ${scorePercent >= 70 ? 'text-green-600' : scorePercent >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {score}/{questions.length}
                </div>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  {scorePercent >= 70 ? 'Excellent work!' : scorePercent >= 40 ? 'Good effort, keep learning!' : 'Review the course and try again.'}
                </p>
                <div className='w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-3 overflow-hidden'>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${scorePercent >= 70 ? 'bg-green-500' : scorePercent >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Questions */}
          {questions.length > 0 && !loading && (
            <div>
              {!showResults ? (
                // Single question view
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <span className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
                      Question {currentQ + 1} of {questions.length}
                    </span>
                    <span className='text-xs text-gray-400'>
                      {Object.keys(selectedAnswers).length}/{questions.length} answered
                    </span>
                  </div>
                  {/* Progress dots */}
                  <div className='flex gap-1 mb-5'>
                    {questions.map((_, i) => (
                      <div key={i}
                        className={`h-1.5 flex-1 rounded-full cursor-pointer transition-colors ${
                          i === currentQ ? 'bg-primary' :
                          selectedAnswers[i] !== undefined ? 'bg-primary/40' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        onClick={() => setCurrentQ(i)}
                      />
                    ))}
                  </div>

                  <h3 className='text-lg font-medium mb-4'>{questions[currentQ]?.question}</h3>
                  <div className='space-y-2'>
                    {questions[currentQ]?.options?.map((option, optIdx) => (
                      <button key={optIdx}
                        onClick={() => selectAnswer(currentQ, optIdx)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAnswers[currentQ] === optIdx
                            ? 'border-primary bg-primary/5 dark:bg-primary/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className='font-medium text-sm text-gray-500 mr-3'>
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className='flex justify-between mt-6'>
                    <button
                      onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))}
                      disabled={currentQ === 0}
                      className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                    >
                      Previous
                    </button>
                    {currentQ < questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))}
                        className='px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 transition-opacity'
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={submitQuiz}
                        disabled={!allAnswered}
                        className='px-5 py-2 text-sm font-medium text-white bg-green-600 rounded-lg disabled:opacity-40 hover:bg-green-700 transition-colors'
                      >
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                // Review all questions after submission
                <div className='space-y-4'>
                  {questions.map((q, i) => {
                    const isCorrect = selectedAnswers[i] === q.correctAnswer;
                    return (
                      <div key={i} className={`p-4 rounded-lg border-2 ${isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800'}`}>
                        <div className='flex items-start gap-2 mb-2'>
                          {isCorrect ? (
                            <HiOutlineCheckCircle className='text-green-600 text-xl shrink-0 mt-0.5' />
                          ) : (
                            <HiOutlineXCircle className='text-red-500 text-xl shrink-0 mt-0.5' />
                          )}
                          <p className='font-medium text-sm'>{q.question}</p>
                        </div>
                        <div className='ml-7 text-sm'>
                          {!isCorrect && (
                            <p className='text-red-600 dark:text-red-400'>
                              Your answer: {q.options[selectedAnswers[i]]}
                            </p>
                          )}
                          <p className='text-green-700 dark:text-green-400'>
                            Correct: {q.options[q.correctAnswer]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {showResults && (
          <div className='p-4 border-t dark:border-gray-700 flex justify-end gap-3'>
            <button
              onClick={() => { setQuestions([]); setShowResults(false); setSelectedAnswers({}); }}
              className='px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
            >
              Retake Quiz
            </button>
            <button
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 transition-opacity'
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizModal
