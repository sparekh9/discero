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
              <h1 className="text-2xl font-bold text-primary-600 transition-all duration-500 ease-in-out transform group-hover:scale-105 group-hover:-translate-y-0.5 animated-brand">Discero</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <>
                <a href="#features" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  How It Works
                </a>
                <a href="#pricing" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors">
                  Pricing
                </a>
              </>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-slate-600 hover:text-primary-600 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="relative backdrop-blur-md text-slate-600 border px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-red-100/80 hover:border-red-300/60 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-slate-600 hover:text-primary-600 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup"
                    className="relative bg-primary-500/90 backdrop-blur-md border border-primary-300/50 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-600/90 hover:border-primary-400/60 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
