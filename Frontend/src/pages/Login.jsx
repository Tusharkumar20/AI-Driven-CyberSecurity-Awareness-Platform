import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {

      setError('')

      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()

      localStorage.setItem('token', token)
      localStorage.setItem('username', result.user.displayName || "XYZ")
      localStorage.setItem('photo', result.user.photoURL)

      await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      navigate('/main')

    } catch (err) {
      console.error(err)
      setError('Google login failed')
    }
  }

  const handleEmailLogin = async () => {
    try {

      setError('')

      const result = await signInWithEmailAndPassword(auth, email, password)

      const token = await result.user.getIdToken()

      localStorage.setItem('token', token)
      localStorage.setItem('username', result.user.displayName || "XYZ")
      localStorage.setItem('photo', result.user.photoURL)

      await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      navigate('/main')

    } catch (err) {

      if (err.code === 'auth/invalid-email') {
        setError('Please enter the  email')
      }

      else if (err.code === 'auth/user-not-found') {
        setError('Email not registered')
      }

      else if (err.code === 'auth/wrong-password') {
        setError('Wrong password')
      }

      else if (err.code === 'auth/invalid-credential') {
        setError('Wrong email please try again')
      }

      else {
        setError('Login failed, try again')
      }

    }
  }

  return (

    <div className="page home">

      <div className="auth-container">

        <div className="auth-box">

          <h2>Sign In</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          {error && <p style={{color:'red'}}>{error}</p>}

          <button onClick={handleEmailLogin}>
            Sign In
          </button>

          <p style={{marginTop:'15px'}}>or</p>

          <button onClick={handleGoogleLogin}>
            Sign in with Google
          </button>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>

        </div>

      </div>

    </div>
  )
}