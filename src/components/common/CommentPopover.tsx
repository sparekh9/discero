// src/components/common/CommentPopover.tsx
import React, { useEffect, useRef } from 'react'

interface CommentPopoverProps {
  selectedText: string
  comment: string
  position: { x: number, y: number }
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

const CommentPopover: React.FC<CommentPopoverProps> = ({
  // selectedText is kept for future use (e.g., displaying which text was highlighted)
  comment,
  position,
  onClose,
  onEdit,
  onDelete
}) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    // Delay adding the listener to prevent immediate close from the highlight click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Calculate popover position - show above the highlight
  const popoverStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    transform: 'translate(-50%, -100%)', // Center horizontally, position above
    marginTop: '-12px', // Add some spacing from the highlight
    zIndex: 1000,
    maxWidth: '400px',
    minWidth: '300px'
  }

  return (
    <div
      ref={popoverRef}
      style={popoverStyle}
      className="bg-white rounded-lg shadow-2xl border border-slate-200 p-4 animate-in fade-in duration-200"
    >
      {/* Header with close button */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">Comment</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Comment content */}
      <div className="p-3 bg-slate-50 rounded border border-slate-200 mb-3">
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment}</p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors"
        >
          Delete
        </button>
      </div>

      {/* Arrow pointing down to highlight */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-200 absolute top-[-9px] left-1/2 transform -translate-x-1/2"></div>
      </div>
    </div>
  )
}

export default CommentPopover
