import { auth, googleProvider, firebaseConfigured } from '../config/firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    if (!firebaseConfigured || !auth) {
      setError('Google login is not set up yet. Please contact the site administrator to configure Firebase.')
      return
    }
    try {
      setError('')
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      localStorage.setItem('token', token)
      localStorage.setItem('username', result.user.displayName || 'User')
      localStorage.setItem('photo', result.user.photoURL || '')
      await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      navigate('/main')
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.')
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site.')
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('')
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorised in Firebase. Add it to the Authorised Domains list in Firebase Console.')
      } else {
        setError('Google login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async () => {
    if (!firebaseConfigured || !auth) {
      setError('Authentication is not configured yet.')
      return
    }
    try {
      setError('')
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      const token = await result.user.getIdToken()
      localStorage.setItem('token', token)
      localStorage.setItem('username', result.user.displayName || 'User')
      localStorage.setItem('photo', result.user.photoURL || '')
      await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      navigate('/main')
    } catch (err) {
      if (err.code === 'auth/invalid-email')       setError('Please enter a valid email address.')
      else if (err.code === 'auth/user-not-found') setError('No account found with this email.')
      else if (err.code === 'auth/wrong-password') setError('Incorrect password.')
      else if (err.code === 'auth/invalid-credential') setError('Invalid email or password. Please try again.')
      else if (err.code === 'auth/too-many-requests') setError('Too many attempts. Please try again later.')
      else setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page home">
      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-logo">🛡️</div>
          <h2>Welcome Back</h2>
          <p className="auth-sub">Sign in to continue your training</p>

          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div className="auth-divider"><span>or sign in with email</span></div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            onKeyDown={e => e.key === 'Enter' && handleEmailLogin()}
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-submit-btn"
            onClick={handleEmailLogin}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
