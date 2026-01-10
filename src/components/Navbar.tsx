import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <nav className="sticky top-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-50">
      <div className="light-glass-effect rounded-2xl">
        <div className="flex justify-between items-center h-16 px-6">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold animated-brand">Discero</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-3">
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-slate-700 hover:text-primary-600 px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white/40 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/courses"
                    className="text-slate-700 hover:text-primary-600 px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white/40 rounded-lg"
                  >
                    My Courses
                  </Link>
                  <div className="w-px h-6 bg-slate-300/50"></div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-600 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50/80"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-primary-600 px-5 py-2 text-sm font-semibold transition-all duration-200 hover:bg-white/40 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-primary-600 p-2 rounded-lg transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 mt-2">
            <div className="px-4 py-4 space-y-2">
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-slate-700 hover:text-primary-600 hover:bg-white/40 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/courses"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-slate-700 hover:text-primary-600 hover:bg-white/40 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    My Courses
                  </Link>
                  <div className="pt-2 border-t border-slate-200/50">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left text-slate-600 hover:text-red-600 hover:bg-red-50/80 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-slate-700 hover:text-primary-600 hover:bg-white/40 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/30"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
