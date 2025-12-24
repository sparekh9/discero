// src/components/Dashboard.tsx
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Outlet } from 'react-router-dom'
import DashboardNavbar from './dashboard/DashboardNavbar'
import DashboardSidebar from './dashboard/DashboardSidebar'

const Dashboard: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      <DashboardNavbar 
        user={currentUser} 
        onLogout={logout}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex">
        {/* Always render sidebar, but transform it */}
        <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-20 transition-transform duration-250 ease-in-out ${
          isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}>
          <DashboardSidebar 
            userProfile={userProfile}
          /> 
        </div>
        
        {/* Main content area that adjusts based on sidebar state */}
        <main 
          className={`flex-1 transition-all duration-250 ease-in-out ${
            isSidebarCollapsed ? 'ml-0' : 'md:ml-67'
          } mt-5 mr-3 h-[calc(100vh-4rem)] overflow-y-auto`}
        >
          <div className="max-w-7xl p-6 mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
