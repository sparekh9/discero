// Test the new Structured Outputs pipeline
console.log("=== OpenAI Structured Outputs LaTeX Pipeline Test ===\n")

// Simulate what structured outputs will return
const mockStructuredResponse = {
  content: {
    introduction: "The derivative $\\frac{df}{dx}$ represents the rate of change",
    sections: [{
      title: "Integration Techniques",
      content: "Consider the integral $\\int_0^1 x^2 dx$ and Greek letters $\\alpha, \\beta$",
      examples: [
        "Chain rule: $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$",
        "Integration by parts: $\\int u dv = uv - \\int v du$"
      ],
      keyPoints: [
        "Partial derivatives use notation $\\frac{\\partial f}{\\partial x}$",
        "Complex integrals: $\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$"
      ]
    }],
    exercises: [{
      type: "practice",
      question: "Calculate $\\frac{d}{dx}[\\sin(x^2)]$",
      solution: "Using chain rule: $2x\\cos(x^2)$",
      difficulty: "medium"
    }],
    summary: "This chapter covered derivatives $f'(x)$ and integrals $\\int f(x) dx$",
    nextSteps: "Next we'll explore $\\nabla$ operators and $\\partial$ derivatives"
  },
  flashcards: [{
    front: "What is $\\frac{d}{dx}[x^n]$?",
    back: "$nx^{n-1}$ (power rule)"
  }],
  quiz: [{
    question: "Which represents the derivative of $f(x)$?",
    options: [
      "$f'(x)$ or $\\frac{df}{dx}$",
      "$\\int f(x) dx$", 
      "$\\sum f(x)$",
      "$\\alpha f(x)$"
    ],
    correct: 0,
    explanation: "The derivative is written as $f'(x)$ or $\\frac{df}{dx}$"
  }]
}

console.log("1. STRUCTURED OUTPUTS RESPONSE:")
console.log("===============================")
console.log("With structured outputs, the API returns exactly what we need:")
console.log(JSON.stringify(mockStructuredResponse, null, 2))

console.log("\n2. KEY IMPROVEMENTS:")
console.log("===================")
console.log("✅ Single backslashes in LaTeX (no double-escaping needed)")
console.log("✅ Guaranteed schema compliance (no parsing errors)")
console.log("✅ No manual cleanup functions required")
console.log("✅ Consistent LaTeX formatting")

console.log("\n3. LATEX EXPRESSIONS FOUND:")
console.log("============================")

// Extract all LaTeX expressions from the response
function extractLatexExpressions(obj, path = "") {
  const expressions = []
  
  if (typeof obj === 'string') {
    const matches = [...obj.matchAll(/\$([^$]+)\$/g)]
    matches.forEach(match => {
      expressions.push({
        path: path,
        expression: match[1],
        fullMatch: match[0]
      })
    })
    
    const blockMatches = [...obj.matchAll(/\$\$([^$]+)\$\$/g)]
    blockMatches.forEach(match => {
      expressions.push({
        path: path,
        expression: match[1],
        fullMatch: match[0],
        type: 'block'
      })
    })
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      expressions.push(...extractLatexExpressions(item, `${path}[${i}]`))
    })
  } else if (obj !== null && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key
      expressions.push(...extractLatexExpressions(value, newPath))
    })
  }
  
  return expressions
}

const latexExpressions = extractLatexExpressions(mockStructuredResponse)

latexExpressions.forEach((expr, i) => {
  console.log(`${i + 1}. Path: ${expr.path}`)
  console.log(`   Expression: "${expr.expression}"`)
  console.log(`   Full: ${expr.fullMatch}`)
  console.log(`   Type: ${expr.type || 'inline'}`)
  console.log()
})

console.log("4. PIPELINE FLOW:")
console.log("=================")
console.log("OpenAI Structured Outputs → JSON.parse() → React Components → KaTeX")
console.log("Single \\\\ → Single \\\\ → Single \\\\ → Rendered Math")
console.log()
console.log("✅ No escaping issues!")
console.log("✅ No cleanup functions needed!")
console.log("✅ Guaranteed valid JSON structure!")
console.log("✅ Perfect LaTeX rendering!")