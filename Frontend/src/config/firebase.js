import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const apiKey     = import.meta.env.VITE_FIREBASE_API_KEY
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const projectId  = import.meta.env.VITE_FIREBASE_PROJECT_ID

export const firebaseConfigured = Boolean(apiKey && authDomain && projectId)

let auth = null
let googleProvider = null

if (firebaseConfigured) {
  try {
    const app = getApps().length
      ? getApps()[0]
      : initializeApp({ apiKey, authDomain, projectId })
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
  } catch (e) {
    console.warn('Firebase failed to initialize:', e.message)
  }
} else {
  console.warn(
    'Firebase is not configured. Set VITE_FIREBASE_API_KEY, ' +
    'VITE_FIREBASE_AUTH_DOMAIN, and VITE_FIREBASE_PROJECT_ID.'
  )
}

export { auth, googleProvider }
