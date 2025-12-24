// src/services/courseService.ts
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { 
  Course, 
  CourseOutline, 
  Chapter, 
  ChapterContent 
} from './aiCourseService'

export interface CourseMetadata {
  id: string
  uid: string
  title: string
  subject: string
  visibility: 'private' | 'public' | 'shared'
  duration: number
  createdAt: Timestamp
  updatedAt: Timestamp
  chapterCount: number
}



export interface ChapterDocument {
  chapterData: Chapter
  content?: ChapterContent['content']
  flashcards?: ChapterContent['flashcards']
  quiz?: ChapterContent['quiz']
  metadata: {
    generatedAt?: Timestamp
    lastUpdated?: Timestamp
    isGenerated: boolean
    lastContentUpdate?: Timestamp
  }
}

class CourseService {
  // Create a new course with metadata and outline
  async createCourse(
    uid: string, 
    courseOutline: CourseOutline, 
    subject: string, 
    visibility: 'private' | 'public' | 'shared',
    duration: number
  ): Promise<string> {
    const now = Timestamp.now()
    
    // Create main course document
    const courseRef = await addDoc(collection(db, 'courses'), {
      uid,
      title: courseOutline.title,
      subject,
      visibility,
      duration,
      createdAt: now,
      updatedAt: now,
      chapterCount: courseOutline.chapters.length
    })
    
    // Create outline document
    await setDoc(doc(db, 'courses', courseRef.id, 'meta', 'outline'), courseOutline)
    
    // Create chapter documents (without content initially)
    const chapterPromises = courseOutline.chapters.map(async (chapter, index) => {
      const chapterDoc: ChapterDocument = {
        chapterData: { ...chapter, id: index },
        metadata: {
          isGenerated: false
        }
      }
      return setDoc(doc(db, 'courses', courseRef.id, 'chapters', index.toString()), chapterDoc)
    })
    
    await Promise.all(chapterPromises)
    return courseRef.id
  }

  // Get course metadata
  async getCourseMetadata(courseId: string): Promise<CourseMetadata | null> {
    const docSnap = await getDoc(doc(db, 'courses', courseId))
    if (!docSnap.exists()) return null
    
    return {
      id: courseId,
      ...docSnap.data()
    } as CourseMetadata
  }

  // Get course outline
  async getCourseOutline(courseId: string): Promise<CourseOutline | null> {
    const docSnap = await getDoc(doc(db, 'courses', courseId, 'meta', 'outline'))
    if (!docSnap.exists()) return null
    return docSnap.data() as CourseOutline
  }

  // Get all course data (metadata + outline + basic chapter info)
  async getFullCourse(courseId: string): Promise<Course | null> {
    const [metadata, outline] = await Promise.all([
      this.getCourseMetadata(courseId),
      this.getCourseOutline(courseId)
    ])
    
    if (!metadata || !outline) return null
    
    // Get basic chapter data (without content)
    const chaptersSnapshot = await getDocs(collection(db, 'courses', courseId, 'chapters'))
    const chapters: Chapter[] = []
    
    chaptersSnapshot.docs.forEach(doc => {
      const data = doc.data() as ChapterDocument
      chapters[parseInt(doc.id)] = {
        ...data.chapterData,
        hasContent: data.metadata.isGenerated
      }
    })
    
    return {
      id: courseId,
      uid: metadata.uid,
      subject: metadata.subject,
      visibility: metadata.visibility,
      duration: metadata.duration,
      outline,
      contents: [] // Contents loaded separately as needed
    }
  }

  // Get individual chapter content
  async getChapterContent(courseId: string, chapterIndex: number): Promise<ChapterContent | null> {
    const docSnap = await getDoc(doc(db, 'courses', courseId, 'chapters', chapterIndex.toString()))
    if (!docSnap.exists()) return null
    
    const data = docSnap.data() as ChapterDocument
    if (!data.content || !data.flashcards || !data.quiz) return null
    
    return {
      id: chapterIndex,
      content: data.content,
      flashcards: data.flashcards,
      quiz: data.quiz
    }
  }

  // Update individual chapter content
  async updateChapterContent(
    courseId: string, 
    chapterIndex: number, 
    chapterContent: ChapterContent
  ): Promise<void> {
    const now = Timestamp.now()
    const chapterRef = doc(db, 'courses', courseId, 'chapters', chapterIndex.toString())
    
    await updateDoc(chapterRef, {
      content: chapterContent.content,
      flashcards: chapterContent.flashcards,
      quiz: chapterContent.quiz,
      'metadata.isGenerated': true,
      'metadata.generatedAt': now,
      'metadata.lastUpdated': now
    })
    
    // Update course metadata
    await updateDoc(doc(db, 'courses', courseId), {
      updatedAt: now
    })
  }

  // Check if chapter has content
  async hasChapterContent(courseId: string, chapterIndex: number): Promise<boolean> {
    const docSnap = await getDoc(doc(db, 'courses', courseId, 'chapters', chapterIndex.toString()))
    if (!docSnap.exists()) return false
    
    const data = docSnap.data() as ChapterDocument
    return data.metadata.isGenerated
  }

  // Get user's courses (metadata only)
  async getUserCourses(uid: string): Promise<CourseMetadata[]> {
    const q = query(collection(db, 'courses'), where('uid', '==', uid))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as CourseMetadata)
  }

  // Delete course and all its subcollections
  async deleteCourse(courseId: string, onCourseDeleted?: (courseId: string) => Promise<void>): Promise<void> {
    // Delete all chapters
    const chaptersSnapshot = await getDocs(collection(db, 'courses', courseId, 'chapters'))
    const deleteChapterPromises = chaptersSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    )
    await Promise.all(deleteChapterPromises)
    
    // Delete outline
    await deleteDoc(doc(db, 'courses', courseId, 'meta', 'outline'))
    
    // Delete main course document
    await deleteDoc(doc(db, 'courses', courseId))
    
    // Call callback to update user profile
    if (onCourseDeleted) {
      await onCourseDeleted(courseId)
    }
  }

  // Update course metadata
  async updateCourseMetadata(
    courseId: string, 
    updates: Partial<Pick<CourseMetadata, 'title' | 'visibility' | 'duration'>>
  ): Promise<void> {
    await updateDoc(doc(db, 'courses', courseId), {
      ...updates,
      updatedAt: Timestamp.now()
    })
  }

  // Batch generate content for multiple chapters
  async batchUpdateChapters(
    courseId: string, 
    chapterContents: Array<{ index: number; content: ChapterContent }>
  ): Promise<void> {
    const now = Timestamp.now()
    
    const updatePromises = chapterContents.map(({ index, content }) => {
      const chapterRef = doc(db, 'courses', courseId, 'chapters', index.toString())
      return updateDoc(chapterRef, {
        content: content.content,
        flashcards: content.flashcards,
        quiz: content.quiz,
        'metadata.isGenerated': true,
        'metadata.generatedAt': now,
        'metadata.lastUpdated': now
      })
    })
    
    // Update course metadata
    const courseUpdatePromise = updateDoc(doc(db, 'courses', courseId), {
      updatedAt: now
    })
    
    await Promise.all([...updatePromises, courseUpdatePromise])
  }

  // Get chapter progress (which chapters have content)
  async getChapterProgress(courseId: string): Promise<{ [chapterIndex: number]: boolean }> {
    const chaptersSnapshot = await getDocs(collection(db, 'courses', courseId, 'chapters'))
    const progress: { [chapterIndex: number]: boolean } = {}
    
    chaptersSnapshot.docs.forEach(doc => {
      const data = doc.data() as ChapterDocument
      progress[parseInt(doc.id)] = data.metadata.isGenerated
    })
    
    return progress
  }

  // Batch get chapter progress for multiple courses
  async getBatchChapterProgress(courseIds: string[]): Promise<{ [courseId: string]: { [chapterIndex: number]: boolean } }> {
    const progressBatch = await Promise.all(
      courseIds.map(async (courseId) => {
        const progress = await this.getChapterProgress(courseId)
        return { courseId, progress }
      })
    )
    
    return progressBatch.reduce((acc, { courseId, progress }) => {
      acc[courseId] = progress
      return acc
    }, {} as { [courseId: string]: { [chapterIndex: number]: boolean } })
  }

  // Get basic chapter info (without content) for React Query optimization
  async getChapterInfo(courseId: string, chapterIndex: number): Promise<{ chapter: Chapter; hasContent: boolean } | null> {
    const docSnap = await getDoc(doc(db, 'courses', courseId, 'chapters', chapterIndex.toString()))
    if (!docSnap.exists()) return null
    
    const data = docSnap.data() as ChapterDocument
    return {
      chapter: { ...data.chapterData, hasContent: data.metadata.isGenerated },
      hasContent: data.metadata.isGenerated
    }
  }

  // Prefetch multiple chapters (for background loading)
  async prefetchChapters(courseId: string, chapterIndices: number[]): Promise<(ChapterContent | null)[]> {
    const promises = chapterIndices.map(index => this.getChapterContent(courseId, index))
    return Promise.all(promises)
  }

}

export const courseService = new CourseService()