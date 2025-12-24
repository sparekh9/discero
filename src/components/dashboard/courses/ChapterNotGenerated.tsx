// src/components/dashboard/courses/ChapterNotGenerated.tsx
import React from 'react'
import type { Chapter } from '../../../services/aiCourseService'

interface ChapterNotGeneratedProps {
  chapter: Chapter
  isGeneratingContent: boolean
  onGenerate: () => void
}

const ChapterNotGenerated: React.FC<ChapterNotGeneratedProps> = ({
  chapter,
  isGeneratingContent,
  onGenerate
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="text-center max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Content Not Yet Generated</h2>
        </div>

        {/* Chapter Info */}
        <div className="mb-8 text-left">
          <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">{chapter.title}</h3>
          <p className="text-slate-600 leading-relaxed mb-6 text-center">{chapter.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">⏱️</div>
              <p className="text-sm text-slate-600 mt-1">Estimated Time</p>
              <p className="font-medium text-slate-900">{chapter.estimatedTime}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">🎯</div>
              <p className="text-sm text-slate-600 mt-1">Learning Goals</p>
              <p className="font-medium text-slate-900">{chapter.learningGoals.length} objectives</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">📚</div>
              <p className="text-sm text-slate-600 mt-1">Topics</p>
              <p className="font-medium text-slate-900">{chapter.topics.length} topics</p>
            </div>
          </div>

          {/* Learning Goals Preview */}
          {chapter.learningGoals.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Learning Objectives</h4>
              <ul className="space-y-2">
                {chapter.learningGoals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">•</span>
                    <span className="text-slate-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Topics Preview */}
          {chapter.topics.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {chapter.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generation Button */}
        <div className="text-center">
          <button
            onClick={onGenerate}
            disabled={isGeneratingContent}
            className={`relative flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 mx-auto ${isGeneratingContent
              ? 'bg-primary-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 transform hover:scale-105 hover:shadow-xl'
              } text-white`}
          >
            {isGeneratingContent ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Generating Content...
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChapterNotGenerated
