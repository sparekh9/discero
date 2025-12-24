// src/components/Flashcards.tsx
import React, { useState, useEffect } from 'react'
import MathText from './MathText'

interface FlashcardProps {
  flashcards: {
    front: string
    back: string
  }[]
}

const Flashcards: React.FC<FlashcardProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0))
  }

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // const resetCard = (index: number) => {
  //   setFlippedCards(prev => {
  //     const newSet = new Set(prev)
  //     newSet.delete(index)
  //     return newSet
  //   })
  // }

  useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      goToPrevious()
    } else if (event.key === 'ArrowRight') {
      goToNext()
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      toggleFlip(currentIndex)
    }
  }

  window.addEventListener('keydown', handleKeyPress)
  return () => window.removeEventListener('keydown', handleKeyPress)
}, [currentIndex]) 

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🃏</div>
        <p className="text-slate-600">No flashcards available for this chapter.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Flashcards</h2>
          <p className="text-slate-600 mt-1">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-500">Progress</span>
          <div className="w-32 h-2 bg-slate-200 rounded-full">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="relative flex items-center justify-center">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-0 z-10 p-3 bg-white border border-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={flashcards.length <= 1}
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-0 z-10 p-3 bg-white border border-slate-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={flashcards.length <= 1}
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="w-full max-w-lg mx-16 perspective-1000">
          <div 
            className={`relative w-full h-80 preserve-3d transition-transform duration-500 cursor-pointer hover:scale-102 ${
              flippedCards.has(currentIndex) ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
            onClick={() => toggleFlip(currentIndex)}
          >
            {/* Front of card */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-2xl shadow-lg flex flex-col justify-center items-center p-8 hover:shadow-xl transition-shadow"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <div className="text-primary-600 font-medium text-sm uppercase tracking-wide mb-4">
                  Question
                </div>
                <p className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
                  <div className="prose prose-slate max-w-none">
                    <MathText className="text-slate-700 leading-relaxed mb-6">
                      {flashcards[currentIndex].front}
                    </MathText>
                  </div>
                </p>
                <div className="flex items-center justify-center text-primary-500">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122" />
                  </svg>
                  <span className="text-sm font-medium">Click to reveal answer</span>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl shadow-lg flex flex-col justify-center items-center p-8 hover:shadow-xl transition-shadow rotate-y-180"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="text-center">
                <div className="text-green-600 font-medium text-sm uppercase tracking-wide mb-4">
                  Answer
                </div>
                <p className="text-xl font-medium text-slate-900 mb-8 leading-relaxed">
                  <div className="prose prose-slate max-w-none">
                    <MathText className="text-slate-700 leading-relaxed mb-6">
                      {flashcards[currentIndex].back}
                    </MathText>
                  </div>
                </p>
                <div className="flex items-center justify-center text-green-500">
                  <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122" />
                  </svg>
                  <span className="text-sm font-medium">Click to show question</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Instructions */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Use 
          <span className="ml-2 inline-flex items-center">
            <kbd className="px-2 py-1 bg-slate-100 rounded text-xs mx-1">←</kbd>
            <kbd className="px-2 py-1 bg-slate-100 rounded text-xs mx-1">→</kbd>
            to navigate • Press Space to flip
          </span>
        </p>
      </div>
    </div>
  )
}

export default Flashcards
