import { auth } from "../config/firebase"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

const LEVELS = [
  { level: 1, title: "Novice",       min: 0,    max: 99,   icon: "🔰", color: "#94a3b8" },
  { level: 2, title: "Apprentice",   min: 100,  max: 249,  icon: "🛡️", color: "#8b5cf6" },
  { level: 3, title: "Defender",     min: 250,  max: 499,  icon: "⚔️", color: "#7c3aed" },
  { level: 4, title: "Guardian",     min: 500,  max: 999,  icon: "🔮", color: "#a855f7" },
  { level: 5, title: "Cyber Elite",  min: 1000, max: Infinity, icon: "👑", color: "#fbbf24" },
]

const BADGES = [
  { id: "first_blood",  icon: "⚡", label: "First Steps",     desc: "Earned your first XP",          xpRequired: 1   },
  { id: "quiz_ace",     icon: "🎯", label: "Quiz Ace",         desc: "Reached 100 XP",                xpRequired: 100  },
  { id: "scholar",      icon: "📚", label: "Cyber Scholar",    desc: "Reached 250 XP",                xpRequired: 250  },
  { id: "guardian",     icon: "🔮", label: "Guardian",         desc: "Reached 500 XP",                xpRequired: 500  },
  { id: "elite",        icon: "👑", label: "Cyber Elite",      desc: "Reached 1000 XP",               xpRequired: 1000 },
  { id: "explorer",     icon: "🗺️", label: "Explorer",         desc: "Visited a threat module",       xpRequired: 10   },
]

const MODULES = [
  { id: "phishing",   icon: "🪝", label: "Phishing",   path: "/phishing",   color: "#ef4444" },
  { id: "malware",    icon: "☣️", label: "Malware",    path: "/malware",    color: "#f97316" },
  { id: "ransomware", icon: "🔐", label: "Ransomware", path: "/ransomware", color: "#ef4444" },
  { id: "ddos",       icon: "⚡", label: "DDoS",       path: "/ddos",       color: "#f97316" },
]

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0]
}

function getLevelProgress(xp) {
  const lvl = getLevel(xp)
  if (lvl.max === Infinity) return 100
  const range = lvl.max - lvl.min + 1
  const progress = xp - lvl.min
  return Math.min(100, Math.round((progress / range) * 100))
}

export default function Profile() {
  const navigate = useNavigate()
  const defaultImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  const [user, setUser]   = useState(null)
  const [image, setImage] = useState(defaultImage)
  const [xp, setXP]       = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) { setLoading(false); return }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const savedPhoto = localStorage.getItem("profilePhoto")
        if (savedPhoto) setImage(savedPhoto)
        try {
          const token = await firebaseUser.getIdToken(true)
          const res  = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
          const data = await res.json()
          setXP(data.xp || 0)
        } catch (err) {
          console.error('Failed to fetch profile:', err)
        }
      } else {
        setImage(defaultImage)
        setXP(0)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
      localStorage.setItem("profilePhoto", reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleResetXP = async () => {
    if (!auth?.currentUser) return
    try {
      const token = await auth.currentUser.getIdToken(true)
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: 0 })
      })
      setXP(0)
    } catch (err) {
      console.error('Failed to reset XP:', err)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    localStorage.removeItem("token")
    localStorage.removeItem("profilePhoto")
    setUser(null)
    setImage(defaultImage)
    navigate("/login")
  }

  const currentLevel   = getLevel(xp)
  const nextLevel      = LEVELS.find(l => l.level === currentLevel.level + 1)
  const levelProgress  = getLevelProgress(xp)
  const xpToNext       = nextLevel ? nextLevel.min - xp : 0
  const earnedBadges   = BADGES.filter(b => xp >= b.xpRequired)

  const displayName = user?.displayName || "Cyber Defender"
  const email       = user?.email || "guest@cybersafe.io"
  const joinDate    = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—"

  if (loading) {
    return (
      <div className="prof-loading">
        <div className="prof-spinner" />
      </div>
    )
  }

  return (
    <div className="prof-root">

      {/* ── Banner ── */}
      <div className="prof-banner">
        <div className="prof-banner-overlay" />
        <div className="prof-banner-grid" />
      </div>

      <div className="prof-content">

        {/* ── Avatar + Identity ── */}
        <div className="prof-identity-card">
          <div className="prof-avatar-wrap">
            <div className="prof-avatar-ring" style={{ "--ring-color": currentLevel.color }} />
            <label htmlFor="upload-photo" className="prof-avatar-label">
              <img src={image} alt="avatar" className="prof-avatar-img" />
              <div className="prof-avatar-overlay">
                <span>📷</span>
              </div>
            </label>
            <input type="file" id="upload-photo" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            <div className="prof-level-badge" style={{ background: currentLevel.color }}>
              {currentLevel.icon} Lv.{currentLevel.level}
            </div>
          </div>

          <div className="prof-identity-info">
            <h1 className="prof-name">{displayName}</h1>
            <p className="prof-email">{email}</p>
            <div className="prof-meta-row">
              <span className="prof-meta-chip">📅 Joined {joinDate}</span>
              <span className="prof-meta-chip" style={{ color: currentLevel.color, borderColor: currentLevel.color + "55" }}>
                {currentLevel.icon} {currentLevel.title}
              </span>
            </div>
          </div>

          <div className="prof-identity-actions">
            {user ? (
              <>
                <button className="prof-btn-danger" onClick={handleLogout}>🚪 Logout</button>
                <button className="prof-btn-ghost" onClick={handleResetXP}>↺ Reset XP</button>
              </>
            ) : (
              <>
                <button className="prof-btn-primary" onClick={() => navigate("/login")}>Sign In</button>
                <button className="prof-btn-ghost" onClick={() => navigate("/signup")}>Sign Up</button>
              </>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="prof-stats-row">
          <div className="prof-stat-card">
            <div className="prof-stat-icon">⚡</div>
            <div className="prof-stat-value">{xp}</div>
            <div className="prof-stat-label">Total XP</div>
          </div>
          <div className="prof-stat-card">
            <div className="prof-stat-icon">{currentLevel.icon}</div>
            <div className="prof-stat-value" style={{ color: currentLevel.color }}>
              {currentLevel.title}
            </div>
            <div className="prof-stat-label">Current Rank</div>
          </div>
          <div className="prof-stat-card">
            <div className="prof-stat-icon">🏅</div>
            <div className="prof-stat-value">{earnedBadges.length}</div>
            <div className="prof-stat-label">Badges Earned</div>
          </div>
          <div className="prof-stat-card">
            <div className="prof-stat-icon">🎯</div>
            <div className="prof-stat-value">{nextLevel ? xpToNext : "MAX"}</div>
            <div className="prof-stat-label">XP to Next Level</div>
          </div>
        </div>

        {/* ── XP Progress ── */}
        <div className="prof-section">
          <div className="prof-section-header">
            <h2 className="prof-section-title">⚡ XP Progress</h2>
            <span className="prof-section-sub">
              {nextLevel ? `${xp} / ${nextLevel.min} XP to ${nextLevel.title}` : "Max level reached!"}
            </span>
          </div>
          <div className="prof-xp-bar-wrap">
            <div className="prof-xp-bar-track">
              <div
                className="prof-xp-bar-fill"
                style={{ width: `${levelProgress}%`, background: `linear-gradient(90deg, #7c3aed, ${currentLevel.color})` }}
              />
            </div>
            <span className="prof-xp-bar-pct">{levelProgress}%</span>
          </div>
          <div className="prof-levels-row">
            {LEVELS.map(l => (
              <div
                key={l.level}
                className={`prof-level-pip ${xp >= l.min ? "prof-level-pip-done" : ""} ${currentLevel.level === l.level ? "prof-level-pip-active" : ""}`}
                style={currentLevel.level === l.level ? { borderColor: l.color, color: l.color } : {}}
              >
                <span>{l.icon}</span>
                <small>{l.title}</small>
              </div>
            ))}
          </div>
        </div>

        {/* ── Badges ── */}
        <div className="prof-section">
          <div className="prof-section-header">
            <h2 className="prof-section-title">🏅 Achievements</h2>
            <span className="prof-section-sub">{earnedBadges.length} / {BADGES.length} unlocked</span>
          </div>
          <div className="prof-badges-grid">
            {BADGES.map(b => {
              const earned = xp >= b.xpRequired
              return (
                <div key={b.id} className={`prof-badge-card ${earned ? "prof-badge-earned" : "prof-badge-locked"}`}>
                  <div className="prof-badge-icon">{earned ? b.icon : "🔒"}</div>
                  <div className="prof-badge-label">{b.label}</div>
                  <div className="prof-badge-desc">{earned ? b.desc : `Requires ${b.xpRequired} XP`}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Modules ── */}
        <div className="prof-section">
          <div className="prof-section-header">
            <h2 className="prof-section-title">📚 Learning Modules</h2>
            <span className="prof-section-sub">Explore to earn XP</span>
          </div>
          <div className="prof-modules-grid">
            {MODULES.map(m => (
              <Link key={m.id} to={m.path} className="prof-module-card">
                <div className="prof-module-icon" style={{ background: m.color + "22", border: `1px solid ${m.color}44` }}>
                  {m.icon}
                </div>
                <span className="prof-module-label">{m.label}</span>
                <span className="prof-module-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
