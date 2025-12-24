// src/components/auth/ProtectedRoute.tsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectPath?: string
  requireEmailVerification?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectPath = '/login',
  requireEmailVerification = false 
}) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // Optional: Check email verification
  if (requireEmailVerification && !currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
