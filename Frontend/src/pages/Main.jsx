import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const TICKER_ITEMS = [
  "🔴 New phishing campaign targeting banking users detected",
  "🟠 Ransomware attacks up 40% this year — businesses at risk",
  "🔴 Major DDoS attack disrupts cloud services worldwide",
  "🟡 New malware strain evades leading antivirus software",
  "🔴 Social engineering scams surge — stay alert",
  "🟠 Zero-day vulnerability discovered in popular browsers",
  "🔴 Credential stuffing attacks spike across financial platforms",
]

const threats = [
  {
    id: 'phishing',
    icon: '🪝',
    title: 'Phishing Attack',
    severity: 'Critical',
    severityColor: '#ef4444',
    desc: 'Deceptive emails and fake websites crafted to steal your credentials and sensitive data.',
    path: '/phishing',
  },
  {
    id: 'malware',
    icon: '☣️',
    title: 'Malware Attack',
    severity: 'High',
    severityColor: '#f97316',
    desc: 'Malicious software that infiltrates systems to damage, disrupt, or gain unauthorized access.',
    path: '/malware',
  },
  {
    id: 'ransomware',
    icon: '🔐',
    title: 'Ransomware',
    severity: 'Critical',
    severityColor: '#ef4444',
    desc: 'Attackers encrypt your files and demand ransom payment in exchange for the decryption key.',
    path: '/ransomware',
  },
  {
    id: 'ddos',
    icon: '⚡',
    title: 'DDoS Attack',
    severity: 'High',
    severityColor: '#f97316',
    desc: 'Floods servers with massive traffic to cause outages and deny service to legitimate users.',
    path: '/ddos',
  },
]

const statsData = [
  { label: 'Cyber Attacks Daily', value: 2200, suffix: '+' },
  { label: 'Data Breaches Yearly', value: 500, suffix: 'M+' },
  { label: 'Phishing Sites Active', value: 1400, suffix: 'K+' },
  { label: 'Global Loss (USD)', value: 8, suffix: 'T+' },
]

function useCountUp(target, duration, start) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatBox({ label, value, suffix, start }) {
  const count = useCountUp(value, 2000, start)
  return (
    <div className="stat-box">
      <div className="stat-value">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Main() {
  const [user, setUser] = useState(null)
  const [tickerIndex, setTickerIndex] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(i => (i + 1) % TICKER_ITEMS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page home">

      <div className="threat-ticker">
        <span className="ticker-label">LIVE THREATS</span>
        <span className="ticker-text" key={tickerIndex}>{TICKER_ITEMS[tickerIndex]}</span>
      </div>

      <div className="hero">

        <div className="hero-left">
          <div className="hero-badge">🛡️ AI-Powered Cyber Education</div>
          <h1>
            Defend Against{' '}
            <span className="accent-text">Cyber Threats</span>{' '}
            Before They Strike
          </h1>
          <p>
            Master real-world attack techniques through interactive lessons, live phishing detection,
            and knowledge quizzes — built for the modern digital landscape.
          </p>
          {user && (
            <p className="welcome-user">
              👋 Welcome back, <strong>{user.displayName || 'Cyber Defender'}</strong>
            </p>
          )}
          <div className="hero-buttons">
            <Link to="/phishing" className="btn-primary">Start Learning</Link>
            <Link to="/profile" className="btn-secondary">View Progress</Link>
          </div>
        </div>

        <div className="hero-right">
          {threats.map(t => (
            <div className="feature-card" key={t.id}>
              <div className="card-top">
                <div
                  className="card-icon-wrap"
                  style={{
                    background: t.severityColor + '18',
                    border: `1px solid ${t.severityColor}40`,
                    boxShadow: `0 0 16px ${t.severityColor}30`,
                  }}
                >
                  <span className="card-icon">{t.icon}</span>
                </div>
                <span
                  className="severity-badge"
                  style={{
                    background: t.severityColor + '22',
                    color: t.severityColor,
                    border: `1px solid ${t.severityColor}55`,
                  }}
                >
                  {t.severity}
                </span>
              </div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <Link to={t.path} className="card-link">Explore & Learn →</Link>
            </div>
          ))}
        </div>

      </div>

      <div className="stats-section" ref={statsRef}>
        {statsData.map(s => (
          <StatBox key={s.label} {...s} start={statsVisible} />
        ))}
      </div>

      <div className="how-section">
        <h2 className="section-title">How CyberSafe Works</h2>
        <div className="steps-row">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Choose a Threat</h3>
            <p>Pick from Phishing, Malware, Ransomware, or DDoS to begin your learning journey.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Learn & Detect</h3>
            <p>Explore definitions, real examples, and use AI tools to analyze live threats.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Test Yourself</h3>
            <p>Take quizzes to earn XP, track your progress, and prove your cyber expertise.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
