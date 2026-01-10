// src/components/dashboard/MyCourses.tsx
import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { courseService } from '../../services/courseService'
import { useAuth } from '../../contexts/AuthContext'

const MyCourses: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { userProfile, refreshUserProfile } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get search query from URL
  const searchQuery = searchParams.get('search') || ''

  // Get courses from user profile (cached and optimized)
  const allCourses = userProfile?.courses || []

  // Filter courses based on search query
  const courses = useMemo(() => {
    if (!searchQuery.trim()) return allCourses

    const query = searchQuery.toLowerCase()
    return allCourses.filter(course =>
      course.title.toLowerCase().includes(query) ||
      course.subject.toLowerCase().includes(query)
    )
  }, [allCourses, searchQuery])

  const courseIds = courses.map(course => course.id)
  console.log(courseIds)

  // Refresh user profile on component mount to ensure latest data
  useEffect(() => {
    refreshUserProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Batch load chapter progress for all courses
  const { data: chapterProgress = {}, isLoading } = useQuery({
    queryKey: ['batch-chapter-progress', courseIds],
    queryFn: () => courseService.getBatchChapterProgress(courseIds),
    enabled: courseIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const handleCreateCourse = () => {
    navigate('/dashboard/create-course')
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshUserProfile()
    setIsRefreshing(false)
  }

  const getCourseProgress = (courseId: string, chapterCount: number) => {
    const progress = chapterProgress[courseId] || {}
    const completedChapters = Object.values(progress).filter(Boolean).length
    return Math.round((completedChapters / chapterCount) * 100)
  }

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString()
  }

  const clearSearch = () => {
    setSearchParams({})
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-1">
              Found {courses.length} result{courses.length !== 1 ? 's' : ''} for "{searchQuery}"
              <button
                onClick={clearSearch}
                className="ml-2 text-primary-600 hover:text-primary-700 underline"
              >
                Clear search
              </button>
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            className="relative bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 px-6 py-3 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-500 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl hover:shadow-gray-500/25 transform hover:-translate-y-1 active:translate-y-0 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg className={`w-4 h-4 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </span>
          </button>

          <button className="relative bg-white/10 backdrop-blur-md border border-white/20 text-primary-700 px-6 py-3 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-500 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl hover:shadow-primary-500/25 transform hover:-translate-y-1 active:translate-y-0 group"
            onClick={handleCreateCourse}>
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-4 h-4 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create</span>
            </span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>

        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-white/20 backdrop-blur-sm rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : !courses || courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 group hover:bg-white/20 transition-all duration-500">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400/10 to-secondary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <svg className="relative z-10 w-16 h-16 text-primary-500 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No courses yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Create your first course to start learning! Our AI will help you build a personalized learning experience.</p>
          <button
            onClick={handleCreateCourse}
            className="relative bg-white/10 backdrop-blur-md border border-white/20 text-primary-700 px-8 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-500 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl hover:shadow-primary-500/25 transform hover:-translate-y-1 active:translate-y-0 group"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Your First Course</span>
            </span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress = getCourseProgress(course.id, course.chapterCount)
            return (
              <div
                key={course.id}
                className="relative bg-white/30 backdrop-blur-md border-2 border-white/40 rounded-2xl p-6 transition-all duration-500 hover:bg-white/40 hover:border-white/50 hover:shadow-2xl hover:shadow-primary-500/25 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer group shadow-lg shadow-black/5"
                onClick={() => navigate(`/dashboard/courses/${course.id}/chapter/1`)}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/10 to-secondary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-primary-500/20 backdrop-blur-sm text-primary-800 border border-primary-500/30 px-3 py-1 rounded-full text-sm font-medium">
                      {course.subject}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${course.visibility === 'public' ? 'bg-green-500/20 text-green-800 border-green-500/30' :
                      course.visibility === 'shared' ? 'bg-blue-500/20 text-blue-800 border-blue-500/30' :
                        'bg-gray-500/20 text-gray-800 border-gray-500/30'
                      }`}>
                      {course.visibility}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300">
                    {course.title}
                  </h3>

                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Duration: {course.duration} weeks</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Chapters: {course.chapterCount}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6m2 4H8m10-8V9a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2z" />
                      </svg>
                      <span>Created: {formatDate(course.createdAt)}</span>
                    </p>
                  </div>

                  <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-3 mb-2 border border-white/30">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{progress}% Complete</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyCourses
