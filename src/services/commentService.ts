// src/services/commentService.ts
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface CommentPosition {
  // Document-level positioning (more robust for multi-section selections)
  startOffset: number         // Character offset from beginning of all content
  endOffset: number           // End character offset from beginning of all content

  // Context for fuzzy matching (helps relocate text if content changes slightly)
  textBefore: string          // 100 chars before selection
  textAfter: string           // 100 chars after selection
}

export interface CommentDocument {
  id: string
  userId: string
  commentText: string
  selectedText: string
  createdAt: Timestamp
  updatedAt: Timestamp
  position: CommentPosition
  highlightId: string         // For managing DOM highlights
}

class CommentService {
  // Save a new comment
  async saveComment(
    courseId: string,
    chapterIndex: number,
    userId: string,
    commentText: string,
    selectedText: string,
    position: CommentPosition,
    highlightId: string
  ): Promise<string> {
    const now = Timestamp.now()

    // Prepare position data, omitting undefined fields for Firestore
    const positionData: Record<string, string | number> = {
      textBefore: position.textBefore,
      textAfter: position.textAfter,
      startOffset: position.startOffset,
      endOffset: position.endOffset
    }

    const commentRef = await addDoc(
      collection(db, 'courses', courseId, 'chapters', chapterIndex.toString(), 'comments'),
      {
        userId,
        commentText,
        selectedText,
        position: positionData,
        highlightId,
        createdAt: now,
        updatedAt: now
      }
    )

    return commentRef.id
  }

  // Get all comments for a chapter
  async getChapterComments(
    courseId: string,
    chapterIndex: number,
    userId: string
  ): Promise<CommentDocument[]> {
    const q = query(
      collection(db, 'courses', courseId, 'chapters', chapterIndex.toString(), 'comments'),
      where('userId', '==', userId)
    )

    const querySnapshot = await getDocs(q)

    const comments = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as CommentDocument)

    // Sort by creation time client-side to avoid needing a Firestore composite index
    return comments.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0
      const bTime = b.createdAt?.toMillis?.() || 0
      return aTime - bTime
    })
  }

  // Update a comment's text
  async updateComment(
    courseId: string,
    chapterIndex: number,
    commentId: string,
    commentText: string
  ): Promise<void> {
    const commentRef = doc(
      db,
      'courses',
      courseId,
      'chapters',
      chapterIndex.toString(),
      'comments',
      commentId
    )

    await updateDoc(commentRef, {
      commentText,
      updatedAt: Timestamp.now()
    })
  }

  // Delete a comment
  async deleteComment(
    courseId: string,
    chapterIndex: number,
    commentId: string
  ): Promise<void> {
    const commentRef = doc(
      db,
      'courses',
      courseId,
      'chapters',
      chapterIndex.toString(),
      'comments',
      commentId
    )

    await deleteDoc(commentRef)
  }

  // Get a single comment
  async getComment(
    courseId: string,
    chapterIndex: number,
    commentId: string
  ): Promise<CommentDocument | null> {
    const commentRef = doc(
      db,
      'courses',
      courseId,
      'chapters',
      chapterIndex.toString(),
      'comments',
      commentId
    )

    const docSnap = await getDoc(commentRef)

    if (!docSnap.exists()) return null

    return {
      id: docSnap.id,
      ...docSnap.data()
    } as CommentDocument
  }
}

export const commentService = new CommentService()
