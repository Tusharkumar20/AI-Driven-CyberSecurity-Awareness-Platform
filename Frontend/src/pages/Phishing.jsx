import { useState, useEffect } from "react"
import Quiz from "../components/Quiz"

const PREVENTION_TIPS = [
  { icon: "🔗", title: "Check Links",       desc: "Hover over links before clicking — verify the actual URL destination." },
  { icon: "📧", title: "Verify Sender",     desc: "Always check the sender's full email address, not just the display name." },
  { icon: "🔒", title: "Use 2FA",           desc: "Two-factor authentication protects accounts even if credentials are stolen." },
  { icon: "🌐", title: "Verify Websites",   desc: "Look for HTTPS and check the domain spelling before entering any data." },
  { icon: "🛡️", title: "Install Antivirus", desc: "Reputable security software catches phishing links and malicious downloads." },
  { icon: "🧠", title: "Stay Sceptical",    desc: "Treat unsolicited urgent messages with suspicion — legitimate orgs rarely rush you." },
]

export default function Phishing() {
  const [message, setMessage]     = useState("")
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [questions, setQuestions] = useState([])
  const [quizLoading, setQuizLoading] = useState(true)
  const [error, setError]         = useState("")

  useEffect(() => { generateQuestions() }, [])

  const analyzeMessage = async () => {
    if (!message.trim()) return
    setLoading(true); setResult(null)
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", max_tokens: 10,
          messages: [
            { role: "system", content: "You are a cybersecurity expert. Reply with ONLY a number between 0 and 100 showing phishing percentage." },
            { role: "user",   content: `Analyze this message: "${message}"` }
          ]
        })
      })
      const data = await response.json()
      setResult(parseInt(data.choices[0].message.content.trim()))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const generateQuestions = async () => {
    setQuizLoading(true); setError("")
    try {
      const count = Math.floor(Math.random() * 6) + 10
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", temperature: 1,
          messages: [{ role: "system", content: `Generate ${count} Phishing cyber security MCQ questions.\nReturn ONLY JSON array.\nFormat:\n[{"question":"","options":["","","",""],"answer":""}]` }]
        })
      })
      const data = await response.json()
      const raw = data.choices[0].message.content.trim()
      const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '')
      setQuestions(JSON.parse(json))
      setQuizLoading(false)
    } catch (err) { console.error(err); setError("Failed to generate quiz"); setQuizLoading(false) }
  }

  const getColor = (p) => p >= 70 ? "#ef4444" : p >= 40 ? "#f97316" : "#8b5cf6"
  const getLabel = (p) => p >= 70 ? "High Risk — Likely Phishing" : p >= 40 ? "Moderate Risk — Proceed with Caution" : "Low Risk — Appears Safe"

  return (
    <div className="tp-root">

      {/* ── Hero ── */}
      <div className="tp-hero" style={{ "--tp-color": "#ef4444" }}>
        <div className="tp-hero-bg" />
        <div className="tp-hero-content">
          <div className="tp-hero-badge" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444" }}>
            🚨 Critical Threat
          </div>
          <div className="tp-hero-icon">🪝</div>
          <h1 className="tp-hero-title">Phishing Attacks</h1>
          <p className="tp-hero-sub">Learn how attackers use deception to steal your credentials and sensitive data — then put your skills to the test.</p>
        </div>
      </div>

      <div className="tp-content">

        {/* ── What is it ── */}
        <div className="tp-section">
          <div className="tp-section-label">📖 Definition</div>
          <h2 className="tp-section-title">What is Phishing?</h2>
          <div className="tp-info-card">
            <div className="tp-info-icon">🪝</div>
            <p>Phishing is a cyber attack where attackers impersonate trusted sources — banks, tech companies, or colleagues — to trick victims into revealing passwords, credit card numbers, or personal data through fake emails, websites, or messages.</p>
          </div>
          <video className="tp-video" autoPlay loop muted playsInline>
            <source src="https://cdnl.iconscout.com/lottie/premium/thumb/phishing-attack-animation-gif-download-5619125.mp4" type="video/mp4" />
          </video>
        </div>

        {/* ── Example ── */}
        <div className="tp-section">
          <div className="tp-section-label">⚠️ Real-World Example</div>
          <h2 className="tp-section-title">How It Happens</h2>
          <div className="tp-example-card">
            <div className="tp-example-steps">
              {[
                { n: "1", t: "You receive a fake email", d: 'An email arrives appearing to be from your bank saying "Your account has been compromised."' },
                { n: "2", t: "You click the link",       d: "The email contains a link to a convincing-looking but fake login page designed to harvest credentials." },
                { n: "3", t: "Credentials stolen",       d: "You enter your username and password. The attacker captures them instantly and gains account access." },
              ].map(s => (
                <div key={s.n} className="tp-example-step">
                  <div className="tp-step-num">{s.n}</div>
                  <div>
                    <strong>{s.t}</strong>
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <video className="tp-video" autoPlay loop muted playsInline controls>
            <source src="https://www.shutterstock.com/shutterstock/videos/3563146233/preview/stock-footage-email-phishing-email-scam-stealing-personal-information-through-phishing-email-financial-email.webm" type="video/mp4" />
          </video>
        </div>

        {/* ── Prevention ── */}
        <div className="tp-section">
          <div className="tp-section-label">🛡️ Stay Protected</div>
          <h2 className="tp-section-title">How to Prevent Phishing</h2>
          <div className="tp-prevention-grid">
            {PREVENTION_TIPS.map(t => (
              <div key={t.title} className="tp-prevention-card">
                <div className="tp-prevention-icon">{t.icon}</div>
                <div className="tp-prevention-title">{t.title}</div>
                <div className="tp-prevention-desc">{t.desc}</div>
              </div>
            ))}
          </div>
          <a href="https://www.youtube.com/watch?v=XBkzBrXlle0" target="_blank" rel="noreferrer" className="tp-watch-btn">
            ▶ Watch Full Video Guide
          </a>
        </div>

        {/* ── AI Detector ── */}
        <div className="tp-section">
          <div className="tp-section-label">🤖 AI Tool</div>
          <h2 className="tp-section-title">AI Phishing Detector</h2>
          <div className="detector-card">
            <div className="detector-textarea-wrap">
              <textarea className="detector-textarea" rows={5} maxLength={2000}
                placeholder="Paste a suspicious email, SMS, or message here..."
                value={message} onChange={e => setMessage(e.target.value)} />
              <div className="detector-char-count">{message.length} / 2000</div>
            </div>
            <button className={`detector-btn${loading ? ' loading' : ''}`}
              onClick={analyzeMessage} disabled={loading || !message.trim()}>
              {loading ? <><span className="btn-spinner" /> Analyzing...</> : <><span>🔍</span> Scan for Phishing</>}
            </button>
            {result !== null && (
              <div className="detector-result" key={result}>
                <div className="result-gauge-wrap">
                  <div className="result-gauge" style={{ '--pct': result, '--clr': getColor(result) }}>
                    <div className="result-gauge-inner">
                      <div className="result-pct" style={{ color: getColor(result) }}>{result}%</div>
                      <div className="result-pct-label">Risk</div>
                    </div>
                  </div>
                </div>
                <div className="result-details">
                  <div className="result-label" style={{ color: getColor(result) }}>
                    <span>{result >= 70 ? '🚨' : result >= 40 ? '⚠️' : '✅'}</span>
                    {getLabel(result)}
                  </div>
                  <ul className="result-tips">
                    {result >= 70 ? (<><li>Do not click any links in this message</li><li>Report as spam and delete immediately</li><li>Block the sender</li></>) :
                     result >= 40 ? (<><li>Verify the sender before responding</li><li>Do not click links until confirmed</li></>) :
                     (<><li>Appears relatively safe</li><li>Always stay vigilant with unknown senders</li></>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Quiz ── */}
        <div className="tp-section">
          <div className="tp-section-label">🧠 Knowledge Check</div>
          <h2 className="tp-section-title">Test Your Knowledge</h2>
          <button className="tp-regen-btn" onClick={generateQuestions}>↺ Generate New Questions</button>
          {quizLoading && <div className="tp-loading"><div className="prof-spinner" /><span>Generating quiz…</span></div>}
          {error && <p className="tp-error">{error}</p>}
          {!quizLoading && !error && <Quiz questions={questions} type="phishing" />}
        </div>

      </div>
    </div>
  )
}
