/**
 * Browser Console Migration Script
 * Run this directly in your browser console while logged into your app
 *
 * Instructions:
 * 1. Open your app in the browser
 * 2. Login with your account
 * 3. Open browser console (F12 or right-click > Inspect > Console)
 * 4. Copy and paste this entire script
 * 5. Press Enter
 */

async function migrateCurrentUserDemographics() {
  console.log('🔧 Starting user demographics migration...')

  try {
    // Get Firebase from window (should be available after app loads)
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js')
    const { getFirestore, doc, getDoc, updateDoc } = await import('https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js')

    const auth = getAuth()
    const db = getFirestore()
    const currentUser = auth.currentUser

    if (!currentUser) {
      console.error('❌ No user logged in. Please login first.')
      return
    }

    console.log(`👤 Current user: ${currentUser.email}`)

    // Get user document
    const userRef = doc(db, 'users', currentUser.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      console.error('❌ User document not found')
      return
    }

    const userData = userDoc.data()

    // Check if demographics already exists
    if (userData.demographics) {
      console.log('✅ User already has demographics field:')
      console.log(userData.demographics)
      console.log('No migration needed!')
      return
    }

    // Add default demographics
    const defaultDemographics = {
      educationLevel: 'self-learner',
      learningPurpose: 'personal'
    }

    console.log('📝 Adding demographics field...')
    await updateDoc(userRef, {
      demographics: defaultDemographics
    })

    console.log('✅ Migration successful!')
    console.log('Demographics added:', defaultDemographics)
    console.log('🔄 Please refresh the page to see the changes.')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.error('Error details:', error.message)
  }
}

// Run the migration
migrateCurrentUserDemographics()
