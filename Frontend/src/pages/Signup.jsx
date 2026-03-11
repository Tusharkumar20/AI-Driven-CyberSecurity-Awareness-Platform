import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleGoogleSignup = async () => {
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

  const handleEmailSignup = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Set display name
      await updateProfile(result.user, { displayName: username })

      const token = await result.user.getIdToken()
      await fetch('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.setItem('token', token)
      navigate('/main')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already in use')
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters')
      } else {
        setError('Something went wrong')
      }
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>

      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleEmailSignup}>Sign Up</button>
      </div>

      <p>or</p>
      <button onClick={handleGoogleSignup}>Sign up with Google</button>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  )
}