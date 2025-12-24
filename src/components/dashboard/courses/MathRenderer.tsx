// src/components/MathRenderer.tsx
import React from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface MathRendererProps {
  children: string
  block?: boolean
  className?: string
}

const MathRenderer: React.FC<MathRendererProps> = ({ 
  children, 
  block = false, 
  className = '' 
}) => {
  try {
    if (block) {
      return (
        <div className={`my-4 ${className}`}>
          <BlockMath math={children} />
        </div>
      )
    } else {
      return (
        <span className={className}>
          <InlineMath math={children} />
        </span>
      )
    }
  } catch {
    // Fallback for invalid LaTeX
    return (
      <span className={`bg-red-100 text-red-800 px-2 py-1 rounded text-sm ${className}`}>
        Invalid math: {children}
      </span>
    )
  }
}

export default MathRenderer
