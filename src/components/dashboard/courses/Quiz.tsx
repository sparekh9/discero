// src/components/Quiz.tsx
import React, { useState } from 'react'
import MathText from './MathText'

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface QuizProps {
  questions: QuizQuestion[]
  onComplete?: (score: number, total: number) => void
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false))
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [completed, setCompleted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (optionIndex: number) => {
    if (showExplanation) return
    setSelectedOptionIndex(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null) return
    
    const isCorrect = selectedOptionIndex === currentQuestion.correct
    const newAnswered = [...answered]
    const newUserAnswers = [...userAnswers]
    
    if (!newAnswered[currentQuestionIndex]) {
      newAnswered[currentQuestionIndex] = true
      newUserAnswers[currentQuestionIndex] = selectedOptionIndex
      
      if (isCorrect) {
        setScore(score + 1)
      }
      
      setAnswered(newAnswered)
      setUserAnswers(newUserAnswers)
    }
    
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOptionIndex(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
      onComplete?.(score, questions.length)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedOptionIndex(userAnswers[currentQuestionIndex - 1])
      setShowExplanation(answered[currentQuestionIndex - 1])
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOptionIndex(null)
    setShowExplanation(false)
    setScore(0)
    setAnswered(new Array(questions.length).fill(false))
    setUserAnswers(new Array(questions.length).fill(-1))
    setCompleted(false)
  }

  const getScorePercentage = () => Math.round((score / questions.length) * 100)

  if (!questions.length) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl">
        <div className="text-4xl mb-4">🤔</div>
        <p className="text-slate-600">No quiz questions available for this chapter.</p>
      </div>
    )
  }

  if (completed) {
    const percentage = getScorePercentage()
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold ${
              percentage >= 80 ? 'bg-green-100 text-green-800' : 
              percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {percentage}%
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {percentage >= 80 ? '🎉 Excellent Work!' : 
             percentage >= 60 ? '👍 Good Job!' : 
             '📚 Keep Studying!'}
          </h3>
          
          <p className="text-slate-600 mb-6">
            You scored {score} out of {questions.length} questions correctly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRestartQuiz}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Return to Chapter
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Chapter Quiz</h2>
          <span className="text-sm text-slate-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6">
          <MathText className="text-xl font-medium text-slate-900">
            {currentQuestion.question}
          </MathText>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index
            const isCorrect = index === currentQuestion.correct
            const isWrong = showExplanation && isSelected && !isCorrect
            const showAsCorrect = showExplanation && isCorrect

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  showAsCorrect
                    ? 'bg-green-50 border-green-300 text-green-900'
                    : isWrong
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : isSelected
                    ? 'bg-primary-50 border-primary-300 text-primary-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    showAsCorrect
                      ? 'border-green-500 bg-green-500'
                      : isWrong
                      ? 'border-red-500 bg-red-500'
                      : isSelected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-slate-300'
                  }`}>
                    {(showAsCorrect || (isSelected && !isWrong)) && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isWrong && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <MathText className="flex-1">
                    {option}
                  </MathText>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">Explanation:</h4>
            <MathText className="text-blue-800">
              {currentQuestion.explanation}
            </MathText>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOptionIndex === null}
              className={`px-8 py-3 rounded-xl font-medium transition-all ${
                selectedOptionIndex === null
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-all transform hover:scale-105"
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                'Finish Quiz'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Question Navigation Dots */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index)
                setSelectedOptionIndex(userAnswers[index] >= 0 ? userAnswers[index] : null)
                setShowExplanation(answered[index])
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestionIndex
                  ? 'bg-primary-600 scale-125'
                  : answered[index]
                  ? userAnswers[index] === questions[index].correct
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Quiz
