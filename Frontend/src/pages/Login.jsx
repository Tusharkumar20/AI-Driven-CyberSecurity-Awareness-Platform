import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      await fetch('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.setItem('token', token)
      navigate('/main')
    } catch (err) {
      console.error(err)
    }
  }

  const handleEmailLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const token = await result.user.getIdToken()
      await fetch('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.setItem('token', token)
      navigate('/main')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleEmailLogin}>Login</button>
      </div>

      <p>or</p>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  )
}