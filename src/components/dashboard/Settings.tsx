// src/components/dashboard/Settings.tsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { UserProfile } from '../../contexts/AuthContext'

const Settings: React.FC = () => {
  const { userProfile, updateUserProfile } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    learningPreferences: userProfile?.learningPreferences || {
      preferredSubjects: [],
      learningStyle: 'visual',
      difficultyLevel: 'beginner',
      studyTimePerWeek: 5,
      goals: []
    }
  })

  const [newSubject, setNewSubject] = useState('')
  const [newGoal, setNewGoal] = useState('')

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateUserProfile(formData)
      alert('Settings updated successfully!')
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to update settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreference = <K extends keyof UserProfile['learningPreferences']>(
    field: K,
    value: UserProfile['learningPreferences'][K]
  ) => {
    setFormData(prev => ({
      ...prev,
      learningPreferences: {
        ...userProfile.learningPreferences,
        ...prev.learningPreferences,
        [field]: value
      }
    }))
  }

  const addSubject = () => {
    if (newSubject.trim()) {
      const currentSubjects = formData.learningPreferences?.preferredSubjects ||
                             userProfile.learningPreferences.preferredSubjects
      updatePreference('preferredSubjects', [...currentSubjects, newSubject.trim()])
      setNewSubject('')
    }
  }

  const removeSubject = (index: number) => {
    const currentSubjects = formData.learningPreferences?.preferredSubjects ||
                           userProfile.learningPreferences.preferredSubjects
    updatePreference('preferredSubjects', currentSubjects.filter((_, i) => i !== index))
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      const currentGoals = formData.learningPreferences?.goals || userProfile.learningPreferences.goals
      updatePreference('goals', [...currentGoals, newGoal.trim()])
      setNewGoal('')
    }
  }

  const removeGoal = (index: number) => {
    const currentGoals = formData.learningPreferences?.goals || userProfile.learningPreferences.goals
    updatePreference('goals', currentGoals.filter((_, i) => i !== index))
  }

  const currentPreferences = formData.learningPreferences || userProfile.learningPreferences

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Settings</h1>
        <p className="text-gray-600 mt-1">
          Customize your learning experience. These preferences will be used to personalize course content and recommendations.
        </p>
      </div>

      {/* Settings Content */}
      <div className="space-y-6">
        {/* Learning Preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Preferences</h2>

          <div className="space-y-6">
            {/* Learning Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Style
              </label>
              <p className="text-sm text-gray-600 mb-3">
                How do you learn best? This helps us format content in a way that suits you.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['visual', 'auditory', 'kinesthetic', 'reading'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => updatePreference('learningStyle', style)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      currentPreferences.learningStyle === style
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">
                        {style === 'visual' && '👁️'}
                        {style === 'auditory' && '👂'}
                        {style === 'kinesthetic' && '✋'}
                        {style === 'reading' && '📖'}
                      </div>
                      <p className="text-sm font-medium capitalize">{style}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Difficulty Level
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Starting difficulty for new courses. You can always adjust this for individual courses.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => updatePreference('difficultyLevel', level)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentPreferences.difficultyLevel === level
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-medium capitalize text-center">{level}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Study Time Per Week */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Time Per Week
              </label>
              <p className="text-sm text-gray-600 mb-3">
                How many hours per week can you dedicate to learning?
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={currentPreferences.studyTimePerWeek}
                  onChange={(e) => updatePreference('studyTimePerWeek', parseInt(e.target.value))}
                  className="flex-1"
                />
                <div className="w-20 text-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {currentPreferences.studyTimePerWeek}
                  </span>
                  <p className="text-xs text-gray-600">hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferred Subjects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferred Subjects</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add subjects you're interested in. We'll use this to recommend relevant courses.
          </p>

          {/* Subject Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {currentPreferences.preferredSubjects.map((subject, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {subject}
                <button
                  onClick={() => removeSubject(index)}
                  className="hover:text-blue-900"
                  aria-label="Remove subject"
                >
                  ×
                </button>
              </span>
            ))}
            {currentPreferences.preferredSubjects.length === 0 && (
              <p className="text-sm text-gray-500 italic">No subjects added yet</p>
            )}
          </div>

          {/* Add Subject */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSubject()}
              placeholder="Add a subject (e.g., Mathematics, Physics)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addSubject}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Learning Goals</h2>
          <p className="text-sm text-gray-600 mb-4">
            What do you want to achieve? Setting goals helps us create more targeted learning experiences.
          </p>

          {/* Goal Tags */}
          <div className="space-y-2 mb-4">
            {currentPreferences.goals.map((goal, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-green-600 mt-0.5">✓</span>
                <p className="flex-1 text-sm text-gray-900">{goal}</p>
                <button
                  onClick={() => removeGoal(index)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Remove goal"
                >
                  ×
                </button>
              </div>
            ))}
            {currentPreferences.goals.length === 0 && (
              <p className="text-sm text-gray-500 italic">No goals added yet</p>
            )}
          </div>

          {/* Add Goal */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGoal()}
              placeholder="Add a learning goal (e.g., Master calculus by end of semester)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addGoal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
