// src/components/dashboard/CreateCourse.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timestamp } from 'firebase/firestore'
import { aiCourseService, type CourseOutline, type ChapterContent } from '../../../../services/aiCourseService'
import { courseService } from '../../../../services/courseService'
import { useAuth } from '../../../../contexts/AuthContext'

export interface CourseFormData {
  title: string
  description: string
  subject: string
  duration: number // weeks
  learningObjectives: string[]
  prerequisites: string[]
  visibility: 'private' | 'public' | 'shared'
}

const CreateCourse: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    subject: '',
    duration: 4,
    learningObjectives: [''],
    prerequisites: [''],
    visibility: 'private'
  })
  const [courseOutline, setCourseOutline] = useState<CourseOutline | null>(null)
  const [generatedChapters, setGeneratedChapters] = useState<Set<number>>(new Set())
  const [courseId, setCourseId] = useState<string>('')

  const { currentUser, userProfile, addCourseToProfile, refreshUserProfile } = useAuth()

  const subjects = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Literature', 'Psychology', 'Economics', 'Philosophy'
  ]

  const handleInputChange = (field: keyof CourseFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateAICourse = async () => {
    setIsGenerating(true)
    try {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated')
      }

      // Step 1: Generate course outline only (with user profile for personalization)
      const outline = await aiCourseService.generateCourseOutline(formData, userProfile || undefined)
      console.log(`Generated outline for ${outline.title}:`, outline)
      setCourseOutline(outline)

      // Update form data with AI-generated outline
      const aiGeneratedData = {
        title: outline.title,
        description: outline.description,
        learningObjectives: outline.learningObjectives,
        prerequisites: outline.prerequisites,
        aiGenerated: true
      }

      setFormData(prev => ({ ...prev, ...aiGeneratedData }))
      setStep(2)

    } catch (error) {
      console.error('AI generation failed:', error)
      // Show error message to user
    } finally {
      setIsGenerating(false)
    }
  }

  const confirmAndGenerateContent = async () => {
    setIsGenerating(true)
    try {
      if (!currentUser?.uid || !courseOutline) {
        throw new Error('User not authenticated or outline not available')
      }

      // Step 2: Create course with new optimized structure
      const courseId = await courseService.createCourse(
        currentUser.uid,
        courseOutline,
        formData.subject,
        formData.visibility,
        formData.duration
      )
      console.log('Course created with ID:', courseId)
      setCourseId(courseId)

      // Step 2.5: Add course metadata to user profile
      const now = Timestamp.now()
      const courseMetadata = {
        id: courseId,
        uid: currentUser.uid,
        title: courseOutline.title,
        subject: formData.subject,
        visibility: formData.visibility,
        duration: formData.duration,
        createdAt: now,
        updatedAt: now,
        chapterCount: courseOutline.chapters.length
      }
      await addCourseToProfile(courseMetadata)
      // Refresh the profile to ensure it's synced with Firestore
      await refreshUserProfile()

      // Step 3: Generate content for first 2-3 chapters
      const initialChapters = courseOutline.chapters.slice(0, 3)
      const chapterContents: Array<{ index: number; content: ChapterContent }> = []

      for (let i = 0; i < initialChapters.length; i++) {
        const chapter = initialChapters[i]
        try {
          const content = await aiCourseService.generateChapterContent(chapter, formData.subject, courseOutline)
          console.log(`Generated content for ${chapter.title}:`, content)

          chapterContents.push({ index: i, content })
        } catch (error) {
          console.error(`Failed to generate content for ${chapter.title}:`, error)
        }
      }

      // Step 4: Batch update chapters with generated content
      if (chapterContents.length > 0) {
        await courseService.batchUpdateChapters(courseId, chapterContents)
      }

      setGeneratedChapters(new Set(chapterContents.map(c => c.index)))
      setStep(3)

    } catch (error) {
      console.error('Content generation failed:', error)
      // Show error message to user
    } finally {
      setIsGenerating(false)
    }
  }

  const generateChapterContent = async (chapterIndex: number) => {
    if (!courseOutline || !courseId) return

    const chapter = courseOutline.chapters[chapterIndex]
    if (!chapter) return

    try {
      const content = await aiCourseService.generateChapterContent(chapter, formData.subject, courseOutline)

      // Update individual chapter in Firestore
      await courseService.updateChapterContent(courseId, chapterIndex, content)

      // Update UI
      setGeneratedChapters(prev => new Set(prev).add(chapterIndex))
      return content
    } catch (error) {
      console.error('Failed to generate chapter content:', error)
    }
  }

  const handleSubmit = async () => {
    // TODO: Save course to database
    console.log('Creating course:', formData)
    navigate(`/dashboard/courses/${courseId}/chapter/${1}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Course</h1>
          <p className="text-slate-600 mt-2">Build your very own learning experience</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/courses')}
          className="text-slate-600 hover:text-slate-900 p-2 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Steps */}
      <div className="light-glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= stepNum
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-200 text-slate-600'
                }`}>
                {stepNum}
              </div>
              <span className={`ml-3 font-medium ${step >= stepNum ? 'text-primary-600' : 'text-slate-600'
                }`}>
                {stepNum === 1 && 'Basic Info'}
                {stepNum === 2 && 'Review Outline'}
                {stepNum === 3 && 'Course Ready'}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter course title..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject Area
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visibility
                </label>
                <select
                  value={formData.visibility}
                  onChange={(e) => handleInputChange('visibility', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="shared">Shared</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Course Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what you'd like to learn in this course..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={generateAICourse}
                disabled={!formData.title || !formData.subject || isGenerating}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating Outline...' : 'Generate Outline'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review Outline */}
        {step === 2 && courseOutline && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">
                  Course outline generated successfully!
                </span>
              </div>
            </div>

            {/* Course Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Course Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Title:</span> {courseOutline.title}</p>
                  <p><span className="font-medium">Duration:</span> {formData.duration} weeks</p>
                  <p><span className="font-medium">Estimated Hours:</span> {courseOutline.estimatedHours}</p>
                  <p><span className="font-medium">Chapters:</span> {courseOutline.chapters.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Learning Objectives</h4>
                <ul className="space-y-1 text-sm">
                  {courseOutline.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chapter Outline Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Course Chapters</h4>
              <div className="space-y-3">
                {courseOutline.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="light-glass-effect rounded-lg p-4">
                    <h5 className="font-medium text-slate-900">
                      {index + 1}. {chapter.title}
                    </h5>
                    <p className="text-sm text-slate-600 mt-1">{chapter.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <span>⏱️ {chapter.estimatedTime}</span>
                      <span>📚 {chapter.topics.length} topics</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Plan Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Learning Game Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseOutline.gamePlan.weeklySchedule.slice(0, 4).map((week) => (
                  <div key={week.week} className="bg-slate-50 rounded-lg p-3">
                    <h6 className="font-medium text-slate-900">Week {week.week}</h6>
                    <p className="text-sm text-slate-600">{week.focus}</p>
                    <div className="mt-2 text-xs text-slate-500">
                      Chapters: {week.chapters.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                💡 Clicking "Confirm & Generate Content" will create the course and generate detailed content for the first 3 chapters. You can generate content for remaining chapters later.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                disabled={isGenerating}
                className="text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                ← Back
              </button>
              <button
                onClick={confirmAndGenerateContent}
                disabled={isGenerating}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating Content...' : 'Confirm & Generate Content'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && courseOutline && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">
                  AI-generated course outline ready! ({generatedChapters.size}/{courseOutline.chapters.length} chapters have content)
                </span>
              </div>
            </div>

            {/* Course Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Course Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Title:</span> {courseOutline.title}</p>
                  <p><span className="font-medium">Duration:</span> {formData.duration} weeks</p>
                  <p><span className="font-medium">Estimated Hours:</span> {courseOutline.estimatedHours}</p>
                  <p><span className="font-medium">Chapters:</span> {courseOutline.chapters.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900">Learning Objectives</h4>
                <ul className="space-y-1 text-sm">
                  {courseOutline.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chapter Outline */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Course Chapters</h4>
              <div className="space-y-3">
                {courseOutline.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="light-glass-effect rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">
                          {index + 1}. {chapter.title}
                        </h5>
                        <p className="text-sm text-slate-600 mt-1">{chapter.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span>⏱️ {chapter.estimatedTime}</span>
                          <span>📚 {chapter.topics.length} topics</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        {generatedChapters.has(index) ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ✓ Content Ready
                          </span>
                        ) : (
                          <button
                            onClick={() => generateChapterContent(index)}
                            className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full hover:bg-primary-200 transition-colors"
                          >
                            Generate Content
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Plan Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Learning Game Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseOutline.gamePlan.weeklySchedule.slice(0, 4).map((week) => (
                  <div key={week.week} className="bg-slate-50 rounded-lg p-3">
                    <h6 className="font-medium text-slate-900">Week {week.week}</h6>
                    <p className="text-sm text-slate-600">{week.focus}</p>
                    <div className="mt-2 text-xs text-slate-500">
                      Chapters: {week.chapters.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Start Learning
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default CreateCourse
