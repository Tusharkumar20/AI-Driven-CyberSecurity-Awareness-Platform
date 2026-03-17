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

      const result = await signInWithPopup(auth, googleProvider)

      const token = await result.user.getIdToken()

      /* SAVE USER DATA */
      localStorage.setItem('token', token)
      localStorage.setItem('username', result.user.displayName || "XYZ")
      localStorage.setItem('photo', result.user.photoURL)

      await fetch('http://localhost:3000/api/profile', {
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

      const result = await signInWithEmailAndPassword(auth, email, password)

      const token = await result.user.getIdToken()

      /* SAVE USER DATA */
      localStorage.setItem('token', token)
      localStorage.setItem('username', result.user.displayName || "XYZ")
      localStorage.setItem('photo', result.user.photoURL)

      await fetch('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      navigate('/main')

    } catch (err) {

      if (err.code === 'auth/user-not-found') {
        setError('User not found')
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password')
      } else {
        setError('Login failed')
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