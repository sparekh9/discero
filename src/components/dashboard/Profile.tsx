// src/components/dashboard/Profile.tsx
import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import type { Demographics, UserProfile } from '../../contexts/AuthContext'

const Profile: React.FC = () => {
  const { userProfile, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  // Helper to get demographics with defaults
  const getDemographics = () => {
    return userProfile.demographics || {
      educationLevel: 'self-learner' as const,
      learningPurpose: 'personal' as const
    }
  }

  const demographics = getDemographics()

  const handleEdit = () => {
    setFormData({
      displayName: userProfile.displayName,
      demographics: { ...demographics },
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({})
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateUserProfile(formData)
      setIsEditing(false)
      setFormData({})
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateDemographics = (field: keyof Demographics, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      demographics: {
        ...demographics,
        ...prev.demographics,
        [field]: value
      }
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and learning preferences</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Basic Information Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            {/* Display Name */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Display Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.displayName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your display name"
                />
              ) : (
                <p className="flex-1 pt-2 text-gray-900">{userProfile.displayName || 'Not set'}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Email</label>
              <p className="flex-1 pt-2 text-gray-900">{userProfile.email}</p>
            </div>

            {/* Subscription Tier (read-only) */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Plan</label>
              <p className="flex-1 pt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  userProfile.subscriptionTier === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                  userProfile.subscriptionTier === 'premium' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userProfile.subscriptionTier.charAt(0).toUpperCase() + userProfile.subscriptionTier.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Demographics Section */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Demographics</h2>
          <p className="text-sm text-gray-600 mb-4">
            Help us personalize your learning experience by providing information about your background.
            This data will be used to tailor course content to your level and goals.
          </p>
          <div className="space-y-4">
            {/* Age */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  min="13"
                  max="120"
                  value={formData.demographics?.age || demographics.age || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    updateDemographics('age', val ? parseInt(val) : undefined)
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your age (optional)"
                />
              ) : (
                <p className="flex-1 pt-2 text-gray-900">{demographics.age || 'Not set'}</p>
              )}
            </div>

            {/* Education Level */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Education Level</label>
              {isEditing ? (
                <select
                  value={formData.demographics?.educationLevel || demographics.educationLevel}
                  onChange={(e) => updateDemographics('educationLevel', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="high-school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="professional">Professional</option>
                  <option value="self-learner">Self-Learner</option>
                </select>
              ) : (
                <p className="flex-1 pt-2 text-gray-900 capitalize">
                  {demographics.educationLevel.replace('-', ' ')}
                </p>
              )}
            </div>

            {/* Learning Purpose */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Learning Purpose</label>
              {isEditing ? (
                <select
                  value={formData.demographics?.learningPurpose || demographics.learningPurpose}
                  onChange={(e) => updateDemographics('learningPurpose', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="academic">Academic (School/University)</option>
                  <option value="professional">Professional Development</option>
                  <option value="personal">Personal Interest</option>
                  <option value="certification">Certification/Exam Prep</option>
                </select>
              ) : (
                <p className="flex-1 pt-2 text-gray-900 capitalize">
                  {demographics.learningPurpose}
                </p>
              )}
            </div>

            {/* Occupation */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Occupation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.demographics?.occupation || demographics.occupation || ''}
                  onChange={(e) => updateDemographics('occupation', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Student, Engineer, Teacher (optional)"
                />
              ) : (
                <p className="flex-1 pt-2 text-gray-900">{demographics.occupation || 'Not set'}</p>
              )}
            </div>

            {/* Location */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.demographics?.location || demographics.location || ''}
                  onChange={(e) => updateDemographics('location', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., New York, USA (optional)"
                />
              ) : (
                <p className="flex-1 pt-2 text-gray-900">{demographics.location || 'Not set'}</p>
              )}
            </div>

            {/* Native Language */}
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Native Language</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.demographics?.nativeLanguage || demographics.nativeLanguage || ''}
                  onChange={(e) => updateDemographics('nativeLanguage', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., English, Spanish, Mandarin (optional)"
                />
              ) : (
                <p className="flex-1 pt-2 text-gray-900">{demographics.nativeLanguage || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Member Since</label>
              <p className="flex-1 pt-2 text-gray-900">
                {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Last Login</label>
              <p className="flex-1 pt-2 text-gray-900">
                {new Date(userProfile.lastLoginAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-start">
              <label className="w-40 text-sm font-medium text-gray-700 pt-2">Total Courses</label>
              <p className="flex-1 pt-2 text-gray-900">{userProfile.courses?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode Actions */}
      {isEditing && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Profile
