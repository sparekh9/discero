// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState} from 'react'
import type { ReactNode } from 'react' 
import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { CourseMetadata } from '../services/courseService'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  demographics: Demographics
  learningPreferences: LearningPreferences
  subscriptionTier: 'free' | 'premium' | 'enterprise'
  createdAt: Date
  lastLoginAt: Date
  courses: CourseMetadata[]
}

export interface Demographics {
  age?: number
  educationLevel: 'high-school' | 'undergraduate' | 'graduate' | 'professional' | 'self-learner'
  occupation?: string
  location?: string
  nativeLanguage?: string
  learningPurpose: 'academic' | 'professional' | 'personal' | 'certification'
}

interface LearningPreferences {
  preferredSubjects: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  studyTimePerWeek: number
  goals: string[]
}

interface AuthContextType {
  currentUser: User | null
  userProfile: UserProfile | null
  loading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  addCourseToProfile: (courseMetadata: CourseMetadata) => Promise<void>
  removeCourseFromProfile: (courseId: string) => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Default values for new users or missing fields
const defaultDemographics: Demographics = {
  educationLevel: 'self-learner',
  learningPurpose: 'personal'
}

const defaultPreferences = {
  preferredSubjects: [],
  learningStyle: 'visual' as const,
  difficultyLevel: 'beginner' as const,
  studyTimePerWeek: 5,
  goals: []
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const createUserProfile = async (user: User, additionalData: Partial <UserProfile> = {}) => {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {

      const newUserProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        ...(user.photoURL && { photoURL: user.photoURL }),
        demographics: defaultDemographics,
        learningPreferences: defaultPreferences,
        subscriptionTier: 'free',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        courses: [],
        ...additionalData
      }

      try {
        await setDoc(userRef, newUserProfile)
        setUserProfile(newUserProfile)
      } catch (error) {
        console.error('Error creating user profile:', error)
      }
    } else {
      // Update last login time and ensure courses array and demographics exist
      const existingProfile = userDoc.data() as UserProfile
      const updatedProfile = {
        ...existingProfile,
        lastLoginAt: new Date(),
        courses: existingProfile.courses || [],
        // Add demographics if missing (for existing users)
        demographics: existingProfile.demographics || defaultDemographics
      }
      await setDoc(userRef, updatedProfile, { merge: true })
      setUserProfile(updatedProfile)
    }
  }

  const signup = async (email: string, password: string, displayName: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName })
    await sendEmailVerification(user)
    await createUserProfile(user, { displayName })
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      console.log('Attempting Google login...')
      const { user } = await signInWithPopup(auth, provider)
      console.log('Google login successful, creating profile...')
      await createUserProfile(user)
      console.log('Profile created successfully')
    } catch (error: any) {
      console.error('Google login error:', {
        code: error.code,
        message: error.message,
        details: error
      })
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUserProfile(null)
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return

    const userRef = doc(db, 'users', currentUser.uid)
    const updatedProfile = { ...userProfile, ...updates }
    
    await setDoc(userRef, updatedProfile, { merge: true })
    setUserProfile(updatedProfile)
  }

  const addCourseToProfile = async (courseMetadata: CourseMetadata) => {
    if (!currentUser || !userProfile) return

    const currentCourses = userProfile.courses || []
    const updatedCourses = [...currentCourses, courseMetadata]
    await updateUserProfile({ courses: updatedCourses })
  }

  const removeCourseFromProfile = async (courseId: string) => {
    if (!currentUser || !userProfile) return

    const currentCourses = userProfile.courses || []
    const updatedCourses = currentCourses.filter(course => course.id !== courseId)
    await updateUserProfile({ courses: updatedCourses })
  }

  const refreshUserProfile = async () => {
    if (!currentUser) return

    try {
      const userRef = doc(db, 'users', currentUser.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const profileData = userDoc.data() as UserProfile
        setUserProfile(profileData)
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const profileData = userDoc.data() as UserProfile
          // Ensure backward compatibility - add missing fields for existing users
          const needsUpdate = !profileData.courses || !profileData.demographics

          if (needsUpdate) {
            const updatedProfile = {
              ...profileData,
              courses: profileData.courses || [],
              demographics: profileData.demographics || {
                educationLevel: 'self-learner' as const,
                learningPurpose: 'personal' as const
              }
            }
            await setDoc(userRef, updatedProfile, { merge: true })
            setUserProfile(updatedProfile)
          } else {
            setUserProfile(profileData)
          }
        } else {
          await createUserProfile(user)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    updateUserProfile,
    addCourseToProfile,
    removeCourseFromProfile,
    refreshUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
