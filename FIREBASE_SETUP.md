# Firebase Database Setup Guide

## Required Changes for Production

### 1. Update Firestore Security Rules

Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Firestore Database → Rules

Replace the default rules with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }

    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId) &&
        // Ensure users can't change their UID
        request.resource.data.uid == userId &&
        // Validate required fields exist
        request.resource.data.keys().hasAll(['uid', 'email', 'displayName', 'demographics', 'learningPreferences', 'subscriptionTier', 'courses']);
      allow delete: if isOwner(userId);
    }

    // Courses collection
    match /courses/{courseId} {
      // Get course owner
      function getCourseOwner() {
        return get(/databases/$(database)/documents/courses/$(courseId)).data.uid;
      }

      // Check if course is public
      function isPublicCourse() {
        return get(/databases/$(database)/documents/courses/$(courseId)).data.visibility == 'public';
      }

      // Allow read if user owns the course or it's public
      allow read: if isSignedIn() && (
        resource.data.uid == request.auth.uid ||
        resource.data.visibility == 'public'
      );

      // Only allow create if user owns the course
      allow create: if isSignedIn() &&
        request.resource.data.uid == request.auth.uid &&
        // Validate required fields
        request.resource.data.keys().hasAll(['uid', 'title', 'subject', 'visibility', 'duration', 'createdAt', 'updatedAt', 'chapterCount']);

      // Only allow update/delete if user owns the course
      allow update, delete: if isSignedIn() && resource.data.uid == request.auth.uid;

      // Subcollection: course metadata
      match /meta/{document} {
        allow read: if isSignedIn() && (
          getCourseOwner() == request.auth.uid ||
          isPublicCourse()
        );
        allow write: if isSignedIn() && getCourseOwner() == request.auth.uid;
      }

      // Subcollection: chapters
      match /chapters/{chapterId} {
        allow read: if isSignedIn() && (
          getCourseOwner() == request.auth.uid ||
          isPublicCourse()
        );
        allow write: if isSignedIn() && getCourseOwner() == request.auth.uid;
      }
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Click "Publish" to apply the rules.**

---

### 2. Existing User Migration

Your existing users need the new `demographics` field. This happens automatically on next login, but you can also migrate manually:

#### Option A: Automatic (Recommended)
✅ Already implemented in `AuthContext.tsx` - users get demographics added on next login

#### Option B: Manual Migration
If you want to migrate all users immediately:

1. **Open Firestore Database in Firebase Console**
2. **Go to `users` collection**
3. **For each user document:**
   - Click the document
   - Click "Edit" (pencil icon)
   - Add field: `demographics` (type: `map`)
   - Add these sub-fields:
     - `educationLevel`: `"self-learner"` (string)
     - `learningPurpose`: `"personal"` (string)
   - Save

Or use the migration script from `scripts/migrate-user-demographics.ts`

---

### 3. Database Indexes (Optional but Recommended)

For better query performance, create these composite indexes:

Go to: Firestore Database → Indexes → Composite

#### Index 1: User Courses Query
- Collection: `courses`
- Fields to index:
  - `uid` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

#### Index 2: Public Courses (Future Feature)
- Collection: `courses`
- Fields to index:
  - `visibility` (Ascending)
  - `createdAt` (Descending)
- Query scope: Collection

**Note**: Firebase will suggest creating these indexes when you first run the queries. You can create them then.

---

### 4. Firebase Authentication Settings

#### Enable Authentication Methods:

1. **Go to**: Authentication → Sign-in method
2. **Enable**:
   - ✅ Email/Password
   - ✅ Google

#### Add Authorized Domains:

1. **Go to**: Authentication → Settings → Authorized domains
2. **Add**:
   - `localhost` (for development) ✅ Already there
   - Your Vercel domain: `your-app.vercel.app`
   - Your custom domain (if you have one)

---

### 5. API Key Restrictions (Important for Security)

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Select your Firebase project**
3. **Go to**: APIs & Services → Credentials
4. **Find your Firebase API key** (Browser key)
5. **Click Edit**
6. **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add:
     - `http://localhost:5173/*` (dev)
     - `https://your-app.vercel.app/*` (production)
     - Your custom domain if you have one
7. **API restrictions**:
   - Select "Restrict key"
   - Enable only:
     - Identity Toolkit API
     - Cloud Firestore API
     - Token Service API
8. **Save**

---

### 6. Database Structure Overview

Your Firestore should have this structure:

```
firestore/
├── users/
│   └── {userId}/
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string (optional)
│       ├── demographics: {
│       │   ├── age: number (optional)
│       │   ├── educationLevel: string
│       │   ├── occupation: string (optional)
│       │   ├── location: string (optional)
│       │   ├── nativeLanguage: string (optional)
│       │   └── learningPurpose: string
│       │   }
│       ├── learningPreferences: {
│       │   ├── preferredSubjects: string[]
│       │   ├── learningStyle: string
│       │   ├── difficultyLevel: string
│       │   ├── studyTimePerWeek: number
│       │   └── goals: string[]
│       │   }
│       ├── subscriptionTier: string
│       ├── createdAt: timestamp
│       ├── lastLoginAt: timestamp
│       └── courses: array (CourseMetadata[])
│
└── courses/
    └── {courseId}/
        ├── uid: string
        ├── title: string
        ├── subject: string
        ├── visibility: string
        ├── duration: number
        ├── createdAt: timestamp
        ├── updatedAt: timestamp
        ├── chapterCount: number
        ├── meta/
        │   └── outline/
        │       └── (CourseOutline data)
        └── chapters/
            └── {chapterIndex}/
                ├── chapterData: object
                ├── content: object (optional)
                ├── flashcards: array (optional)
                ├── quiz: array (optional)
                └── metadata: object
```

---

### 7. Testing Your Setup

After making these changes, test:

1. **User Registration**: Create a new account
2. **User Login**: Login with existing account
3. **Profile Page**: Check demographics display
4. **Settings Page**: Update preferences
5. **Course Creation**: Create a new course
6. **Course Viewing**: View course content
7. **Search**: Test search functionality

Check the browser console for any permission errors.

---

### 8. Monitoring and Quotas

#### Check Usage:

1. **Go to**: Firestore Database → Usage
2. **Monitor**:
   - Document reads/writes
   - Storage used
   - Network egress

#### Free Tier Limits:
- 50K reads/day
- 20K writes/day
- 1 GB storage
- 10 GB/month network egress

Set up billing alerts in Firebase Console → Project Settings → Usage and billing

---

## Common Issues

### "Missing or insufficient permissions"
- **Fix**: Check Firestore security rules are published
- Verify user is authenticated
- Check browser console for specific error

### "PERMISSION_DENIED" on course access
- **Fix**: Verify course `uid` matches current user
- Or course `visibility` is set to `'public'`

### Demographics undefined error
- **Fix**: User needs to login/logout once
- Or run migration script
- Already auto-fixed in AuthContext

---

## Quick Checklist

Before deploying:

- [ ] Firestore security rules updated and published
- [ ] Email/Password authentication enabled
- [ ] Google authentication enabled
- [ ] Authorized domains added (including Vercel URL)
- [ ] API key restrictions configured
- [ ] Existing users migrated (or will auto-migrate on login)
- [ ] Tested all authentication flows
- [ ] Tested course creation and viewing
- [ ] Checked Firestore usage dashboard

---

## Need Help?

- Firebase Docs: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Error in Console? Check: Authentication → Users and Firestore → Data

Your database is now ready for production! 🎉
