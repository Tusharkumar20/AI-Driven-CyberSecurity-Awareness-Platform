import { auth } from '../config/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Main() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <div>
      <h1>Welcome to CyberSec Awareness</h1>

      {user ? (
        <div>
          <p>Logged in as {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>You are browsing as a guest. Sign in to save your progress!</p>
          <button onClick={() => navigate('/login')}>Sign In</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      )}
    </div>
  )
}