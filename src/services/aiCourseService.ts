// src/services/aiCourseService.ts
import OpenAI from 'openai'
import type { CourseFormData } from '../components/dashboard/courses/course-creation/CreateCourse'
import { subjectPrompts, type SubjectPromptConfig } from './promptTemplate'
import type { UserProfile } from '../contexts/AuthContext'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
})

export interface CourseOutline {
  title: string
  description: string
  learningObjectives: string[]
  prerequisites: string[]
  estimatedHours: number
  chapters: Chapter[]
  gamePlan: GamePlan
}

export interface Course {
  id: string,
  uid: string, 
  visibility: 'private' | 'public' | 'shared'
  subject: string
  outline: CourseOutline
  duration: number // weeks
  contents: ChapterContent[]
}

export interface Chapter {
  id?: number 
  title: string
  description: string
  estimatedTime: string
  learningGoals: string[]
  topics: string[]
  hasContent?: boolean
}

export interface ChapterContent {
  id?: number
  content: {
    introduction: string
    sections: {
      title: string
      content: string
      examples: string[]
      keyPoints: string[]
    }[]
    exercises: {
      type: 'practice' | 'quiz' | 'reflection'
      question: string
      solution: string
      difficulty: 'easy' | 'medium' | 'hard'
    }[]
    summary: string
    nextSteps: string
  }
  flashcards: {
    front: string
    back: string
  }[]
  quiz: {
    question: string
    options: string[]
    correct: number // index of correct option
    explanation: string
  }[]
}

export interface GamePlan {
  weeklySchedule: WeeklyPlan[]
  milestones: Milestone[]
  assessmentStrategy: string
}

export interface WeeklyPlan {
  week: number
  focus: string
  chapters: number[]
  activities: string[]
}

export interface Milestone {
  week: number
  title: string
  description: string
  deliverable: string
}

// JSON Schema definitions for Structured Outputs
const CourseOutlineSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    learningObjectives: {
      type: "array",
      items: { type: "string" }
    },
    prerequisites: {
      type: "array", 
      items: { type: "string" }
    },
    estimatedHours: { type: "number" },
    chapters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          estimatedTime: { type: "string" },
          learningGoals: {
            type: "array",
            items: { type: "string" }
          },
          topics: {
            type: "array", 
            items: { type: "string" }
          }
        },
        required: ["title", "description", "estimatedTime", "learningGoals", "topics"],
        additionalProperties: false
      }
    },
    gamePlan: {
      type: "object",
      properties: {
        weeklySchedule: {
          type: "array",
          items: {
            type: "object",
            properties: {
              week: { type: "number" },
              focus: { type: "string" },
              chapters: {
                type: "array",
                items: { type: "number" }
              },
              activities: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["week", "focus", "chapters", "activities"],
            additionalProperties: false
          }
        },
        milestones: {
          type: "array",
          items: {
            type: "object",
            properties: {
              week: { type: "number" },
              title: { type: "string" },
              description: { type: "string" },
              deliverable: { type: "string" }
            },
            required: ["week", "title", "description", "deliverable"],
            additionalProperties: false
          }
        },
        assessmentStrategy: { type: "string" }
      },
      required: ["weeklySchedule", "milestones", "assessmentStrategy"],
      additionalProperties: false
    }
  },
  required: ["title", "description", "learningObjectives", "prerequisites", "estimatedHours", "chapters", "gamePlan"],
  additionalProperties: false
} as const

const ChapterContentSchema = {
  type: "object",
  properties: {
    content: {
      type: "object",
      properties: {
        introduction: { type: "string" },
        sections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              examples: {
                type: "array",
                items: { type: "string" }
              },
              keyPoints: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["title", "content", "examples", "keyPoints"],
            additionalProperties: false
          }
        },
        exercises: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { 
                type: "string",
                enum: ["practice", "quiz", "reflection"]
              },
              question: { type: "string" },
              solution: { type: "string" },
              difficulty: {
                type: "string",
                enum: ["easy", "medium", "hard"]
              }
            },
            required: ["type", "question", "solution", "difficulty"],
            additionalProperties: false
          }
        },
        summary: { type: "string" },
        nextSteps: { type: "string" }
      },
      required: ["introduction", "sections", "exercises", "summary", "nextSteps"],
      additionalProperties: false
    },
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          front: { type: "string" },
          back: { type: "string" }
        },
        required: ["front", "back"],
        additionalProperties: false
      }
    },
    quiz: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" }
          },
          correct: { type: "number" },
          explanation: { type: "string" }
        },
        required: ["question", "options", "correct", "explanation"],
        additionalProperties: false
      }
    }
  },
  required: ["content", "flashcards", "quiz"],
  additionalProperties: false
} as const

class AICourseService {

  async generateCourseOutline(formData: CourseFormData, userProfile?: UserProfile): Promise<CourseOutline> {
    const prompt = this.buildOutlinePrompt(formData, userProfile)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert educational curriculum designer. Generate a comprehensive, pedagogically sound course outline with a detailed game plan."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "course_outline",
          schema: CourseOutlineSchema,
          strict: true
        }
      },
      temperature: 0.7
    })

    // With structured outputs, the response is guaranteed to match our schema
    return JSON.parse(completion.choices[0].message.content!)
  }

  async generateChapterContent(chapter: Chapter, subject: string, courseContext: CourseOutline, userProfile?: UserProfile): Promise<ChapterContent> {
    const subjectConfig = this.getSubjectConfig(subject)
    const prompt = this.buildContentPrompt(chapter, courseContext, subjectConfig, userProfile)
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert ${subjectConfig.subject} educator. Generate comprehensive, pedagogically sound learning content following subject-specific best practices.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "chapter_content",
          schema: ChapterContentSchema,
          strict: true
        }
      },
      temperature: 0.6
    })

    // With structured outputs, the response is guaranteed to match our schema
    return JSON.parse(completion.choices[0].message.content!)
  }

  private getSubjectConfig(subject: string): SubjectPromptConfig {
    const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '')
    return subjectPrompts[normalizedSubject] || subjectPrompts.mathematics // fallback
  }

  private buildLearnerContext(userProfile?: UserProfile): string {
    if (!userProfile) {
      return ''
    }

    const { demographics, learningPreferences } = userProfile

    const parts: string[] = []

    // Demographics context
    if (demographics.age) {
      parts.push(`Age: ${demographics.age}`)
    }
    parts.push(`Education Level: ${demographics.educationLevel.replace('-', ' ')}`)
    parts.push(`Learning Purpose: ${demographics.learningPurpose}`)

    if (demographics.occupation) {
      parts.push(`Occupation: ${demographics.occupation}`)
    }

    if (demographics.nativeLanguage) {
      parts.push(`Native Language: ${demographics.nativeLanguage}`)
    }

    // Learning preferences context
    parts.push(`Learning Style: ${learningPreferences.learningStyle}`)
    parts.push(`Current Level: ${learningPreferences.difficultyLevel}`)
    parts.push(`Study Time Available: ${learningPreferences.studyTimePerWeek} hours per week`)

    if (learningPreferences.preferredSubjects.length > 0) {
      parts.push(`Interested Subjects: ${learningPreferences.preferredSubjects.join(', ')}`)
    }

    if (learningPreferences.goals.length > 0) {
      parts.push(`Learning Goals: ${learningPreferences.goals.join('; ')}`)
    }

    return `
LEARNER PROFILE:
${parts.join('\n')}

Use this information to:
- Adjust the complexity and depth of explanations to match their education level
- Tailor examples and analogies to their background and occupation
- Format content to suit their learning style (${learningPreferences.learningStyle})
- Align with their learning purpose (${demographics.learningPurpose})
- Consider their available study time when structuring activities
${demographics.nativeLanguage && demographics.nativeLanguage.toLowerCase() !== 'english' ? `- Use clear, simple language where possible since their native language is ${demographics.nativeLanguage}` : ''}
`
  }


  private buildOutlinePrompt(formData: CourseFormData, userProfile?: UserProfile): string {
    const learnerContext = this.buildLearnerContext(userProfile)

    return `
Create a comprehensive course outline for:
- Subject: ${formData.subject}
- Title: ${formData.title}
- Duration: ${formData.duration} weeks
- Description: ${formData.description}

${learnerContext}

Generate a JSON response with this structure:
{
  "title": "Enhanced course title",
  "description": "Detailed course description",
  "learningObjectives": ["objective1", "objective2", ...],
  "prerequisites": ["prereq1", "prereq2", ...],
  "estimatedHours": number,
  "chapters": [
    {
      "title": "Chapter Title",
      "description": "Chapter description",
      "estimatedTime": "2-3 hours",
      "learningGoals": ["goal1", "goal2"],
      "topics": ["topic1", "topic2"]
    }
  ],
  "gamePlan": {
    "weeklySchedule": [
      {
        "week": 1,
        "focus": "Week focus area",
        "chapters": [1, 2],
        "activities": ["activity1", "activity2"]
      }
    ],
    "milestones": [
      {
        "week": 2,
        "title": "Milestone title",
        "description": "What student should achieve",
        "deliverable": "What to submit/complete"
      }
    ],
    "assessmentStrategy": "How progress will be measured"
  }
}

Make it pedagogically sound with proper learning progression.`
  }

  private buildContentPrompt(chapter: Chapter, courseContext: CourseOutline,
    config: SubjectPromptConfig, userProfile?: UserProfile): string {
    const learnerContext = this.buildLearnerContext(userProfile)
    const mathInstructions = config.mathSupport ? `
MATHEMATICAL CONTENT Guidelines:
Use LaTeX notation for ALL mathematical expressions. Use DOUBLE backslashes for proper JSON escaping:

INLINE MATH (use $ delimiters):
- Simple expressions: $x^2 + y^2 = z^2$
- Functions: $\\\\sin(x)$, $\\\\cos(x)$, $\\\\log(x)$  
- Fractions: $\\\\frac{a}{b}$, $\\\\frac{\\\\partial f}{\\\\partial x}$
- Greek letters: $\\\\alpha$, $\\\\beta$, $\\\\gamma$, $\\\\pi$
- Powers and subscripts: $x_1^2$, $e^{-x^2}$

BLOCK MATH (use $$ delimiters):
- Integrals: $$\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}$$
- Summations: $$\\\\sum_{i=1}^n x_i = S$$
- Complex equations: $$f(x) = \\\\frac{1}{\\\\sqrt{2\\\\pi}} e^{-\\\\frac{x^2}{2}}$$

IMPORTANT: Use DOUBLE backslashes in your JSON response for proper escaping:
✅ "The derivative $\\\\frac{df}{dx}$ represents the rate of change"
✅ "Integration by parts: $$\\\\int u dv = uv - \\\\int v du$$"
✅ "Partial derivative: $\\\\frac{\\\\partial f}{\\\\partial x} = \\\\lim_{h \\\\to 0} \\\\frac{f(x+h,y) - f(x,y)}{h}$"

DO NOT write mathematical expressions as plain text:
❌ "frac{a}{b}" or "partial f / partial x" or "alpha + beta"
✅ Always use: "$\\\\frac{a}{b}$" or "$\\\\frac{\\\\partial f}{\\\\partial x}$" or "$\\\\alpha + \\\\beta$"` : ''

    return `
Generate detailed learning content for this ${config.subject} chapter:
- Chapter: ${chapter.title}
- Description: ${chapter.description}
- Learning Goals: ${chapter.learningGoals.join(', ')}
- Course Context: ${courseContext.title}

${learnerContext}

${config.contentGuidelines}

${mathInstructions}

SUBJECT-SPECIFIC INSTRUCTIONS:
${config.specialInstructions.map(instruction => `- ${instruction}`).join('\n')}

EXAMPLE TYPES TO INCLUDE:
${config.exampleTypes.map(type => `- ${type}`).join('\n')}

ASSESSMENT FOCUS AREAS:
${config.assessmentFocus.map(focus => `- ${focus}`).join('\n')}

Create comprehensive content including:
1. Detailed explanations with subject-appropriate examples
2. Interactive exercises matching ${config.subject} pedagogy
3. Practice problems with step-by-step solutions
4. Key takeaways relevant to ${config.subject}
5. Further reading suggestions

Return JSON with this structure:
{
  "content": {
    "introduction": "Chapter introduction with subject-appropriate tone and content",
    "sections": [
      {
        "title": "Section title",
        "content": "Detailed explanation following ${config.subject} best practices",
        "examples": ["Subject-appropriate examples", "Another example"],
        "keyPoints": ["Key points relevant to ${config.subject}", "Another point"]
      }
    ],
    "exercises": [
      {
        "type": "practice",
        "question": "Exercise question appropriate for ${config.subject}",
        "solution": "Solution with subject-specific methodology",
        "difficulty": "easy|medium|hard"
      }
    ],
    "summary": "Chapter summary emphasizing ${config.subject} key concepts",
    "nextSteps": "Next steps in ${config.subject} learning progression"
  },
  "flashcards": [
    {
      "front": "${config.subject} question or concept",
      "back": "Answer with subject-appropriate explanation"
    }
  ],
  "quiz": [
    {
      "question": "Quiz question following ${config.subject} assessment practices",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Explanation using ${config.subject} reasoning"
    }
  ]
}

Remember: Accuracy and pedagogical soundness are crucial for ${config.subject} education.
`
  }

}

export const aiCourseService = new AICourseService()
