// src/components/dashboard/DashboardSidebar.tsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { UserProfile } from '../../contexts/AuthContext'

interface DashboardSidebarProps {
  userProfile: UserProfile | null
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userProfile }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'My Courses', href: '/dashboard/courses', icon: '📚' },
    { name: 'Progress', href: '/dashboard/progress', icon: '📈' },
    { name: 'Flashcards', href: '/dashboard/flashcards', icon: '🃏' },
    { name: 'Practice', href: '/dashboard/practice', icon: '🧮' },
  ]

  return (
    <div className="w-64 bg-white/10 backdrop-blur-md border-r border-white/20 min-h-screen shadow-lg shadow-black/5">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-bold text-lg">
              {userProfile?.displayName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{userProfile?.displayName}</p>
            <p className="text-sm text-gray-600 capitalize font-medium">{userProfile?.subscriptionTier} Plan</p>
          </div>
        </div>

        <nav className="space-y-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold tracking-wide transition-all duration-500 transform hover:-translate-y-0.5 active:translate-y-0 group ${
                  isActive
                    ? 'bg-white/30 backdrop-blur-md border border-white/40 text-primary-700 shadow-lg shadow-primary-500/25'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-gray-500/25'
                }`}
              >
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-400/20 to-secondary-400/20 opacity-100'
                    : 'bg-gradient-to-r from-gray-400/10 to-gray-500/10 opacity-0 group-hover:opacity-100'
                }`}></div>
                <span className="relative z-10 text-xl transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                <span className="relative z-10 font-semibold">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default DashboardSidebar
