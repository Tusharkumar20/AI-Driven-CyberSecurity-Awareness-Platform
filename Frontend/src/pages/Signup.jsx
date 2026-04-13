import { auth, googleProvider, firebaseConfigured } from '../config/firebase'
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const DEMO_MODE = !firebaseConfigured

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPw, setShowPw]     = useState(false)

  const handleGoogleSignup = async () => {
    if (!firebaseConfigured || !auth) { setError('Google sign-up is not configured yet.'); return }
    try {
      setError(''); setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      localStorage.setItem('token', token)
      localStorage.setItem('username', result.user.displayName || 'User')
      localStorage.setItem('photo', result.user.photoURL || '')
      navigate('/main')
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') setError('Popup closed. Please try again.')
      else if (err.code === 'auth/popup-blocked') setError('Popup blocked — allow popups for this site.')
      else if (err.code === 'auth/cancelled-popup-request') setError('')
      else if (err.code === 'auth/unauthorized-domain') setError('Domain not authorised in Firebase Console.')
      else setError('Google sign-up failed. Please try again.')
    } finally { setLoading(false) }
  }

  const handleEmailSignup = async () => {
    if (!firebaseConfigured || !auth) { setError('Authentication is not configured yet.'); return }
    try {
      setError(''); setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: username })
      const token = await result.user.getIdToken()
      await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      localStorage.setItem('token', token)
      localStorage.setItem('username', username || 'User')
      localStorage.setItem('photo', '')
      navigate('/main')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('This email is already registered.')
      else if (err.code === 'auth/invalid-email')   setError('Please enter a valid email address.')
      else if (err.code === 'auth/weak-password')   setError('Password must be at least 6 characters.')
      else setError('Sign-up failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-split">

      {/* LEFT PANEL */}
      <div className="auth-split-left">
        <div className="auth-split-left-inner">
          <div className="auth-brand-icon">🛡️</div>
          <h1 className="auth-brand-title">Join CyberSafe</h1>
          <p className="auth-brand-sub">Build real-world cyber defence skills today</p>
          <div className="auth-features">
            {[
              { icon: '🏆', text: 'Earn XP & unlock badges' },
              { icon: '🧠', text: 'AI-generated quizzes' },
              { icon: '🔐', text: 'Learn to spot threats' },
              { icon: '📊', text: 'Track your progress' },
            ].map(f => (
              <div key={f.text} className="auth-feature-item">
                <span className="auth-feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-split-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Create Account</h2>
            <p>Start your cybersecurity journey today</p>
          </div>

          {DEMO_MODE && (
            <div className="auth-demo-notice">
              <div className="auth-demo-icon">⚙️</div>
              <div>
                <strong>Firebase not configured</strong>
                <p>Authentication requires Firebase credentials. You can still explore the full app as a guest.</p>
              </div>
            </div>
          )}

          {DEMO_MODE && (
            <button className="auth-guest-btn" onClick={() => navigate('/main')}>
              🚀 Browse as Guest — No Login Required
            </button>
          )}

          {DEMO_MODE && <div className="auth-or-divider"><span>or register with Firebase</span></div>}

          <button className="google-btn" onClick={handleGoogleSignup} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            {loading ? 'Creating account…' : 'Continue with Google'}
          </button>

          <div className="auth-divider"><span>or sign up with email</span></div>

          <div className="auth-field">
            <label>Username</label>
            <input type="text" placeholder="Cyber Defender" value={username}
              onChange={e => setUsername(e.target.value)} disabled={loading} />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} disabled={loading} />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-pw-wrap">
              <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                onChange={e => setPassword(e.target.value)} disabled={loading}
                onKeyDown={e => e.key === 'Enter' && handleEmailSignup()} />
              <button className="auth-pw-toggle" onClick={() => setShowPw(s => !s)} type="button">
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit-btn" onClick={handleEmailSignup} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>

          <p className="auth-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
