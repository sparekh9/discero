// Test component to validate math rendering improvements
import React from 'react'
import MathText from '../components/dashboard/courses/MathText'

const MathRenderingTest: React.FC = () => {
  // Test cases that should work after our improvements
  const testCases = [
    {
      title: "Basic Fractions",
      content: "The derivative is $\\frac{dy}{dx}$ and the partial derivative is $\\frac{\\partial f}{\\partial x}$"
    },
    {
      title: "Integrals and Summations", 
      content: "Integration: $\\int_{0}^{1} x^2 dx$ and summation: $\\sum_{i=1}^{n} x_i$"
    },
    {
      title: "Greek Letters",
      content: "Greek letters: $\\alpha + \\beta = \\gamma$ and $\\pi \\approx 3.14159$"
    },
    {
      title: "Trigonometric Functions",
      content: "Trig functions: $\\sin(x)$, $\\cos(x)$, $\\tan(x)$, and $\\log(x)$"
    },
    {
      title: "Complex Expressions",
      content: "Complex: $e^{i\\pi} + 1 = 0$ and limits: $\\lim_{x \\to \\infty} \\frac{1}{x} = 0$"
    },
    {
      title: "Block Math",
      content: "Block equation: $$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$"
    },
    {
      title: "Chemistry Example",
      content: "Chemical reaction: $2H_2 + O_2 \\rightarrow 2H_2O$ with $\\Delta H < 0$"
    },
    {
      title: "Physics Example", 
      content: "Force equation: $F = ma$ and energy: $E = \\frac{1}{2}mv^2 + mgh$"
    },
    {
      title: "Before Fix (should be broken)",
      content: "These should show as text: frac{a}{b}, partial, alpha, pi, sin(x)"
    }
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Math Rendering Test Suite</h1>
      
      <div className="space-y-6">
        {testCases.map((testCase, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3 text-blue-600">
              {testCase.title}
            </h2>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Raw Content:</h3>
              <code className="bg-gray-100 p-2 rounded text-sm block">
                {testCase.content}
              </code>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Rendered Output:</h3>
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                <MathText>{testCase.content}</MathText>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Expected Results:</h2>
        <ul className="space-y-2 text-sm">
          <li>✅ All mathematical expressions should render as proper LaTeX</li>
          <li>✅ Fractions should display with horizontal bars</li>
          <li>✅ Greek letters should show as symbols (α, β, γ, π)</li>
          <li>✅ Functions like sin, cos should render with proper font</li>
          <li>✅ Integrals and summations should show with proper symbols</li>
          <li>❌ The "Before Fix" example should show plain text (demonstrating the problem)</li>
        </ul>
      </div>
    </div>
  )
}

export default MathRenderingTest