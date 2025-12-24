// scripts/migrate-user-demographics.ts
// This script adds the demographics field to existing users who don't have it

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'

// Firebase configuration - update with your actual config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const defaultDemographics = {
  educationLevel: 'self-learner',
  learningPurpose: 'personal'
}

async function migrateUserDemographics() {
  try {
    console.log('Starting user demographics migration...')

    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)

    let updated = 0
    let skipped = 0

    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data()

      // Check if user already has demographics
      if (userData.demographics) {
        console.log(`User ${userDoc.id} already has demographics, skipping...`)
        skipped++
        continue
      }

      // Add demographics field
      const userRef = doc(db, 'users', userDoc.id)
      await updateDoc(userRef, {
        demographics: defaultDemographics
      })

      console.log(`✓ Updated user ${userDoc.id}`)
      updated++
    }

    console.log('\n=== Migration Complete ===')
    console.log(`Total users: ${snapshot.docs.length}`)
    console.log(`Updated: ${updated}`)
    console.log(`Skipped: ${skipped}`)

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run the migration
migrateUserDemographics()
  .then(() => {
    console.log('\nMigration finished successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Migration error:', error)
    process.exit(1)
  })
