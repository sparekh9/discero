// src/components/dashboard/courses/ChapterContentView.tsx
import React, { useRef } from 'react'
import { useTextSelection } from '../../../hooks/useTextSelection'
import { useCommentSystem } from '../../../hooks/useCommentSystem'
import MathText from './MathText'
import SelectionToolbar from '../../common/SelectionToolbar'
import CommentModal from '../../common/CommentModal'
import CommentPopover from '../../common/CommentPopover'
import type { ChapterContent } from '../../../services/aiCourseService'

interface ChapterContentViewProps {
  content: ChapterContent
  courseId: string | undefined
  chapterIndex: number
  userId: string | undefined
}

const ChapterContentView: React.FC<ChapterContentViewProps> = ({
  content,
  courseId,
  chapterIndex,
  userId
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const { selection, clearSelection } = useTextSelection(contentRef as React.RefObject<HTMLElement>)

  const {
    comments,
    activeComment,
    setActiveComment,
    isCommentModalOpen,
    selectedText,
    editingComment,
    handleSaveComment,
    handleDiscardComment,
    handleEditComment,
    handleDeleteComment,
    onComment
  } = useCommentSystem({
    courseId,
    chapterIndex,
    userId,
    contentRef: contentRef as React.RefObject<HTMLElement>
  })

  const handleCommentClick = () => {
    onComment(selection.text, selection.range)
  }

  return (
    <div ref={contentRef} className="p-8">
      {/* Chapter Introduction */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
        <div className="text-slate-700 leading-relaxed text-lg">
          <MathText>{content.content.introduction}</MathText>
        </div>
      </div>

      {/* Chapter Sections */}
      <div className="space-y-8">
        {content.content.sections.map((section, index) => (
          <div key={index} className="border-l-4 border-primary-200 pl-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {section.title}
            </h3>
            <div className="prose prose-slate max-w-none">
              <div className="text-slate-700 leading-relaxed mb-6">
                <MathText>{section.content}</MathText>
              </div>
            </div>

            {/* Examples */}
            {section.examples.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Examples:</h4>
                <div className="space-y-3">
                  {section.examples.map((example, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="prose prose-slate max-w-none">
                        <MathText className="text-sm text-slate-800 font-mono">
                          {example}
                        </MathText>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Points */}
            {section.keyPoints.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Key Points:</h4>
                <ul className="space-y-2">
                  {section.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-600 mr-2 mt-1">•</span>
                      <span className="text-slate-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Exercises */}
      {content.content.exercises.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Practice Exercises</h3>
          <div className="space-y-6">
            {content.content.exercises.map((exercise, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${exercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {exercise.difficulty.toUpperCase()}
                  </span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {exercise.type}
                  </span>
                </div>
                <h4 className="font-medium text-slate-900 mb-3">Exercise {index + 1}:</h4>
                <div className="text-slate-700 mb-4">
                  <MathText className="text-slate-700 leading-relaxed mb-6">
                    {exercise.question}
                  </MathText>
                </div>
                <details className="group">
                  <summary className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium">
                    Show Solution
                  </summary>
                  <div className="mt-3 p-4 bg-white rounded-lg border border-blue-200">
                    <div className="prose prose-slate max-w-none">
                      <MathText className="text-sm text-slate-800 whitespace-pre-wrap font-mono">
                        {exercise.solution}
                      </MathText>
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chapter Summary */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Summary</h3>
        <div className="text-slate-700 leading-relaxed mb-6">
          <MathText>{content.content.summary}</MathText>
        </div>

        <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
          <h4 className="font-medium text-primary-900 mb-2">Next Steps</h4>
          <div className="text-primary-800">
            <MathText>{content.content.nextSteps}</MathText>
          </div>
        </div>
      </div>

      {/* Selection Toolbar */}
      <SelectionToolbar
        selectedText={selection.text}
        selectionRect={selection.rect}
        range={selection.range}
        onClose={clearSelection}
        onComment={handleCommentClick}
      />

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        selectedText={selectedText}
        existingComment={editingComment?.commentText}
        onSave={handleSaveComment}
        onDiscard={handleDiscardComment}
      />

      {/* Comment Popover */}
      {activeComment && (() => {
        const comment = comments.find(c => c.id === activeComment.commentId)
        return comment ? (
          <CommentPopover
            selectedText={comment.selectedText}
            comment={comment.commentText}
            position={activeComment.position}
            onClose={() => setActiveComment(null)}
            onEdit={() => handleEditComment(comment)}
            onDelete={() => handleDeleteComment(comment)}
          />
        ) : null
      })()}
    </div>
  )
}

export default ChapterContentView
