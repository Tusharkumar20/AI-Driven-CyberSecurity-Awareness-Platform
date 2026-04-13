import { useEffect, useState } from "react"
import Quiz from "../components/Quiz"

const PREVENTION_TIPS = [
  { icon: "🔥", title: "Firewall Rules",     desc: "Configure firewalls to detect and automatically block suspicious traffic patterns." },
  { icon: "⚡", title: "Rate Limiting",       desc: "Cap the number of requests a single IP can make to prevent traffic floods." },
  { icon: "⚖️", title: "Load Balancing",      desc: "Distribute incoming traffic across multiple servers to prevent any single point of failure." },
  { icon: "📊", title: "Traffic Monitoring",  desc: "Monitor network traffic in real time to detect sudden surges and anomalies early." },
  { icon: "☁️", title: "Cloud DDoS Shield",   desc: "Cloud providers offer scrubbing centres that absorb and filter malicious traffic at scale." },
  { icon: "🌐", title: "Anycast Network",     desc: "Spread traffic across multiple distributed data centres so attacks are diluted globally." },
]

export default function Ddos() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState("")

  useEffect(() => { generateQuestions() }, [])

  const generateQuestions = async () => {
    setLoading(true); setError("")
    try {
      const count = Math.floor(Math.random() * 6) + 10
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", temperature: 1,
          messages: [{ role: "system", content: `Generate ${count} DDoS cyber security MCQ questions.\nReturn ONLY JSON array.\nFormat:\n[{"question":"","options":["","","",""],"answer":""}]` }]
        })
      })
      const data = await response.json()
      setQuestions(JSON.parse(data.choices[0].message.content.trim()))
      setLoading(false)
    } catch (err) { console.error(err); setError("Failed to generate quiz. Try again."); setLoading(false) }
  }

  return (
    <div className="tp-root">

      {/* ── Hero ── */}
      <div className="tp-hero" style={{ "--tp-color": "#3b82f6" }}>
        <div className="tp-hero-bg" style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(59,130,246,0.28) 0%, transparent 70%)" }} />
        <div className="tp-hero-content">
          <div className="tp-hero-badge" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", color: "#3b82f6" }}>
            💥 Network Threat
          </div>
          <div className="tp-hero-icon">🌊</div>
          <h1 className="tp-hero-title">DDoS Attacks</h1>
          <p className="tp-hero-sub">Distributed Denial-of-Service attacks flood servers with traffic to bring services offline. Understand the attack and learn how to defend your infrastructure.</p>
        </div>
      </div>

      <div className="tp-content">

        {/* ── How it works visual ── */}
        <div className="tp-section">
          <div className="tp-section-label">📖 Definition</div>
          <h2 className="tp-section-title">What is a DDoS Attack?</h2>
          <div className="tp-info-card">
            <div className="tp-info-icon">🌊</div>
            <p>A Distributed Denial-of-Service (DDoS) attack uses thousands of compromised devices — collectively called a botnet — to flood a target server, website, or network with traffic far beyond its capacity, making it slow or completely unavailable to legitimate users.</p>
          </div>
          <div className="tp-ddos-diagram">
            <div className="ddos-bots">
              {["💻","📱","🖥️","💻","📱","🖥️","💻","📱"].map((d, i) => (
                <div key={i} className="ddos-bot">{d}<span>Bot</span></div>
              ))}
            </div>
            <div className="ddos-arrow">⬇️ Flood of fake requests</div>
            <div className="ddos-server">🖥️<span>Your Server — Overwhelmed</span></div>
          </div>
          <video className="tp-video" autoPlay loop muted playsInline controls>
            <source src="https://www.shutterstock.com/shutterstock/videos/3608092235/preview/stock-footage-ddos-attack-white-line-animation-internet-bots-animated-icon-moving-lines-scaling-dots-internet.webm" type="video/mp4" />
          </video>
        </div>

        {/* ── Attack types ── */}
        <div className="tp-section">
          <div className="tp-section-label">🔍 Attack Types</div>
          <h2 className="tp-section-title">Common DDoS Variants</h2>
          <div className="tp-types-grid">
            {[
              { icon: "📦", name: "Volumetric",     desc: "Floods bandwidth with massive amounts of traffic (UDP floods, ICMP floods)" },
              { icon: "🔗", name: "Protocol",        desc: "Exploits weaknesses in network protocol stack (SYN floods, Ping of Death)" },
              { icon: "📄", name: "Application Layer",desc: "Targets web application layer with seemingly legitimate requests (HTTP floods)" },
              { icon: "🤖", name: "Botnet",          desc: "Thousands of infected devices act together to amplify attack volume" },
              { icon: "📡", name: "Amplification",   desc: "Abuses protocols like DNS or NTP to multiply traffic by 50–70x" },
              { icon: "💣", name: "Slowloris",        desc: "Holds connections open to exhaust server connection pool slowly" },
            ].map(t => (
              <div key={t.name} className="tp-type-card">
                <span className="tp-type-icon">{t.icon}</span>
                <strong>{t.name}</strong>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Example ── */}
        <div className="tp-section">
          <div className="tp-section-label">⚠️ Real-World Example</div>
          <h2 className="tp-section-title">How It Happens</h2>
          <div className="tp-example-card">
            <div className="tp-example-steps">
              {[
                { n: "1", t: "Botnet assembly", d: "Attackers infect thousands of devices worldwide (home routers, IoT devices, PCs) with malware, forming a botnet." },
                { n: "2", t: "Coordinated flood", d: "On command, all infected devices simultaneously bombard the target server with millions of fake requests per second." },
                { n: "3", t: "Service collapse", d: "The server's resources are exhausted. Legitimate users receive errors or timeouts — the service is effectively down." },
              ].map(s => (
                <div key={s.n} className="tp-example-step">
                  <div className="tp-step-num" style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)" }}>{s.n}</div>
                  <div><strong>{s.t}</strong><p>{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <video className="tp-video" autoPlay loop muted playsInline controls>
            <source src="https://www.shutterstock.com/shutterstock/videos/3608093555/preview/stock-footage-hacking-animation-library-malware-animated-white-line-icons-virus-computer-protection-threat.webm" type="video/mp4" />
          </video>
        </div>

        {/* ── Prevention ── */}
        <div className="tp-section">
          <div className="tp-section-label">🛡️ Stay Protected</div>
          <h2 className="tp-section-title">How to Prevent DDoS Attacks</h2>
          <div className="tp-prevention-grid">
            {PREVENTION_TIPS.map(t => (
              <div key={t.title} className="tp-prevention-card">
                <div className="tp-prevention-icon">{t.icon}</div>
                <div className="tp-prevention-title">{t.title}</div>
                <div className="tp-prevention-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <a href="https://www.youtube.com/watch?v=VhZxC6C2L7g" target="_blank" rel="noreferrer" className="tp-watch-btn">
            ▶ Watch Full Video Guide
          </a>
        </div>

        {/* ── Quiz ── */}
        <div className="tp-section">
          <div className="tp-section-label">🧠 Knowledge Check</div>
          <h2 className="tp-section-title">Test Your Knowledge</h2>
          <button className="tp-regen-btn" onClick={generateQuestions}>↺ Generate New Questions</button>
          {loading && <div className="tp-loading"><div className="prof-spinner" /><span>Generating quiz…</span></div>}
          {error && <p className="tp-error">{error}</p>}
          {!loading && !error && <Quiz questions={questions} type="ddos" />}
        </div>

      </div>
    </div>
  )
}
