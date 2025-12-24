// src/components/dashboard/DashboardHome.tsx
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'
import { courseService } from '../../services/courseService'

const DashboardHome: React.FC = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()

  // Get courses from user profile
  const courses = userProfile?.courses || []
  const courseIds = courses.map(course => course.id)

  // Get chapter progress for all courses
  const { data: chapterProgress = {} } = useQuery({
    queryKey: ['batch-chapter-progress', courseIds],
    queryFn: () => courseService.getBatchChapterProgress(courseIds),
    enabled: courseIds.length > 0,
    staleTime: 2 * 60 * 1000,
  })

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCourses = courses.length
    let totalChapters = 0
    let completedChapters = 0

    courses.forEach(course => {
      totalChapters += course.chapterCount
      const progress = chapterProgress[course.id] || {}
      completedChapters += Object.values(progress).filter(Boolean).length
    })

    const overallProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
    const activeCourses = courses.filter(course => {
      const progress = chapterProgress[course.id] || {}
      const completed = Object.values(progress).filter(Boolean).length
      return completed > 0 && completed < course.chapterCount
    }).length

    return {
      totalCourses,
      activeCourses,
      completedChapters,
      overallProgress,
    }
  }, [courses, chapterProgress])

  // Get recent courses (sorted by creation date)
  const recentCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
      .slice(0, 3)
  }, [courses])

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const getCourseProgress = (courseId: string, chapterCount: number) => {
    const progress = chapterProgress[courseId] || {}
    const completedChapters = Object.values(progress).filter(Boolean).length
    return Math.round((completedChapters / chapterCount) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {userProfile?.displayName || 'Learner'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your learning progress overview
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 transition-all duration-500 hover:bg-white/30 hover:border-white/40 hover:shadow-2xl hover:shadow-primary-500/25 group shadow-lg shadow-black/5">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/10 to-secondary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center">
            <div className="text-3xl mr-4 transition-transform duration-300 group-hover:scale-110">📚</div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 transition-all duration-500 hover:bg-white/30 hover:border-white/40 hover:shadow-2xl hover:shadow-primary-500/25 group shadow-lg shadow-black/5">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center">
            <div className="text-3xl mr-4 transition-transform duration-300 group-hover:scale-110">⚡</div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeCourses}</p>
            </div>
          </div>
        </div>

        <div className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 transition-all duration-500 hover:bg-white/30 hover:border-white/40 hover:shadow-2xl hover:shadow-primary-500/25 group shadow-lg shadow-black/5">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center">
            <div className="text-3xl mr-4 transition-transform duration-300 group-hover:scale-110">🎯</div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedChapters}</p>
            </div>
          </div>
        </div>

        <div className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 transition-all duration-500 hover:bg-white/30 hover:border-white/40 hover:shadow-2xl hover:shadow-primary-500/25 group shadow-lg shadow-black/5">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center">
            <div className="text-3xl mr-4 transition-transform duration-300 group-hover:scale-110">📈</div>
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Progress</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overallProgress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      {recentCourses.length > 0 && (
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg shadow-black/5">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Continue Learning</h3>
              <button
                onClick={() => navigate('/dashboard/courses')}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors duration-300"
              >
                View All →
              </button>
            </div>
            <div className="grid gap-4">
              {recentCourses.map((course) => {
                const progress = getCourseProgress(course.id, course.chapterCount)
                return (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/dashboard/courses/${course.id}/chapter/1`)}
                    className="relative bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 transition-all duration-300 hover:bg-white/30 hover:border-white/40 hover:shadow-lg hover:shadow-primary-500/20 cursor-pointer group"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/5 to-secondary-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-primary-500/20 backdrop-blur-sm text-primary-800 border border-primary-500/30 px-2 py-1 rounded-lg text-xs font-semibold">
                            {course.subject}
                          </span>
                          <span className="text-xs text-gray-500">
                            Created {formatDate(course.createdAt)}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">
                          {course.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>{course.chapterCount} chapters</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{course.duration} weeks</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="w-16 bg-white/30 backdrop-blur-sm rounded-full h-2 border border-white/40">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">{progress}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg shadow-black/5">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/dashboard/create-course')}
              className="relative bg-white/20 backdrop-blur-md border border-white/30 text-primary-700 px-6 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-500 hover:bg-white/30 hover:border-white/40 hover:shadow-xl hover:shadow-primary-500/25 transform hover:-translate-y-1 active:translate-y-0 group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Course</span>
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 to-secondary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <button
              onClick={() => navigate('/dashboard/courses')}
              className="relative bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 px-6 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-500 hover:bg-white/30 hover:border-white/40 hover:shadow-xl hover:shadow-gray-500/25 transform hover:-translate-y-1 active:translate-y-0 group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>My Courses</span>
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-400/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <button
              onClick={() => navigate('/dashboard/progress')}
              className="relative bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 px-6 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-500 hover:bg-white/30 hover:border-white/40 hover:shadow-xl hover:shadow-gray-500/25 transform hover:-translate-y-1 active:translate-y-0 group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>View Progress</span>
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-400/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome
