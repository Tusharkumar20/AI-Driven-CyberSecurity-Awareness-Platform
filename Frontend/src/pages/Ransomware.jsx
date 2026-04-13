import { useState, useEffect } from "react"
import Quiz from "../components/Quiz"

const STATIC_QUESTIONS = [
  { question: "What is ransomware?", options: ["Locks data for money", "Firewall", "Antivirus", "Protocol"], answer: "Locks data for money" },
  { question: "Ransomware demands?", options: ["Money", "RAM", "CPU", "Battery"], answer: "Money" },
  { question: "Data becomes?", options: ["Encrypted", "Deleted", "Public", "Safe"], answer: "Encrypted" },
  { question: "Ransomware spreads via?", options: ["Email", "USB", "Downloads", "All of these"], answer: "All of these" },
  { question: "User sees?", options: ["Ransom note", "Login page", "Game", "Wallpaper"], answer: "Ransom note" },
  { question: "Best prevention?", options: ["Backup data", "Ignore", "Restart", "Delete system"], answer: "Backup data" },
  { question: "Encryption means?", options: ["Lock data", "Delete data", "Copy data", "Move data"], answer: "Lock data" },
  { question: "Phishing helps ransomware?", options: ["Yes", "No", "Maybe", "Never"], answer: "Yes" },
  { question: "Paying ransom is?", options: ["Risky", "Safe", "Good", "Fast"], answer: "Risky" },
  { question: "Backup helps?", options: ["Recover data", "Delete data", "Hack system", "Slow PC"], answer: "Recover data" },
  { question: "Ransomware is a?", options: ["Malware", "Hardware", "Network", "App"], answer: "Malware" },
  { question: "Goal of ransomware?", options: ["Money extortion", "Fix system", "Speed up", "Clean data"], answer: "Money extortion" },
  { question: "Safe practice?", options: ["Regular backup", "Click unknown links", "Share password", "Ignore updates"], answer: "Regular backup" },
  { question: "Antivirus helps?", options: ["Yes", "No", "Maybe", "Never"], answer: "Yes" },
  { question: "Ransomware affects?", options: ["Data security", "Color", "UI", "Mouse"], answer: "Data security" },
]

const PREVENTION_TIPS = [
  { icon: "💾", title: "Regular Backups",      desc: "Back up critical data frequently to an offline or cloud location so you can restore without paying." },
  { icon: "📎", title: "Email Caution",         desc: "Never open attachments or click links from unexpected emails — ransomware arrives this way constantly." },
  { icon: "🔄", title: "Patch & Update",        desc: "Keep your OS and applications updated to close the security holes ransomware exploits to gain entry." },
  { icon: "🛡️", title: "Security Software",    desc: "Deploy endpoint protection that can detect and block ransomware behaviour in real time." },
  { icon: "🌐", title: "Network Segmentation",  desc: "Isolate critical systems so ransomware cannot spread laterally across your entire network." },
  { icon: "🚫", title: "Disable Macros",        desc: "Office macros are a top delivery mechanism for ransomware — disable them by default for all users." },
]

export default function Ransomware() {
  const [stats] = useState({ attacks: "4,000+", avgRansom: "$1.54M", recovery: "23 days", victims: "66%" })

  return (
    <div className="tp-root">

      {/* ── Hero ── */}
      <div className="tp-hero" style={{ "--tp-color": "#eab308" }}>
        <div className="tp-hero-bg" style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(234,179,8,0.25) 0%, transparent 70%)" }} />
        <div className="tp-hero-content">
          <div className="tp-hero-badge" style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.4)", color: "#eab308" }}>
            💀 Extreme Threat
          </div>
          <div className="tp-hero-icon">🔒</div>
          <h1 className="tp-hero-title">Ransomware Attacks</h1>
          <p className="tp-hero-sub">Ransomware locks your files and demands payment — costing businesses millions. Learn how it works and how to stay one step ahead.</p>
        </div>
      </div>

      <div className="tp-content">

        {/* ── Stats ── */}
        <div className="tp-stats-row">
          {[
            { label: "Attacks per day", value: stats.attacks, icon: "💥" },
            { label: "Avg ransom demand", value: stats.avgRansom, icon: "💸" },
            { label: "Avg recovery time", value: stats.recovery, icon: "⏱️" },
            { label: "Orgs hit in 2023", value: stats.victims, icon: "🏢" },
          ].map(s => (
            <div key={s.label} className="tp-stat-card">
              <div className="tp-stat-icon">{s.icon}</div>
              <div className="tp-stat-value">{s.value}</div>
              <div className="tp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Definition ── */}
        <div className="tp-section">
          <div className="tp-section-label">📖 Definition</div>
          <h2 className="tp-section-title">What is Ransomware?</h2>
          <div className="tp-info-card">
            <div className="tp-info-icon">🔒</div>
            <p>Ransomware is a category of malware that encrypts a victim's files or entire system, making them inaccessible. The attacker then demands a ransom — typically in cryptocurrency — in exchange for the decryption key needed to unlock the data.</p>
          </div>
          <video className="tp-video" autoPlay loop muted playsInline controls>
            <source src="https://www.shutterstock.com/shutterstock/videos/3545589449/preview/stock-footage-hacked-computer-illustration-animation-looping-animation-transparent-background.webm" type="video/mp4" />
          </video>
        </div>

        {/* ── Example ── */}
        <div className="tp-section">
          <div className="tp-section-label">⚠️ Real-World Example</div>
          <h2 className="tp-section-title">How an Attack Unfolds</h2>
          <div className="tp-example-card">
            <div className="tp-example-steps">
              {[
                { n: "1", t: "Delivery",     d: "An employee opens a phishing email containing a malicious attachment disguised as an invoice." },
                { n: "2", t: "Encryption",   d: "The ransomware silently encrypts files across the network — documents, databases, backups — within minutes." },
                { n: "3", t: "Ransom Demand",d: "A ransom note appears on every screen demanding cryptocurrency payment within 72 hours or files are deleted." },
              ].map(s => (
                <div key={s.n} className="tp-example-step">
                  <div className="tp-step-num" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308", border: "1px solid rgba(234,179,8,0.3)" }}>{s.n}</div>
                  <div><strong>{s.t}</strong><p>{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <video className="tp-video" autoPlay loop muted playsInline controls>
            <source src="https://www.shutterstock.com/shutterstock/videos/3541146013/preview/stock-footage-explanatory-animation-about-ransomware-attacks-hacking-animation-computer-virus-animation.webm" type="video/mp4" />
          </video>
        </div>

        {/* ── Prevention ── */}
        <div className="tp-section">
          <div className="tp-section-label">🛡️ Stay Protected</div>
          <h2 className="tp-section-title">How to Prevent Ransomware</h2>
          <div className="tp-prevention-grid">
            {PREVENTION_TIPS.map(t => (
              <div key={t.title} className="tp-prevention-card">
                <div className="tp-prevention-icon">{t.icon}</div>
                <div className="tp-prevention-title">{t.title}</div>
                <div className="tp-prevention-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <video className="tp-video" autoPlay loop muted playsInline controls>
            <source src="https://www.shutterstock.com/shutterstock/videos/3987070775/preview/stock-footage-high-quality-ransomware-protection-animated-icon-created-in-clean-d-flat-motion-design-represents.webm" type="video/mp4" />
          </video>
          <a href="https://www.youtube.com/watch?v=-KL9APUjj3E" target="_blank" rel="noreferrer" className="tp-watch-btn">
            ▶ Watch Full Video Guide
          </a>
        </div>

        {/* ── Quiz ── */}
        <div className="tp-section">
          <div className="tp-section-label">🧠 Knowledge Check</div>
          <h2 className="tp-section-title">Test Your Knowledge</h2>
          <Quiz questions={STATIC_QUESTIONS} type="ransomware" />
        </div>

      </div>
    </div>
  )
}
