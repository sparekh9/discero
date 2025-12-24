// src/components/dashboard/courses/ChapterProgress.tsx
import React from 'react'

interface ChapterProgressProps {
  currentChapterIndex: number
  totalChapters: number
  onNavigate: (chapterIndex: number) => void
}

const ChapterProgress: React.FC<ChapterProgressProps> = ({
  currentChapterIndex,
  totalChapters,
  onNavigate
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <span className="text-sm font-medium text-slate-700">Progress: {currentChapterIndex + 1} of {totalChapters}</span>
        <div className="w-32 h-2 bg-slate-200 rounded-full ml-3">
          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(currentChapterIndex + 1) / totalChapters * 100}%` }}></div>
        </div>
      </div>
      <div className="flex space-x-3">
        <button
          disabled={currentChapterIndex <= 0}
          className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onNavigate(currentChapterIndex - 1)}>
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <button
          disabled={currentChapterIndex >= totalChapters - 1}
          className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onNavigate(currentChapterIndex + 1)}>
          Next
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ChapterProgress
