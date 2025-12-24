// src/hooks/useTextSelection.ts
import { useState, useEffect, useCallback, type RefObject } from 'react'

export interface SelectionInfo {
  text: string
  range: Range | null
  rect: DOMRect | null
}

export const useTextSelection = (containerRef?: RefObject<HTMLElement>) => {
  const [selection, setSelection] = useState<SelectionInfo>({
    text: '',
    range: null,
    rect: null,
  })

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection()

    if (!sel || sel.rangeCount === 0) {
      setSelection({ text: '', range: null, rect: null })
      return
    }

    const range = sel.getRangeAt(0)
    const selectedText = sel.toString().trim()

    // If text is selected and is within the container (if specified)
    if (selectedText.length > 0) {
      // Check if selection is within the specified container
      if (containerRef?.current) {
        const isWithinContainer = containerRef.current.contains(range.commonAncestorContainer)
        if (!isWithinContainer) {
          setSelection({ text: '', range: null, rect: null })
          return
        }
      }

      const rect = range.getBoundingClientRect()
      setSelection({
        text: selectedText,
        range: range.cloneRange(),
        rect,
      })
    } else {
      setSelection({ text: '', range: null, rect: null })
    }
  }, [containerRef])

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    document.addEventListener('mouseup', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
      document.removeEventListener('mouseup', handleSelectionChange)
    }
  }, [handleSelectionChange])

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
    setSelection({ text: '', range: null, rect: null })
  }, [])

  return { selection, clearSelection }
}
