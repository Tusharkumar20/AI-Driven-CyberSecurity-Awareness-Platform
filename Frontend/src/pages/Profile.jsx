import { auth } from "../config/firebase"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate()
  const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  const [user, setUser] = useState(null)
  const [image, setImage] = useState(defaultImage)
  const [xp, setXP] = useState(0)

  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const savedPhoto = localStorage.getItem("profilePhoto")
        if (savedPhoto) setImage(savedPhoto)

        // Fetch XP from backend
        try {
          const token = await firebaseUser.getIdToken(true)
          const res = await fetch('/api/profile', {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          setXP(data.xp)
        } catch (err) {
          console.error('Failed to fetch profile:', err)
        }
      } else {
        setImage(defaultImage)
        setXP(0)
      }
    })
    return () => unsubscribe()
  }, [])

  /* IMAGE UPLOAD */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
        localStorage.setItem("profilePhoto", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  /* RESET XP */
  const handleResetXP = async () => {
    try {
      if (!auth?.currentUser) return
      const token = await auth.currentUser.getIdToken(true)
      await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ xp: 0 })
      })
      setXP(0)
    } catch (err) {
      console.error('Failed to reset XP:', err)
    }
  }

  /* LOGOUT */
  const handleLogout = async () => {
    await signOut(auth)
    localStorage.removeItem("token")
    localStorage.removeItem("profilePhoto")
    setUser(null)
    setImage(defaultImage)
    navigate("/login")
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>User Profile</h2>
        <label htmlFor="upload-photo">
          <img
            src={image}
            alt="profile"
            className="profile-img"
          />
        </label>
        <input
          type="file"
          id="upload-photo"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <p>Click image to change photo</p>
        <h3>{user ? user.displayName || "User" : "XYZ"}</h3>
        <p>{user ? user.email : "Guest User"}</p>

        {/* XP SECTION */}
        <div className="score-box">
          <h3>Quiz Score</h3>
          <p>{xp} XP</p>
        </div>

        {user && (
          <button onClick={handleResetXP}>Reset XP</button>
        )}

        {user ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <div className="profile-buttons">
            <button onClick={() => navigate("/login")}>Sign In</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        )}
      </div>
    </div>
  )
}