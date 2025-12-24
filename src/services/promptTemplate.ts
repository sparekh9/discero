// src/services/promptTemplates.ts
export interface SubjectPromptConfig {
  subject: string
  contentGuidelines: string
  mathSupport: boolean
  specialInstructions: string[]
  exampleTypes: string[]
  assessmentFocus: string[]
}

export const subjectPrompts: Record<string, SubjectPromptConfig> = {
  mathematics: {
    subject: 'Mathematics',
    mathSupport: true,
    contentGuidelines: `
MATHEMATICAL CONTENT Guidelines:
- Include step-by-step proofs and derivations with proper LaTeX formatting
- Show all mathematical work using LaTeX: $\\\\frac{dy}{dx}$, $\\\\int f(x) dx$, $\\\\sum_{i=1}^n x_i$
- Use LaTeX for equations, formulas, and mathematical symbols throughout
- Provide multiple solution methods where applicable
- Focus on logical reasoning and mathematical rigor`,
    specialInstructions: [
      'Include detailed mathematical proofs with LaTeX formatting',
      'Show step-by-step problem-solving processes using mathematical notation',
      'Use LaTeX for all mathematical expressions, fractions, integrals, and derivatives',
      'Provide alternative solution methods with clear mathematical steps',
      'Connect abstract concepts to concrete examples with calculations'
    ],
    exampleTypes: [
      'Worked problems: "Find $\\\\frac{d}{dx}[x^3 + 2x^2 - 5x + 1] = 3x^2 + 4x - 5$"',
      'Proof demonstrations with LaTeX: "Prove that $\\\\lim_{x \\\\to 0} \\\\frac{\\\\sin x}{x} = 1$"',
      'Formula derivations: "Derive the quadratic formula $x = \\\\frac{-b \\\\pm \\\\sqrt{b^2-4ac}}{2a}$"',
      'Geometric relationships with mathematical expressions'
    ],
    assessmentFocus: [
      'Problem-solving methodology with proper mathematical notation',
      'Mathematical reasoning and proof techniques',
      'Formula application and algebraic manipulation',
      'Understanding of mathematical concepts through calculations'
    ]
  },

  history: {
    subject: 'History',
    mathSupport: false,
    contentGuidelines: `
HISTORICAL CONTENT Guidelines:
- Focus on chronological understanding and cause-effect relationships
- Include primary source quotes and historical context
- Emphasize multiple perspectives and interpretations
- Connect historical events to modern implications`,
    specialInstructions: [
      'Include specific dates, names, and locations',
      'Provide historical context and background',
      'Present multiple historical perspectives',
      'Use primary source excerpts when relevant',
      'Connect past events to present-day relevance'
    ],
    exampleTypes: [
      'Primary source document excerpts with analysis',
      'Timeline comparisons between events',
      'Biographical sketches of key historical figures',
      'Case studies of historical cause-and-effect relationships'
    ],
    assessmentFocus: [
      'Chronological understanding',
      'Historical analysis and interpretation',
      'Cause and effect relationships',
      'Historical significance and relevance'
    ]
  },

  physics: {
    subject: 'Physics',
    mathSupport: true,
    contentGuidelines: `
PHYSICS CONTENT Guidelines:
- Combine mathematical formulations with conceptual understanding using LaTeX
- Include both theoretical foundations and practical applications with equations
- Use LaTeX for all physics equations: $F = ma$, $E = mc^2$, $v = \\\\frac{dx}{dt}$
- Show mathematical derivations: $W = \\\\int F \\\\cdot dx$, $\\\\nabla \\\\cdot E = \\\\frac{\\\\rho}{\\\\epsilon_0}$
- Emphasize experimental design and scientific method with quantitative analysis`,
    specialInstructions: [
      'Balance mathematical rigor with conceptual understanding using proper notation',
      'Include experimental procedures with mathematical analysis and error calculations',
      'Connect physical principles to everyday phenomena with quantitative examples',
      'Provide both algebraic and calculus-based approaches using LaTeX',
      'Include units and dimensional analysis: $[F] = kg \\\\cdot m \\\\cdot s^{-2}$'
    ],
    exampleTypes: [
      'Problem-solving: "Given $v_0 = 10$ m/s, find $x(t) = v_0 t + \\\\frac{1}{2}at^2$"',
      'Derivations: "Derive $P = \\\\frac{dW}{dt} = F \\\\cdot v$ from basic principles"',
      'Experimental analysis with uncertainty: "$g = 9.81 \\\\pm 0.05$ m/s²"',
      'Real-world applications with mathematical models'
    ],
    assessmentFocus: [
      'Mathematical problem-solving with proper physics notation',
      'Conceptual understanding supported by equations',
      'Experimental design with quantitative analysis',
      'Application of mathematical models to physical systems'
    ]
  },

  literature: {
    subject: 'Literature',
    mathSupport: false,
    contentGuidelines: `
LITERATURE CONTENT Guidelines:
- Focus on literary analysis, themes, and critical interpretation
- Include textual evidence and close reading techniques
- Emphasize cultural and historical context of works
- Develop critical thinking and analytical writing skills`,
    specialInstructions: [
      'Include direct quotes from literary works',
      'Analyze literary devices and techniques',
      'Provide historical and cultural context',
      'Encourage multiple interpretations',
      'Connect themes to universal human experiences'
    ],
    exampleTypes: [
      'Close reading analysis with textual evidence',
      'Thematic exploration across different works',
      'Character development studies',
      'Literary device identification and analysis'
    ],
    assessmentFocus: [
      'Literary analysis and interpretation',
      'Use of textual evidence',
      'Understanding of literary devices',
      'Critical thinking and argumentation'
    ]
  },

  chemistry: {
    subject: 'Chemistry',
    mathSupport: true,
    contentGuidelines: `
CHEMISTRY CONTENT Guidelines:
- Integrate molecular-level understanding with macroscopic observations using mathematical relationships
- Use LaTeX for chemical equations: $2H_2 + O_2 \\\\rightarrow 2H_2O$
- Include thermodynamic equations: $\\\\Delta G = \\\\Delta H - T\\\\Delta S$, $K_{eq} = e^{-\\\\Delta G/RT}$
- Show kinetics relationships: $rate = k[A]^m[B]^n$, $ln[A] = ln[A_0] - kt$
- Emphasize safety protocols and laboratory procedures with quantitative analysis`,
    specialInstructions: [
      'Include balanced chemical equations using LaTeX notation',
      'Show stoichiometric calculations with proper mathematical formatting',
      'Provide molecular-level explanations with thermodynamic equations',
      'Include concentration calculations: $M = \\\\frac{n}{V}$, $pH = -log[H^+]$',
      'Connect to real-world applications with quantitative examples'
    ],
    exampleTypes: [
      'Balanced equations: "$CaCO_3 + 2HCl \\\\rightarrow CaCl_2 + H_2O + CO_2$"',
      'Stoichiometry problems: "If 5.0 g of $CaCO_3$ reacts, find moles of $CO_2$"',
      'Thermodynamics: "$\\\\Delta H_{rxn} = \\\\sum \\\\Delta H_{products} - \\\\sum \\\\Delta H_{reactants}$"',
      'Kinetics analysis with rate equations and half-life calculations'
    ],
    assessmentFocus: [
      'Chemical equation balancing and stoichiometry',
      'Molecular understanding with mathematical relationships',
      'Laboratory calculations and quantitative analysis',
      'Problem-solving with thermodynamic and kinetic principles'
    ]
  }
}
