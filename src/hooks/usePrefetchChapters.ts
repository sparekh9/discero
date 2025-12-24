// src/hooks/usePrefetchChapters.ts
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { courseService } from '../services/courseService'

export const usePrefetchChapters = (
  courseId: string | undefined,
  currentIndex: number,
  totalChapters: number
) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!courseId) return

    const prefetchAdjacent = async () => {
      const toPreload: number[] = []
      
      // Add previous chapter
      if (currentIndex > 0) {
        toPreload.push(currentIndex - 1)
      }
      
      // Add next chapter
      if (currentIndex < totalChapters - 1) {
        toPreload.push(currentIndex + 1)
      }

      // Prefetch adjacent chapters in background
      toPreload.forEach(index => {
        queryClient.prefetchQuery({
          queryKey: ['chapter-content', courseId, index],
          queryFn: () => courseService.getChapterContent(courseId, index),
          staleTime: 10 * 60 * 1000, // 10 minutes
        })
      })
    }

    // Add small delay to prioritize current chapter loading
    const timer = setTimeout(prefetchAdjacent, 1000)
    return () => clearTimeout(timer)
  }, [courseId, currentIndex, totalChapters, queryClient])
}