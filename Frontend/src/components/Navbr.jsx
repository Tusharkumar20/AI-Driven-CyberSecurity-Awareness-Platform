import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { auth } from "../config/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"

function Navbar() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    localStorage.removeItem("token")
    setUser(null)
    setMenuOpen(false)
  }

  const isActive = (path) =>
    location.pathname === path || (path === "/main" && location.pathname === "/")

  return (
    <nav className="navbar">

      <div className="nav-left">
        <img src="/cyber-logo.svg" alt="CyberSafe Logo" className="nav-logo" />
        <Link to="/main" className="logo">CyberSafe</Link>
      </div>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        <Link
          to="/main"
          className={`nav-link ${isActive("/main") ? "nav-link-active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/profile"
          className={`nav-link ${isActive("/profile") ? "nav-link-active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          Profile
        </Link>

        {user ? (
          <button className="nav-btn nav-btn-outline" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-btn nav-btn-outline" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="nav-btn nav-btn-solid" onClick={() => setMenuOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </div>

      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

    </nav>
  )
}

export default Navbar
