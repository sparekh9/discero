import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './components/Home'
import LoginForm from './components/auth/LoginForm'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Dashboard from './components/Dashboard'
import MyCourses from './components/dashboard/MyCourses'
import DashboardHome from './components/dashboard/DashboardHome'
import CreateCourse from './components/dashboard/courses/course-creation/CreateCourse'
import CoursePage from './components/dashboard/courses/CoursePage'
import CourseChapterPage from './components/dashboard/courses/CourseChapterPage'
import Profile from './components/dashboard/Profile'
import Settings from './components/dashboard/Settings'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<LoginForm />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } >

            <Route index element={<DashboardHome />} />
            
            {/* Nested routes - render at /dashboard/[route] */}
            <Route path="courses" element={<MyCourses />} />
            <Route path="create-course" element={<CreateCourse />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            {/* <Route path="progress" element={<Progress />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="practice" element={<Practice />} />
            <Route path="billing" element={<Billing />} /> */}
            <Route 
              path="/dashboard/courses/:courseId" 
              element={
                <ProtectedRoute>
                  <CoursePage />
                </ProtectedRoute>
              }
            >
              <Route path="chapter/:chapterId" element={<CourseChapterPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
