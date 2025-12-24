// src/components/dashboard/courses/ViewModeSelector.tsx
import React from 'react'

export type ViewMode = 'content' | 'quiz' | 'flashcards'

interface ViewModeSelectorProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  flashcardCount: number
  quizCount: number
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  viewMode,
  onViewModeChange,
  flashcardCount,
  quizCount
}) => {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewModeChange('content')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${viewMode === 'content'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            📚 Content
          </button>
          <button
            onClick={() => onViewModeChange('flashcards')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${viewMode === 'flashcards'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            🃏 Flashcards ({flashcardCount})
          </button>
          <button
            onClick={() => onViewModeChange('quiz')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${viewMode === 'quiz'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
          >
            📝 Quiz ({quizCount})
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewModeSelector
