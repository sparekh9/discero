// src/pages/CoursePage.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const CoursePage: React.FC = () => {
  // Fetch course data based on courseId
  // const { data: course, loading } = useFetchCourse(courseId);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet /> {/* Renders nested routes */}
      </div>
    </div>
  )
}

export default CoursePage;
