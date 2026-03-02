import { auth, googleProvider } from '../../config/firebase'
import { signInWithPopup } from 'firebase/auth'

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      console.log('Token:', token)
      console.log('User email:', result.user.email)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button onClick={handleGoogleLogin}>Sign in with Google</button>
  )
}