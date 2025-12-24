# Quick Fix for Demographics Error

You're seeing this error because existing users don't have the `demographics` field yet.

## Quick Solution (2 minutes)

### Option 1: Browser Console (Easiest - Do this now!)

1. **Open your app** in the browser and **login**
2. **Open Developer Console** (Press F12 or Right-click → Inspect → Console tab)
3. **Copy and paste** this code into the console:

```javascript
(async () => {
  const { getAuth } = await import('firebase/auth');
  const { getFirestore, doc, updateDoc } = await import('firebase/firestore');

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    alert('Please login first!');
    return;
  }

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    demographics: {
      educationLevel: 'self-learner',
      learningPurpose: 'personal'
    }
  });

  alert('✅ Fixed! Refresh the page.');
  location.reload();
})();
```

4. **Press Enter** and wait for the success message
5. **Refresh the page**

✅ Done! The profile page should now work.

---

### Option 2: Manual Fix in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Find the `users` collection
5. Click on your user document (your user ID)
6. Click **Edit** (pencil icon)
7. Add a new field:
   - Field: `demographics`
   - Type: `map`
   - Value:
     ```
     educationLevel: "self-learner"
     learningPurpose: "personal"
     ```
8. **Save**
9. Refresh your app

---

### Option 3: The Code Fix (Already Done!)

I've already updated the Profile component to handle missing demographics gracefully. The error won't occur anymore for future logins. But existing users need their data migrated using Option 1 or 2 above.

---

## Why This Happened

When we added the new demographics feature, existing users in the database didn't have this field yet. The Profile component was trying to access `userProfile.demographics.age`, but `demographics` was `undefined`.

## Prevention

The code now:
1. ✅ Checks if `demographics` exists
2. ✅ Provides default values if missing
3. ✅ Won't crash if the field is undefined

New users will automatically get the demographics field when they sign up.

---

## For All Existing Users (Migration Script)

If you have multiple existing users, you can run the migration script:

```bash
# Install ts-node if you don't have it
npm install -g ts-node

# Run the migration script
ts-node scripts/migrate-user-demographics.ts
```

Or use the browser script in `scripts/browser-migration.js` for each user.
