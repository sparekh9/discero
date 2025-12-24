// src/components/Layout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};


export default Layout
