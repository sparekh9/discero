import React from 'react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Computer Science Student",
    content: "l2l transformed how I learn programming. The AI-generated curriculum perfectly matched my skill level, and the practice problems helped me master concepts faster than traditional courses.",
    avatar: "SC",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Career Changer",
    content: "I was intimidated by data science, but l2l broke everything down into manageable chunks. The adaptive learning helped me progress at my own pace without feeling overwhelmed.",
    avatar: "MR",
    rating: 5
  },
  {
    name: "Emily Thompson",
    role: "High School Teacher",
    content: "As a lifelong learner, I've tried many platforms. l2l's personalized approach and comprehensive content stands out. The flashcards and progress tracking keep me motivated.",
    avatar: "ET",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Product Manager",
    content: "Learning new technical skills for work has never been easier. The AI creates exactly what I need, and I can fit learning into my busy schedule thanks to the flexible structure.",
    avatar: "DK",
    rating: 5
  },
  {
    name: "Aisha Patel",
    role: "Graduate Student",
    content: "The detailed analytics help me understand exactly where I need to focus. It's like having a personal tutor available 24/7. Absolutely worth it!",
    avatar: "AP",
    rating: 5
  },
  {
    name: "James Wilson",
    role: "Software Engineer",
    content: "I use l2l to stay current with new technologies. The quality of AI-generated content is impressive, and the practice problems are challenging enough to keep me engaged.",
    avatar: "JW",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Learners Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of students, professionals, and lifelong learners achieving their goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white/30 backdrop-blur-md border border-white/40 rounded-3xl p-8 transition-all duration-500 hover:bg-white/50 hover:border-white/60 hover:shadow-2xl hover:shadow-primary-500/30 transform hover:-translate-y-1 group shadow-lg shadow-black/5"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/10 to-secondary-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Join our community of successful learners
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Trusted by 10,000+ active learners</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
