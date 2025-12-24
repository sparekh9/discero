# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Vite HMR
- `npm run build` - Build production version (TypeScript check + Vite build)
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

### Testing
- No test framework configured yet

## Architecture Overview

This is a React + TypeScript educational platform called "l2l" (learn-to-learn) built with Vite. The application enables users to create and learn from AI-generated courses with interactive content.

### Core Technologies
- **Frontend**: React 19, TypeScript, TailwindCSS v4, React Router v7
- **Backend Services**: Firebase (Auth + Firestore), OpenAI API
- **Build Tool**: Vite with React plugin
- **Math Rendering**: KaTeX for LaTeX expressions

### Key Architecture Components

#### Authentication & User Management
- Firebase Authentication with email/password and Google OAuth
- `AuthContext` provides user state and profile management throughout app
- User profiles stored in Firestore with learning preferences and subscription tiers
- Protected routes using `ProtectedRoute` component

#### Course Generation System
- **AI Course Service** (`src/services/aiCourseService.ts`): Core service using OpenAI GPT-4o-mini
- **Subject-Specific Prompts** (`src/services/promptTemplate.ts`): Customized prompts for different subjects
- **Course Structure**: Hierarchical (Course → Chapters → Content with exercises/flashcards/quizzes)
- **Math Support**: LaTeX expressions with specific escaping rules for JSON responses

#### Component Structure
```
src/
├── contexts/           # React contexts (AuthContext)
├── lib/               # Configuration (Firebase setup)
├── services/          # API services (AI course generation)
├── components/
    ├── auth/          # Authentication components
    ├── dashboard/     # Main dashboard and course management
    │   └── courses/   # Course display and creation components
    └── [other UI components]
```

#### Route Structure
- Public routes: `/` (home), `/login`, `/signup`
- Protected dashboard at `/dashboard/*` with nested routes:
  - `/dashboard` - Dashboard home
  - `/dashboard/courses` - Course list
  - `/dashboard/create-course` - Course creation form
  - `/dashboard/courses/:courseId` - Individual course view
  - `/dashboard/courses/:courseId/chapter/:chapterId` - Chapter content

### Data Models

#### Course Data Flow
1. User fills course creation form (`CourseFormData`)
2. AI generates course outline (`CourseOutline`) with chapters and game plan
3. Individual chapter content generated on-demand (`ChapterContent`)
4. Content includes structured learning materials, flashcards, and quizzes

#### Key Interfaces
- `Course`: Main course entity with metadata and contents
- `CourseOutline`: AI-generated course structure with chapters and learning plan
- `Chapter`: Individual course sections with learning goals and topics  
- `ChapterContent`: Detailed content including exercises, flashcards, and quizzes
- `UserProfile`: User data with learning preferences and subscription info

### Environment Configuration
- Firebase config in `src/lib/firebase.ts` (currently hardcoded, should use env vars)
- OpenAI API key in `aiCourseService.ts` (currently hardcoded, should use env vars)
- Environment file template: `discere.env`

### Development Notes
- Uses Firebase v11 modular SDK
- TailwindCSS v4 configured via Vite plugin
- TypeScript with strict configuration
- ESLint with React and TypeScript rules
- LaTeX math rendering requires careful escaping in AI-generated JSON responses