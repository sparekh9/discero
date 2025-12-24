// src/hooks/useCommentSystem.ts
import { useState, useEffect, useRef, type RefObject } from 'react'
import { Timestamp } from 'firebase/firestore'
import { commentService, type CommentDocument, type CommentPosition } from '../services/commentService'

interface UseCommentSystemProps {
  courseId: string | undefined
  chapterIndex: number
  userId: string | undefined
  contentRef: RefObject<HTMLElement>
}

interface UseCommentSystemReturn {
  comments: CommentDocument[]
  isLoadingComments: boolean
  activeComment: { commentId: string; position: { x: number; y: number } } | null
  setActiveComment: (comment: { commentId: string; position: { x: number; y: number } } | null) => void
  isCommentModalOpen: boolean
  setIsCommentModalOpen: (open: boolean) => void
  selectedText: string
  setSelectedText: (text: string) => void
  selectedRange: Range | null
  setSelectedRange: (range: Range | null) => void
  editingComment: CommentDocument | null
  setEditingComment: (comment: CommentDocument | null) => void
  handleSaveComment: (comment: string) => Promise<void>
  handleDiscardComment: () => void
  handleEditComment: (comment: CommentDocument) => void
  handleDeleteComment: (comment: CommentDocument) => Promise<void>
  onComment: (text: string, range: Range | null) => void
}

export function useCommentSystem({
  courseId,
  chapterIndex,
  userId,
  contentRef
}: UseCommentSystemProps): UseCommentSystemReturn {
  const [comments, setComments] = useState<CommentDocument[]>([])
  const commentsRef = useRef(comments)
  const [activeComment, setActiveComment] = useState<{
    commentId: string
    position: { x: number; y: number }
  } | null>(null)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [selectedRange, setSelectedRange] = useState<Range | null>(null)
  const [editingComment, setEditingComment] = useState<CommentDocument | null>(null)
  const [isLoadingComments, setIsLoadingComments] = useState(true)

  // Keep commentsRef in sync with comments state
  useEffect(() => {
    commentsRef.current = comments
  }, [comments])

  // Load comments when chapter changes
  useEffect(() => {
    const loadComments = async () => {
      if (!courseId || !userId || chapterIndex < 0) {
        setComments([])
        setIsLoadingComments(false)
        return
      }

      setIsLoadingComments(true)
      setActiveComment(null)

      try {
        const loadedComments = await commentService.getChapterComments(
          courseId,
          chapterIndex,
          userId
        )
        console.log("Got comments...", loadedComments)
        setComments(loadedComments)
      } catch (error) {
        console.error('Failed to load comments:', error)
        setComments([])
      } finally {
        setIsLoadingComments(false)
      }
    }

    loadComments()
  }, [chapterIndex, courseId, userId])

  // Restore highlights after comments load and content is rendered
  useEffect(() => {
    if (!contentRef.current || isLoadingComments || comments.length === 0) {
      return
    }

    // Wait for DOM to be ready
    const timeoutId = setTimeout(() => {
      comments.forEach(comment => {
        try {
          restoreHighlight(comment)
        } catch (error) {
          console.error('Failed to restore highlight for comment:', comment.id, error)
        }
      })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [comments, isLoadingComments, contentRef])

  // Style active highlight differently
  useEffect(() => {
    // Reset all highlights to normal state
    document.querySelectorAll('mark[data-highlight-id]').forEach(el => {
      const mark = el as HTMLElement
      mark.style.backgroundColor = 'rgba(250, 204, 21, 0.3)'
      mark.style.outline = 'none'
    })

    // If there's an active comment, highlight it prominently
    if (activeComment) {
      const comment = comments.find(c => c.id === activeComment.commentId)
      if (comment) {
        document.querySelectorAll(`[data-highlight-id="${comment.highlightId}"]`).forEach(el => {
          const mark = el as HTMLElement
          mark.style.backgroundColor = 'rgba(250, 204, 21, 0.6)'
          mark.style.outline = '2px solid rgba(250, 204, 21, 0.8)'
          mark.style.outlineOffset = '1px'
        })
      }
    }
  }, [activeComment, comments])

  // Helper function to calculate position data from a range
  const calculatePositionData = (range: Range): CommentPosition | null => {
    if (!contentRef.current) {
      console.warn('Content ref not available')
      return null
    }

    try {
      // Build a complete text representation of the entire content area
      const textNodes: Node[] = []
      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        null
      )

      let node
      while ((node = walker.nextNode())) {
        textNodes.push(node)
      }

      // Create a map of the entire document's text
      let combinedText = ''
      const nodeMap: Array<{ node: Node; start: number; end: number }> = []

      textNodes.forEach(textNode => {
        const text = textNode.textContent || ''
        const start = combinedText.length
        const end = start + text.length
        nodeMap.push({ node: textNode, start, end })
        combinedText += text
      })

      // Find where the range starts and ends in the combined text
      const { startContainer, startOffset: rangeStartOffset, endContainer, endOffset: rangeEndOffset } = range

      // Find the start position in combined text
      let documentStartOffset = -1
      for (const mapping of nodeMap) {
        if (mapping.node === startContainer) {
          documentStartOffset = mapping.start + rangeStartOffset
          break
        }
      }

      // Find the end position in combined text
      let documentEndOffset = -1
      for (const mapping of nodeMap) {
        if (mapping.node === endContainer) {
          documentEndOffset = mapping.start + rangeEndOffset
          break
        }
      }

      if (documentStartOffset === -1 || documentEndOffset === -1) {
        console.warn('Could not find selection boundaries in document text')
        return null
      }

      // Validate selection
      const selectedText = range.toString()
      const extractedText = combinedText.substring(documentStartOffset, documentEndOffset)

      if (extractedText !== selectedText) {
        console.warn('Selection text mismatch - offsets may be incorrect')
        // Continue anyway, as this might work for restoration
      }

      // Extract context for fuzzy matching (100 chars before and after)
      const textBefore = combinedText.substring(
        Math.max(0, documentStartOffset - 100),
        documentStartOffset
      )
      const textAfter = combinedText.substring(
        documentEndOffset,
        Math.min(combinedText.length, documentEndOffset + 100)
      )

      return {
        startOffset: documentStartOffset,
        endOffset: documentEndOffset,
        textBefore,
        textAfter
      }
    } catch (error) {
      console.error('Error calculating position data:', error)
      return null
    }
  }

  // Helper function to restore highlight from stored comment
  const restoreHighlight = (comment: CommentDocument) => {
    const { position, highlightId } = comment

    if (!contentRef.current) {
      console.warn('Content ref not available')
      return
    }

    try {
      // Get all text nodes in the content
      const textNodes: Node[] = []
      const walker = document.createTreeWalker(
        contentRef.current,
        NodeFilter.SHOW_TEXT,
        null
      )

      let node
      while ((node = walker.nextNode())) {
        textNodes.push(node)
      }

      // Build a map of text content with node information
      let combinedText = ''
      const nodeMap: Array<{ node: Node; start: number; end: number }> = []

      textNodes.forEach(textNode => {
        const text = textNode.textContent || ''
        const start = combinedText.length
        const end = start + text.length
        nodeMap.push({ node: textNode, start, end })
        combinedText += text
      })

      const searchIndex = position.startOffset
      const endIndex = position.endOffset

      // Find the start and end nodes
      let startNode: Node | null = null
      let startOffset = 0
      let endNode: Node | null = null
      let endOffset = 0

      for (const mapping of nodeMap) {
        // Find start node
        if (!startNode && searchIndex >= mapping.start && searchIndex < mapping.end) {
          startNode = mapping.node
          startOffset = searchIndex - mapping.start
        }

        // Find end node
        if (!endNode && endIndex > mapping.start && endIndex <= mapping.end) {
          endNode = mapping.node
          endOffset = endIndex - mapping.start
        }

        if (startNode && endNode) break
      }

      if (!startNode || !endNode) {
        console.warn('Could not find DOM nodes for comment:', comment.id)
        return
      }

      // Validate offsets
      const startNodeLength = (startNode.textContent || '').length
      const endNodeLength = (endNode.textContent || '').length

      if (startOffset < 0 || startOffset > startNodeLength) {
        console.warn('Invalid start offset for comment:', comment.id, 'offset:', startOffset, 'length:', startNodeLength)
        return
      }

      if (endOffset < 0 || endOffset > endNodeLength) {
        console.warn('Invalid end offset for comment:', comment.id, 'offset:', endOffset, 'length:', endNodeLength)
        return
      }

      // Create range and apply highlight
      const range = document.createRange()
      range.setStart(startNode, startOffset)
      range.setEnd(endNode, endOffset)

      // Apply the highlight with the stored highlightId
      applyHighlight(range, highlightId)
    } catch (error) {
      console.error('Failed to restore highlight for comment:', comment.id, error)
    }
  }

  // Utility function to get all text nodes within a range
  const getTextNodesInRange = (range: Range): Node[] => {
    if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE) {
      return [range.commonAncestorContainer]
    }

    const textNodes: Node[] = []
    const walker = document.createTreeWalker(
      range.commonAncestorContainer,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const nodeRange = document.createRange()
          nodeRange.selectNodeContents(node)

          // Check if this text node intersects with our range
          if (
            range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
            range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0
          ) {
            return NodeFilter.FILTER_ACCEPT
          }
          return NodeFilter.FILTER_REJECT
        }
      }
    )

    let node
    while ((node = walker.nextNode())) {
      textNodes.push(node)
    }

    return textNodes
  }

  // Utility function to apply highlight to a range
  const applyHighlight = (range: Range, existingId?: string): string => {
    const highlightId = existingId || `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Helper to create a mark element
    const createMark = (): HTMLElement => {
      const mark = document.createElement('mark')
      mark.dataset.highlightId = highlightId
      mark.style.backgroundColor = 'rgba(250, 204, 21, 0.3)' // Faint yellow
      mark.style.cursor = 'pointer'
      mark.style.transition = 'background-color 0.2s'

      // Add click handler to show comment
      mark.addEventListener('click', (e) => {
        e.stopPropagation()

        // Find the comment associated with this highlight (use ref to get current comments)
        const comment = commentsRef.current.find(c => c.highlightId === highlightId)
        if (comment) {
          // Get position for popover
          const rect = mark.getBoundingClientRect()
          setActiveComment({
            commentId: comment.id,
            position: {
              x: rect.left + rect.width / 2, // Center horizontally
              y: rect.top // Top of the highlight
            }
          })
        }
      })

      // Add hover effect
      mark.addEventListener('mouseenter', () => {
        // Highlight all marks with the same highlightId
        document.querySelectorAll(`[data-highlight-id="${highlightId}"]`).forEach(el => {
          (el as HTMLElement).style.backgroundColor = 'rgba(250, 204, 21, 0.5)'
        })
      })
      mark.addEventListener('mouseleave', () => {
        document.querySelectorAll(`[data-highlight-id="${highlightId}"]`).forEach(el => {
          (el as HTMLElement).style.backgroundColor = 'rgba(250, 204, 21, 0.3)'
        })
      })

      return mark
    }

    // Get all text nodes in the range
    const textNodes = getTextNodesInRange(range)
    console.log("Found ", textNodes.length, " nodes...")

    if (textNodes.length === 0) {
      console.warn('No text nodes found in range')
      return highlightId
    }

    // Process each text node
    textNodes.forEach((node, index) => {
      const isFirstNode = index === 0
      const isLastNode = index === textNodes.length - 1
      const text = node.textContent || ''

      let startOffset = 0
      let endOffset = text.length

      // Calculate offsets for first and last nodes
      if (isFirstNode && node === range.startContainer) {
        startOffset = range.startOffset
      }
      if (isLastNode && node === range.endContainer) {
        endOffset = range.endOffset
      }

      // Skip if the range is empty in this node
      if (startOffset >= endOffset) {
        return
      }

      const textNode = node as Text

      // If we need the entire text node
      if (startOffset === 0 && endOffset === text.length) {
        const mark = createMark()
        textNode.parentNode?.insertBefore(mark, textNode)
        mark.appendChild(textNode)
      } else {
        // We need to split the text node
        if (startOffset > 0) {
          // Split off the part before our selection
          textNode.splitText(startOffset)
        }

        // Now the textNode starts at our selection point
        const selectedLength = endOffset - startOffset
        const selectedNode = textNode

        if (selectedLength < selectedNode.textContent!.length) {
          // Split off the part after our selection
          selectedNode.splitText(selectedLength)
        }

        // Wrap the selected portion
        const mark = createMark()
        selectedNode.parentNode?.insertBefore(mark, selectedNode)
        mark.appendChild(selectedNode)
      }
    })

    return highlightId
  }

  // Handler to initiate comment creation
  const onComment = (text: string, range: Range | null) => {
    setSelectedText(text)
    setSelectedRange(range)
    setIsCommentModalOpen(true)
  }

  // Handler to save comment
  const handleSaveComment = async (comment: string) => {
    console.log('Saving comment:', comment)
    console.log('For selected text:', selectedText)
    console.log('For range:', selectedRange)

    if (!selectedRange || !selectedText || !courseId || !userId) {
      return
    }

    try {
      // If editing an existing comment
      if (editingComment) {
        await commentService.updateComment(
          courseId,
          chapterIndex,
          editingComment.id,
          comment
        )

        // Update local state
        setComments(prev =>
          prev.map(c => c.id === editingComment.id
            ? { ...c, commentText: comment }
            : c
          )
        )

        setEditingComment(null)
        setIsCommentModalOpen(false)
        return
      }

      // Creating a new comment
      // Clone the range before modifying the DOM
      const rangeClone = selectedRange.cloneRange()

      // Calculate position data
      const positionData = calculatePositionData(rangeClone)

      if (!positionData) {
        console.error('Failed to calculate position data')
        alert('Failed to save comment. Could not determine text position.')
        return
      }

      // Generate highlight ID
      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Apply highlight to the selected range
      applyHighlight(rangeClone, highlightId)

      // Save to Firestore
      const commentId = await commentService.saveComment(
        courseId,
        chapterIndex,
        userId,
        comment,
        selectedText,
        positionData,
        highlightId
      )

      // Add to local state
      const now = Timestamp.now()
      const newComment: CommentDocument = {
        id: commentId,
        userId: userId,
        commentText: comment,
        selectedText: selectedText,
        position: positionData,
        highlightId: highlightId,
        createdAt: now,
        updatedAt: now
      }

      setComments(prev => [...prev, newComment])
      console.log('Comment saved with highlight:', newComment)
    } catch (error) {
      console.error('Failed to save comment:', error)
      alert('Failed to save comment. Please try again.')
    }

    // Clear selection and close modal
    setIsCommentModalOpen(false)
  }

  // Handler to discard comment
  const handleDiscardComment = () => {
    setIsCommentModalOpen(false)
    setEditingComment(null)
  }

  // Handler to edit comment
  const handleEditComment = (comment: CommentDocument) => {
    setEditingComment(comment)
    setSelectedText(comment.selectedText)
    setIsCommentModalOpen(true)
    setActiveComment(null)
  }

  // Handler to delete comment
  const handleDeleteComment = async (comment: CommentDocument) => {
    if (!courseId) return

    const confirmed = window.confirm('Are you sure you want to delete this comment?')
    if (!confirmed) return

    try {
      // Delete from Firestore
      await commentService.deleteComment(courseId, chapterIndex, comment.id)

      // Remove highlights from DOM
      document.querySelectorAll(`[data-highlight-id="${comment.highlightId}"]`).forEach(mark => {
        const parent = mark.parentNode
        if (parent) {
          // Move all children out of the mark
          while (mark.firstChild) {
            parent.insertBefore(mark.firstChild, mark)
          }
          // Remove the empty mark
          parent.removeChild(mark)
        }
      })

      // Update local state
      setComments(prev => prev.filter(c => c.id !== comment.id))
      setActiveComment(null)
    } catch (error) {
      console.error('Failed to delete comment:', error)
      alert('Failed to delete comment. Please try again.')
    }
  }

  return {
    comments,
    isLoadingComments,
    activeComment,
    setActiveComment,
    isCommentModalOpen,
    setIsCommentModalOpen,
    selectedText,
    setSelectedText,
    selectedRange,
    setSelectedRange,
    editingComment,
    setEditingComment,
    handleSaveComment,
    handleDiscardComment,
    handleEditComment,
    handleDeleteComment,
    onComment
  }
}
