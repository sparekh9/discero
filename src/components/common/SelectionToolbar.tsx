// src/components/common/SelectionToolbar.tsx
import React, { useEffect, useRef, useState } from 'react'

export interface ToolbarOption {
  id: string
  label: string
  icon: React.ReactNode
  action: (selectedText: string, range: Range | null) => void
}

interface SelectionToolbarProps {
  selectedText: string
  selectionRect: DOMRect | null
  range: Range | null
  onClose: () => void
  onComment: () => void
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedText,
  selectionRect,
  range,
  onClose,
  onComment,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Default options
  const options: ToolbarOption[] = [
    {
      id: 'comment',
      label: 'Comment',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      action: () => {
        console.log("Opening CommentModal...")
        onComment()
      },
    },
    {
      id: 'expand',
      label: 'Expand',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      action: (text, textRange) => {
        console.log('Expand on:', text, textRange)
        // TODO: Implement expand functionality
      },
    },
    {
      id: 'clarify',
      label: 'Clarify',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      action: (text, textRange) => {
        console.log('Clarify:', text, textRange)
        // TODO: Implement clarify functionality
      },
    },
  ]

  // Calculate position based on selection rect
  useEffect(() => {
    if (selectionRect && toolbarRef.current) {
      const toolbarHeight = toolbarRef.current.offsetHeight
      const toolbarWidth = toolbarRef.current.offsetWidth

      // Position above the selection by default
      let top = selectionRect.top + window.scrollY - toolbarHeight - 10
      let left = selectionRect.left + window.scrollX + (selectionRect.width / 2) - (toolbarWidth / 2)

      // Ensure toolbar doesn't go off-screen
      const padding = 10

      // Check if toolbar goes above viewport
      if (top < window.scrollY + padding) {
        // Position below the selection instead
        top = selectionRect.bottom + window.scrollY + 10
      }

      // Check if toolbar goes off left edge
      if (left < padding) {
        left = padding
      }

      // Check if toolbar goes off right edge
      if (left + toolbarWidth > window.innerWidth - padding) {
        left = window.innerWidth - toolbarWidth - padding
      }

      setPosition({ top, left })
    }
  }, [selectionRect])

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  if (!selectedText || !selectionRect) {
    return null
  }

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-slate-200 flex items-center gap-1 p-1.5 transition-all duration-200 ease-out opacity-100 scale-100"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            option.action(selectedText, range)
            onClose()
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary-600 transition-colors whitespace-nowrap"
          title={option.label}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}

      {/* Close button */}
      <div className="w-px h-6 bg-slate-200 mx-1" />
      <button
        onClick={onClose}
        className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        title="Close"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default SelectionToolbar
