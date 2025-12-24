// src/components/MathText.tsx
import React from 'react'
import MathRenderer from './MathRenderer'

interface MathTextProps {
  children: string
  className?: string
}

const MathText: React.FC<MathTextProps> = ({ children, className = '' }) => {
  // Use a shared key counter across all parsing functions
  let keyCounter = 0
  const getNextKey = () => keyCounter++

  // Preprocess text to handle numbered lists
  const preprocessText = (text: string): string => {
    // Match integers followed by a period (e.g., "1.", "2.", "10.")
    // Prepend two newlines for extra spacing
    return text.replace(/([^\n])(\d+\.)/g, '$1\n\n$2')
  }

  // Parse text recursively to handle nested formatting like bold text with math
  const parseTextRecursive = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = []
    const remaining = text

    // First handle block math (highest priority)
    const blockMathRegex = /(\\\[(.*?)\\\]|\$\$(.*?)\$\$)([.,;:!?]?)/gs
    let match
    let lastIndex = 0

    while ((match = blockMathRegex.exec(remaining)) !== null) {
      // Add text before this match
      if (match.index > lastIndex) {
        const beforeText = remaining.slice(lastIndex, match.index)
        result.push(...parseInlineAndBold(beforeText))
      }

      // Add the block math
      const mathContent = match[2] !== undefined ? match[2].trim() : match[3].trim()
      const punctuation = match[4] || ''
      const contentWithPunctuation = punctuation ? mathContent + punctuation : mathContent

      result.push(
        <MathRenderer key={`block-${getNextKey()}`} block={true}>
          {contentWithPunctuation}
        </MathRenderer>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < remaining.length) {
      const remainingText = remaining.slice(lastIndex)
      result.push(...parseInlineAndBold(remainingText))
    }

    return result
  }

  // Parse inline math and bold formatting
  const parseInlineAndBold = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = []
    const remaining = text

    // Handle bold text that may contain inline math
    const boldRegex = /\*\*([^*]+?)\*\*/g
    let match
    let lastIndex = 0

    while ((match = boldRegex.exec(remaining)) !== null) {
      // Add text before this match (parse for inline math)
      if (match.index > lastIndex) {
        const beforeText = remaining.slice(lastIndex, match.index)
        result.push(...parseInlineMath(beforeText))
      }

      // Parse the bold content for inline math
      const boldContent = match[1]
      const boldParsed = parseInlineMath(boldContent)

      result.push(
        <span key={`bold-${getNextKey()}`} className="font-semibold">
          {boldParsed}
        </span>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text (parse for inline math)
    if (lastIndex < remaining.length) {
      const remainingText = remaining.slice(lastIndex)
      result.push(...parseInlineMath(remainingText))
    }

    return result
  }

  // Parse only inline math
  const parseInlineMath = (text: string): React.ReactNode[] => {
    const result: React.ReactNode[] = []
    const remaining = text

    const inlineMathRegex = /(\\\((.*?)\\\)|\$([^$]*?)\$)/gs
    let match
    let lastIndex = 0

    while ((match = inlineMathRegex.exec(remaining)) !== null) {
      // Add text before this match
      if (match.index > lastIndex) {
        const beforeText = remaining.slice(lastIndex, match.index)
        if (beforeText) result.push(...splitOnNewlines(beforeText))
      }

      // Add the inline math
      const content = match[2] !== undefined ? match[2].trim() : match[3].trim()
      result.push(
        <MathRenderer key={`inline-${getNextKey()}`} block={false}>
          {content}
        </MathRenderer>
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < remaining.length) {
      const remainingText = remaining.slice(lastIndex)
      if (remainingText) result.push(...splitOnNewlines(remainingText))
    }

    return result
  }

  // Helper function to split text on newlines and insert <br> elements
  const splitOnNewlines = (text: string): React.ReactNode[] => {
    const parts = text.split('\n')
    const result: React.ReactNode[] = []

    parts.forEach((part, index) => {
      if (part) result.push(part)
      // Add <br> after each part except the last one
      if (index < parts.length - 1) {
        result.push(<br key={`br-${getNextKey()}`} />)
      }
    })

    return result
  }

  // Apply preprocessing before parsing
  const preprocessedText = preprocessText(children)

  return (
    <div className={className}>
      {parseTextRecursive(preprocessedText)}
    </div>
  )
}

export default MathText
