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
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", 
          max_tokens: 10,
          messages: [
            { role: "system", content: "You are a cybersecurity expert. Reply with ONLY a number between 0 and 100 showing phishing percentage." },
            { role: "user",   content: `Analyze this message: "${message}"` }
          ]
        })
      })

      const data = await response.json()

      // ✅ FIX: safe parsing
      const value = parseInt(data?.choices?.[0]?.message?.content?.trim())
      setResult(isNaN(value) ? 0 : value)

    } catch (err) { 
      console.error(err) 
    }
    finally { setLoading(false) }
  }

  const generateQuestions = async () => {
    setQuizLoading(true); setError("")
    try {
      const count = Math.floor(Math.random() * 6) + 10
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", 
          temperature: 1,
          messages: [
            { 
              role: "system", 
              content: `Generate ${count} phishing MCQ questions.
Return ONLY valid JSON array.
Do NOT include markdown or backticks.
Format:
[{"question":"","options":["","","",""],"answer":""}]` 
            }
          ]
        })
      })

      const data = await response.json()

      // ✅ FIX: clean + safe JSON parsing
      let content = data?.choices?.[0]?.message?.content || "[]"
      content = content.replace(/```json|```/g, "").trim()
      setQuestions(JSON.parse(content))

      setQuizLoading(false)

    } catch (err) { 
      console.error(err); 
      setError("Failed to generate quiz"); 
      setQuizLoading(false) 
    }
  }

  const getColor = (p) => p >= 70 ? "#ef4444" : p >= 40 ? "#f97316" : "#8b5cf6"
  const getLabel = (p) => p >= 70 ? "High Risk — Likely Phishing" : p >= 40 ? "Moderate Risk — Proceed with Caution" : "Low Risk — Appears Safe"

  return (
    <div className="tp-root">

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

        <div className="tp-section">
          <div className="tp-section-label">📖 Definition</div>
          <h2 className="tp-section-title">What is Phishing?</h2>
          <div className="tp-info-card">
            <div className="tp-info-icon">🪝</div>
            <p>Phishing is a cyber attack where attackers impersonate trusted sources — banks, tech companies, or colleagues — to trick victims into revealing passwords, credit card numbers, or personal data through fake emails, websites, or messages.</p>
          </div>
        </div>

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
        </div>

        <div className="tp-section">
          <div className="tp-section-label">🤖 AI Tool</div>
          <h2 className="tp-section-title">AI Phishing Detector</h2>
          <div className="detector-card">

            <textarea
              className="detector-textarea"
              rows={5}
              maxLength={2000}
              placeholder="Paste a suspicious message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            <button
              className={`detector-btn${loading ? ' loading' : ''}`}
              onClick={analyzeMessage}
              disabled={loading || !message.trim()}
            >
              {loading ? "Analyzing..." : "Scan"}
            </button>

            {result !== null && (
              <div style={{ color: getColor(result) }}>
                {result}% — {getLabel(result)}
              </div>
            )}

          </div>
        </div>

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