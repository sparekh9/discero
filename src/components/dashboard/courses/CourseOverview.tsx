// src/components/course/CourseOverview.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const CourseOverview: React.FC = () => {
  // const { courseId } = useParams<{ courseId: string }>();
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-slate-900">React Fundamentals</h1>
        <p className="text-slate-600 mt-2">Master core React concepts through hands-on projects</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-slate-900">Progress</h3>
            <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '35%' }}></div>
            </div>
            <p className="text-sm text-slate-500 mt-1">5/10 chapters completed</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-slate-900">Duration</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">4 weeks</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-slate-900">Difficulty</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">Intermediate</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chapter List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Course Chapters</h2>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Link 
                key={index}
                to={`chapter/${index + 1}`}
                className="block bg-white hover:bg-slate-50 rounded-lg p-4 transition-colors border border-slate-200"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Chapter {index + 1}: Core Concepts</h3>
                    <p className="text-slate-600 text-sm mt-1">Estimated time: 2 hours</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Course Actions */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Course Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Download Resources
              </button>
              <button className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Share Course
              </button>
              <button className="w-full text-left p-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Request Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseOverview;
