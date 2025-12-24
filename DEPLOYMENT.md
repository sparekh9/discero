# Deployment Guide for L2L Platform

This guide will help you deploy your L2L (Learn-to-Learn) platform to production in 2 days.

## Pre-Deployment Checklist

### 1. Environment Variables Setup

Make sure your `.env` file is properly configured with all required keys:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_actual_openai_api_key
```

**Important**: Never commit the `.env` file to version control. It's already in `.gitignore`.

### 2. Test Local Build

Before deploying, test that your production build works locally:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` and test all features:
- ✅ User authentication (sign up, login, logout)
- ✅ Profile and Settings pages
- ✅ Course creation with AI
- ✅ Course viewing and navigation
- ✅ Chapter content generation
- ✅ Search functionality
- ✅ Flashcards and quizzes

### 3. Firebase Security Rules

Before going live, update your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Courses collection
    match /courses/{courseId} {
      // Allow read if user owns the course or it's public
      allow read: if request.auth != null && (
        resource.data.uid == request.auth.uid ||
        resource.data.visibility == 'public'
      );

      // Only allow create/update/delete if user owns the course
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;

      // Subcollections (chapters, meta)
      match /{document=**} {
        allow read: if request.auth != null && (
          get(/databases/$(database)/documents/courses/$(courseId)).data.uid == request.auth.uid ||
          get(/databases/$(database)/documents/courses/$(courseId)).data.visibility == 'public'
        );
        allow write: if request.auth != null &&
          get(/databases/$(database)/documents/courses/$(courseId)).data.uid == request.auth.uid;
      }
    }
  }
}
```

---

## Deployment Option 1: Firebase Hosting (Recommended)

Firebase Hosting is the easiest option since you're already using Firebase for auth and database.

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Firebase Hosting

```bash
firebase init hosting
```

When prompted:
- **Select your Firebase project** (the one you're using for auth/firestore)
- **Public directory**: `dist`
- **Configure as single-page app**: `Yes`
- **Set up automatic builds with GitHub**: `No` (for now)
- **Overwrite index.html**: `No`

### Step 4: Build and Deploy

```bash
# Build production version
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

Your site will be live at: `https://your-project-id.web.app`

### Step 5: Set Up Environment Variables (Production)

For production environment variables, you have two options:

**Option A**: Build with production .env locally
1. Create `.env.production` with your production API keys
2. Vite will automatically use it during build

**Option B**: Use Firebase Functions for API keys (More secure)
- Move OpenAI API calls to Firebase Functions
- This keeps your API key server-side

### Step 6: Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow instructions to add DNS records
4. Firebase provides free SSL certificates

---

## Deployment Option 2: Vercel

Vercel provides excellent performance and developer experience.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# For production deployment
vercel --prod
```

### Step 3: Set Environment Variables

In Vercel Dashboard:
1. Go to your project > Settings > Environment Variables
2. Add all variables from your `.env` file
3. Make sure to select "Production" environment
4. Redeploy to apply changes

---

## Deployment Option 3: Netlify

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Deploy

```bash
# Login to Netlify
netlify login

# Initialize and deploy
netlify init

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Step 3: Configure Environment Variables

In Netlify Dashboard:
1. Site settings > Environment variables
2. Add all your env variables
3. Rebuild the site

---

## Post-Deployment Tasks

### 1. API Key Security

**Firebase API Key Restrictions**:
1. Go to Google Cloud Console
2. Credentials > API Keys
3. Restrict your Firebase API key to your domain only

**OpenAI API Key**:
1. Set usage limits in OpenAI Dashboard
2. Enable rate limiting
3. Consider moving to server-side (Firebase Functions)

### 2. Analytics Setup

Firebase Analytics is already initialized. View your analytics:
- Firebase Console > Analytics

### 3. Monitoring

Set up alerts for:
- API quota limits
- Error rates
- User authentication issues

### 4. Backup Strategy

- Firestore has automatic backups
- Export user data regularly
- Version control your codebase

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Make sure variables start with `VITE_`
- Rebuild after changing env variables
- For hosting platforms, set env vars in dashboard

### Firebase Errors

- Check Firebase console for quota limits
- Verify security rules
- Check browser console for specific errors

### OpenAI API Errors

- Verify API key is valid
- Check usage limits and billing
- Handle rate limits with retries

---

## Cost Considerations

### Free Tiers:

**Firebase Hosting**:
- 10GB storage
- 360MB/day bandwidth
- Free SSL

**Firebase Firestore**:
- 1GB storage
- 50K reads/day
- 20K writes/day

**Firebase Authentication**:
- Unlimited users (email/password & Google)

**OpenAI API**:
- Pay per use
- ~$0.002 per request (gpt-4o-mini)
- Set monthly budget limits

### When You Need to Upgrade:

- Firebase: When exceeding free tier limits
- OpenAI: Monitor usage in dashboard, set alerts

---

## Performance Optimization

### Before Launch:

1. **Image Optimization**: Compress any images
2. **Code Splitting**: Already handled by Vite
3. **Caching**: Firebase Hosting has automatic CDN caching
4. **Bundle Analysis**:
   ```bash
   npm run build -- --mode production
   ```

### After Launch:

- Monitor Core Web Vitals
- Use Lighthouse for performance audits
- Enable compression in hosting

---

## Recommended 2-Day Timeline

### Day 1 Morning:
- ✅ Complete Profile & Settings pages (DONE)
- ✅ Implement search functionality (DONE)
- ✅ Test all features locally

### Day 1 Afternoon:
- Update Firebase security rules
- Test production build locally
- Fix any build errors

### Day 2 Morning:
- Set up Firebase Hosting
- Deploy to staging environment
- Test on deployed site

### Day 2 Afternoon:
- Deploy to production
- Set up custom domain (optional)
- Configure monitoring and alerts
- Final testing

---

## Quick Deploy Command Reference

```bash
# Firebase Hosting
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting

# Vercel
vercel login
vercel --prod

# Netlify
netlify login
netlify init
npm run build
netlify deploy --prod --dir=dist
```

---

## Support Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **OpenAI API**: https://platform.openai.com/docs
- **React Router**: https://reactrouter.com/

---

## Next Steps After Launch

1. Set up CI/CD with GitHub Actions
2. Implement error tracking (Sentry)
3. Add user feedback mechanism
4. Plan feature roadmap
5. Monitor and iterate based on usage

Good luck with your launch! 🚀
