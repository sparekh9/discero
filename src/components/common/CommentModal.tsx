// src/components/common/CommentModal.tsx
import React, { useEffect, useRef, useState } from 'react'

interface CommentModalProps {
  isOpen: boolean
  selectedText: string
  existingComment?: string
  onSave: (comment: string) => void
  onDiscard: () => void
}

const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  selectedText,
  existingComment,
  onSave,
  onDiscard,
}) => {
  const [comment, setComment] = useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // // Focus textarea when modal opens
  // useEffect(() => {
  //   if (isOpen && textareaRef.current) {
  //     textareaRef.current.focus()
  //   }
  // }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onDiscard()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onDiscard])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onDiscard()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onDiscard])

  // Reset or load comment when modal opens
  useEffect(() => {
    if (isOpen) {
      setComment(existingComment || '')
    }
  }, [isOpen, existingComment])

  const handleSave = () => {
    if (comment.trim()) {
      onSave(comment)
      setComment('')
    }
  }

  const handleDiscard = () => {
    setComment('')
    onDiscard()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm bg-opacity-10 transition-all">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 p-6 transform transition-all"
      >
        {/* Header */}
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          {existingComment ? 'Edit Comment' : 'Add Comment'}
        </h2>

        {/* Selected Text Display */}
        <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-200">
          <p className="text-xs font-medium text-slate-500 mb-1">Selected text:</p>
          <p className="text-sm text-slate-700 italic">"{selectedText}"</p>
        </div>

        {/* Comment Input */}
        <div className="mb-6">
          <label htmlFor="comment-input" className="block text-sm font-medium text-slate-700 mb-2">
            Your comment
          </label>
          <textarea
            ref={textareaRef}
            id="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={6}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={!comment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {existingComment ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentModal
