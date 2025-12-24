// src/pages/CourseChapterPage.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { courseService } from '../../../services/courseService'
import { useAuth } from '../../../contexts/AuthContext'
import { usePrefetchChapters } from '../../../hooks/usePrefetchChapters'
import { useChapterContentGeneration } from '../../../hooks/useChapterContentGeneration'
import Flashcards from './Flashcard'
import Quiz from './Quiz'
import ChapterHeader from './ChapterHeader'
import ChapterProgress from './ChapterProgress'
import ChapterNotGenerated from './ChapterNotGenerated'
import ViewModeSelector, { type ViewMode } from './ViewModeSelector'
import ChapterContentView from './ChapterContentView'

const CourseChapterPage: React.FC = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>()
  const chapterIndex = parseInt(chapterId ?? '1', 10) - 1 // zero-based index
  const { currentUser, userProfile } = useAuth()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState<ViewMode>('content')

  // Load course metadata (lightweight)
  const { data: courseMetadata, isLoading: isLoadingMetadata, error: metadataError } = useQuery({
    queryKey: ['course-metadata', courseId],
    queryFn: () => courseService.getCourseMetadata(courseId!),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  })

  // Load course outline (moderate weight)
  const { data: courseOutline, isLoading: isLoadingOutline, error: outlineError } = useQuery({
    queryKey: ['course-outline', courseId],
    queryFn: () => courseService.getCourseOutline(courseId!),
    enabled: !!courseMetadata && courseMetadata.uid === currentUser?.uid,
    staleTime: 5 * 60 * 1000,
  })

  // Load current chapter content (priority)
  const { data: currentChapterContent, isLoading: isLoadingChapter } = useQuery({
    queryKey: ['chapter-content', courseId, chapterIndex],
    queryFn: () => courseService.getChapterContent(courseId!, chapterIndex),
    enabled: !!courseOutline && chapterIndex >= 0 && chapterIndex < courseOutline.chapters.length,
    staleTime: 10 * 60 * 1000,
  })

  // Prefetch adjacent chapters in background
  usePrefetchChapters(
    courseId,
    chapterIndex,
    courseOutline?.chapters.length || 0
  )

  // Content generation hook
  const chapters = courseOutline?.chapters || []
  const chapter = chapters[chapterIndex] ?? null
  const { isGeneratingContent, handleGenerateContent } = useChapterContentGeneration({
    courseId,
    chapterIndex,
    chapter,
    courseOutline,
    userProfile
  })

  // Handle navigation on auth/ownership issues
  useEffect(() => {
    if (!courseId) {
      navigate('/dashboard')
      return
    }

    if (metadataError || outlineError) {
      console.error('Failed to load course:', metadataError || outlineError)
      navigate('/dashboard')
      return
    }

    if (courseMetadata && courseMetadata.uid !== currentUser?.uid) {
      navigate('/dashboard')
      return
    }
  }, [courseId, courseMetadata, currentUser, navigate, metadataError, outlineError])

  // Reset view mode when chapter changes
  useEffect(() => {
    setViewMode('content')
    console.log('Chapter index changed:', chapterIndex)
  }, [chapterIndex])

  const goToChapter = (idx: number) => {
    navigate(`/dashboard/courses/${courseId}/chapter/${idx + 1}`)
  }

  // Computed values
  const courseTitle = courseOutline?.title || courseMetadata?.title || ''
  const isLoading = isLoadingMetadata || isLoadingOutline

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-slate-700">Loading course content...</p>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Chapter Not Available</h2>
          <p className="text-slate-600 mb-6">
            The requested chapter could not be found. Please try again later.
          </p>
          <button
            onClick={() => navigate('/dashboard/courses')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Course Header */}
      <ChapterHeader courseTitle={courseTitle} chapterTitle={chapter.title} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress and Navigation */}
        <ChapterProgress
          currentChapterIndex={chapterIndex}
          totalChapters={chapters.length}
          onNavigate={goToChapter}
        />

        {isLoadingChapter ? (
          /* Loading Chapter Content */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-slate-700">Loading chapter content...</p>
            </div>
          </div>
        ) : !currentChapterContent ? (
          /* Chapter Not Generated */
          <ChapterNotGenerated
            chapter={chapter}
            isGeneratingContent={isGeneratingContent}
            onGenerate={handleGenerateContent}
          />
        ) : (
          <>
            {/* View Mode Navigation */}
            <ViewModeSelector
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              flashcardCount={currentChapterContent.flashcards.length}
              quizCount={currentChapterContent.quiz.length}
            />

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              {viewMode === 'content' && (
                <ChapterContentView
                  content={currentChapterContent}
                  courseId={courseId}
                  chapterIndex={chapterIndex}
                  userId={currentUser?.uid}
                />
              )}

              {viewMode === 'flashcards' && (
                <div className="p-8">
                  <Flashcards flashcards={currentChapterContent.flashcards} />
                </div>
              )}

              {viewMode === 'quiz' && (
                <div className="p-8">
                  <Quiz
                    questions={currentChapterContent.quiz}
                    onComplete={(score, total) => {
                      console.log(`Quiz completed: ${score}/${total}`)
                      // You can add analytics tracking or progress saving here
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CourseChapterPage
