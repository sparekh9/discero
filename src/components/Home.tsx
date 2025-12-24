import React from 'react'
import Hero from './Hero'
import Features from './Features'
import HowItWorks from './HowItWorks'
// import CTA from './CTA'

const Home: React.FC = () => {
  return (
    <div className="flowing-bg">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  )
}

export default Home
