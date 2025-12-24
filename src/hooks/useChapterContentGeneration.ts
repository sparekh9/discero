// src/hooks/useChapterContentGeneration.ts
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { courseService } from '../services/courseService'
import type { Chapter, CourseOutline } from '../services/aiCourseService'
import type { UserProfile } from '../contexts/AuthContext'

interface UseChapterContentGenerationProps {
  courseId: string | undefined
  chapterIndex: number
  chapter: Chapter | null
  courseOutline: CourseOutline | null | undefined
  userProfile?: UserProfile | null
}

interface UseChapterContentGenerationReturn {
  isGeneratingContent: boolean
  handleGenerateContent: () => Promise<void>
}

export function useChapterContentGeneration({
  courseId,
  chapterIndex,
  chapter,
  courseOutline,
  userProfile
}: UseChapterContentGenerationProps): UseChapterContentGenerationReturn {
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const queryClient = useQueryClient()

  const handleGenerateContent = async () => {
    if (!chapter || !courseId || !courseOutline) return

    setIsGeneratingContent(true)
    try {
      console.log('Generating content for:', chapter.title)

      // Generate content using AI service (with user profile for personalization)
      const { aiCourseService } = await import('../services/aiCourseService')
      const content = await aiCourseService.generateChapterContent(
        chapter,
        courseOutline.chapters[0]?.topics[0] || 'General',
        courseOutline,
        userProfile || undefined
      )

      // Update chapter content in Firestore
      await courseService.updateChapterContent(courseId, chapterIndex, content)

      // Invalidate and refetch the current chapter content
      await queryClient.invalidateQueries({
        queryKey: ['chapter-content', courseId, chapterIndex]
      })

    } catch (error) {
      console.error('Failed to generate content:', error)
    } finally {
      setIsGeneratingContent(false)
    }
  }

  return {
    isGeneratingContent,
    handleGenerateContent
  }
}
