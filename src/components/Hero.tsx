import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-700">AI-Powered Learning Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Rediscover Curiosity
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 block mt-2">
              Empowered by AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your learning journey with a personalized experience tailored to your experience and pace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate(currentUser ? '/dashboard' : '/signup')}
              className="relative bg-gradient-to-r from-primary-600 to-primary-500 text-white px-10 py-5 rounded-2xl font-bold text-base tracking-wide transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 active:scale-95 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Start Learning</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <button className="relative bg-white/30 backdrop-blur-md border border-white/40 text-gray-700 px-10 py-5 rounded-2xl font-bold text-base tracking-wide transition-all duration-500 hover:bg-white/50 hover:border-white/60 hover:shadow-2xl hover:shadow-gray-500/25 transform hover:scale-105 active:scale-95 group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Demo</span>
              </span>
            </button>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-20 relative">
          {/* Glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl"></div>

          <div className="relative bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl p-8 max-w-5xl mx-auto transition-all duration-500 hover:bg-white/40 hover:border-white/60 hover:shadow-2xl hover:shadow-primary-500/30 group shadow-xl shadow-black/10">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/10 via-secondary-400/10 to-primary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/50 overflow-hidden">
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

              {/* Animated Dashboard Content */}
              <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Dashboard Preview</h3>
                    <p className="text-sm text-gray-600">Track your learning progress</p>
                  </div>
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-xs">U</span>
                  </div>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 transition-all duration-300 hover:bg-white/30 hover:shadow-lg hover:shadow-primary-500/20 group/card animate-float" style={{ animationDelay: '0s' }}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400/10 to-secondary-400/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-xl mb-1">📚</div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Courses</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 transition-all duration-300 hover:bg-white/30 hover:shadow-lg hover:shadow-green-500/20 group/card animate-float" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400/10 to-emerald-400/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-xl mb-1">⚡</div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Active</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 transition-all duration-300 hover:bg-white/30 hover:shadow-lg hover:shadow-blue-500/20 group/card animate-float" style={{ animationDelay: '0.4s' }}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/10 to-indigo-400/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-xl mb-1">🎯</div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Done</p>
                      <p className="text-2xl font-bold text-gray-900">47</p>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 transition-all duration-300 hover:bg-white/30 hover:shadow-lg hover:shadow-purple-500/20 group/card animate-float" style={{ animationDelay: '0.6s' }}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/10 to-pink-400/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-xl mb-1">📈</div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Progress</p>
                      <p className="text-2xl font-bold text-gray-900">78%</p>
                    </div>
                  </div>
                </div>

                {/* Course Cards */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-gray-900">Continue Learning</h4>
                    <span className="text-xs text-primary-600 font-semibold">View All →</span>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 transition-all duration-300 hover:bg-white/30 hover:border-white/40 hover:shadow-lg hover:shadow-primary-500/20 cursor-pointer group/course animate-slide-up" style={{ animationDelay: '0.8s' }}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/5 to-secondary-400/5 opacity-0 group-hover/course:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-primary-500/20 backdrop-blur-sm text-primary-800 border border-primary-500/30 px-2 py-0.5 rounded-lg text-xs font-semibold">
                            Mathematics
                          </span>
                          <span className="text-xs text-gray-500">2 days ago</span>
                        </div>
                        <h5 className="font-semibold text-sm text-gray-900 mb-1">Advanced Calculus</h5>
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>8 chapters</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="w-12 bg-white/30 backdrop-blur-sm rounded-full h-1.5 border border-white/40">
                          <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">65%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 transition-all duration-300 hover:bg-white/30 hover:border-white/40 hover:shadow-lg hover:shadow-primary-500/20 cursor-pointer group/course animate-slide-up" style={{ animationDelay: '1s' }}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/5 to-secondary-400/5 opacity-0 group-hover/course:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-secondary-500/20 backdrop-blur-sm text-secondary-800 border border-secondary-500/30 px-2 py-0.5 rounded-lg text-xs font-semibold">
                            Physics
                          </span>
                          <span className="text-xs text-gray-500">5 days ago</span>
                        </div>
                        <h5 className="font-semibold text-sm text-gray-900 mb-1">Quantum Mechanics</h5>
                        <div className="flex items-center space-x-3 text-xs text-gray-600">
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>12 chapters</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="w-12 bg-white/30 backdrop-blur-sm rounded-full h-1.5 border border-white/40">
                          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 h-1.5 rounded-full" style={{ width: '32%' }}></div>
                        </div>
                        <span className="text-xs text-gray-700 font-semibold">32%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
