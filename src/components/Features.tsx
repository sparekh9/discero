import React from 'react';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactElement;
  highlight?: boolean;
}

const features: Feature[] = [
  {
    title: "AI-Generated Curricula",
    description: "Custom learning paths created based on your goals, current knowledge, and learning preferences.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Interactive Flashcards",
    description: "Spaced repetition flashcards that adapt to your memory patterns and optimize retention for long-term learning.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  {
    title: "Comprehensive Notes",
    description: "AI-generated study notes that break down complex topics into digestible, well-structured content.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Practice Problems",
    description: "Unlimited practice questions with detailed explanations, difficulty adjustment, and progress tracking.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Progress Analytics",
    description: "Detailed insights into your learning progress, strengths, weaknesses, and recommended focus areas.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Adaptive Learning",
    description: "Content difficulty and pacing automatically adjust based on your performance and learning speed.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Learn
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 block mt-2">
              Effectively
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides all the tools you need for a personalized learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative bg-white/30 backdrop-blur-md border rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group shadow-lg ${
                feature.highlight
                  ? 'border-primary-400/60 hover:border-primary-500/80 hover:shadow-2xl hover:shadow-primary-500/40 lg:scale-105'
                  : 'border-white/40 hover:border-white/60 hover:shadow-2xl hover:shadow-primary-500/30 shadow-black/5'
              }`}
            >
              {/* Highlight badge */}
              {feature.highlight && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-primary-500/50">
                  Popular
                </div>
              )}

              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
                feature.highlight
                  ? 'bg-gradient-to-br from-primary-400/20 to-secondary-400/20 opacity-50 group-hover:opacity-100'
                  : 'bg-gradient-to-br from-primary-400/10 to-secondary-400/10 opacity-0 group-hover:opacity-100'
              }`}></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className={`rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110 ${
                  feature.highlight
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-primary-500/50'
                    : 'bg-gradient-to-br from-primary-400 to-secondary-400 text-white shadow-primary-400/30'
                }`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                  feature.highlight
                    ? 'text-gray-900 group-hover:text-primary-700'
                    : 'text-gray-900 group-hover:text-primary-700'
                }`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Features;
