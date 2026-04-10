import { useState, useEffect } from "react"
import Quiz from "../components/Quiz";

export default function Phishing() {

  const [message, setMessage] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const [questions, setQuestions] = useState([])
  const [quizLoading, setQuizLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    generateQuestions()
  }, [])

  // 🔍 Phishing Detector
  const analyzeMessage = async () => {

    if (!message.trim()) return

    setLoading(true)
    setResult(null)

    try {

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            max_tokens: 10,
            messages: [
              {
                role: "system",
                content:
                  "You are a cybersecurity expert. Reply with ONLY a number between 0 and 100 showing phishing percentage."
              },
              {
                role: "user",
                content: `Analyze this message: "${message}"`
              }
            ]
          })
        }
      )

      const data = await response.json()
      const percentage = parseInt(data.choices[0].message.content.trim())
      setResult(percentage)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 🎯 Auto Quiz Generator
  const generateQuestions = async () => {

    setQuizLoading(true)
    setError("")

    try {

      const count = Math.floor(Math.random() * 6) + 10

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
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
                content: `
Generate ${count} Phishing cyber security MCQ questions.

Return ONLY JSON array.

Format:
[
 {
  "question": "",
  "options": ["", "", "", ""],
  "answer": ""
 }
]
`
              }
            ]
          })
        }
      )

      const data = await response.json()
      const text = data.choices[0].message.content.trim()
      const parsed = JSON.parse(text)

      setQuestions(parsed)
      setQuizLoading(false)

    } catch (err) {
      console.error(err)
      setError("Failed to generate Phishing quiz")
      setQuizLoading(false)
    }
  }

  const getColor = (percentage) => {
    if (percentage >= 70) return "red"
    if (percentage >= 40) return "orange"
    return "green"
  }

  const getLabel = (percentage) => {
    if (percentage >= 70) return "High Risk of Spam"
    if (percentage >= 40) return "Moderate Risk of Spam"
    return "Low Risk of Spam"
  }

  return (
    <div className="page phishing">

      <h1>Phishing Attack</h1>

      {/* Video */}
      <video className="attack-gif" autoPlay loop muted playsInline>
        <source src="https://cdnl.iconscout.com/lottie/premium/thumb/phishing-attack-animation-gif-download-5619125.mp4" type="video/mp4" />
      </video>

      {/* Definition */}
      <div className="definition-box">
        <p>
          Phishing is a cyber attack where attackers try to trick users into
          revealing sensitive information like passwords, bank details, or
          personal data by pretending to be a trusted source.
        </p>
      </div>

      {/* Example */}
      <h2>Example</h2>

      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3563146233/preview/stock-footage-email-phishing-email-scam-stealing-personal-information-through-phishing-email-financial-email.webm"
          type="video/mp4"
        />
      </video>

      <div className="definition-box">
        <p>
          You receive a fake bank email asking for verification. When you click
          the link and enter details, hackers steal your credentials.
        </p>
      </div>

      {/* Prevention */}
      <h2>Prevention</h2>

      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3881012921/preview/stock-footage-animated-concept-showcasing-phishing-scams-cyber-threats-and-data-security-with-copy-space-for.webm"
          type="video/mp4"
        />
      </video>

      <ul className="prevention-box">
        <li>✔ Never click unknown links</li>
        <li>✔ Check sender email</li>
        <li>✔ Use 2FA</li>
        <li>✔ Verify websites</li>
        <li>✔ Install antivirus</li>
      </ul>

<<<<<<< HEAD
=======
      {/* Video Link */}
>>>>>>> 64466ac426ba5ab065348a98fab151e57eda557c
      <a
        href="https://www.youtube.com/watch?v=XBkzBrXlle0"
        target="_blank"
        rel="noreferrer"
        className="video-link"
      >
        Watch Full Video
      </a>

<<<<<<< HEAD
      {/* 🔍 Phishing Detector */}
      <h2>Phishing Detector</h2>

      <textarea
        rows={6}
        cols={50}
        placeholder="Paste suspicious message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br />

      <button onClick={analyzeMessage} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Message"}
      </button>

      {result !== null && (
        <div>
          <h2 style={{ color: getColor(result) }}>
            {result}% Spam Likelihood
          </h2>
          <p style={{ color: getColor(result) }}>
            {getLabel(result)}
          </p>
=======
      {/* Phishing Detector */}
      <div className="detector-section">
        <div className="detector-header">
          <div className="detector-icon-wrap">🔍</div>
          <div>
            <h2 className="detector-title">AI Phishing Detector</h2>
            <p className="detector-subtitle">Paste any suspicious message to scan it instantly with AI</p>
          </div>
>>>>>>> 64466ac426ba5ab065348a98fab151e57eda557c
        </div>

        <div className="detector-card">
          <div className="detector-textarea-wrap">
            <textarea
              className="detector-textarea"
              rows={5}
              maxLength={2000}
              placeholder="Paste a suspicious email, SMS, or message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="detector-char-count">{message.length} / 2000</div>
          </div>

          <button
            className={`detector-btn${loading ? ' loading' : ''}`}
            onClick={analyzeMessage}
            disabled={loading || !message.trim()}
          >
            {loading ? (
              <><span className="btn-spinner" /> Analyzing message...</>
            ) : (
              <><span>🔍</span> Scan for Phishing</>
            )}
          </button>

          {result !== null && (
            <div className="detector-result" key={result}>
              <div className="result-gauge-wrap">
                <div
                  className="result-gauge"
                  style={{ '--pct': result, '--clr': getColor(result) }}
                >
                  <div className="result-gauge-inner">
                    <div className="result-pct" style={{ color: getColor(result) }}>{result}%</div>
                    <div className="result-pct-label">Risk Score</div>
                  </div>
                </div>
              </div>

              <div className="result-details">
                <div className="result-label" style={{ color: getColor(result) }}>
                  <span>{result >= 70 ? '🚨' : result >= 40 ? '⚠️' : '✅'}</span>
                  {getLabel(result)}
                </div>
                <ul className="result-tips">
                  {result >= 70 ? (
                    <>
                      <li>Do not click any links in this message</li>
                      <li>Never share personal info or passwords</li>
                      <li>Report this message as spam immediately</li>
                      <li>Block the sender and delete the message</li>
                    </>
                  ) : result >= 40 ? (
                    <>
                      <li>Proceed with caution — verify the sender first</li>
                      <li>Do not click links until independently confirmed</li>
                      <li>Contact the organization directly if unsure</li>
                    </>
                  ) : (
                    <>
                      <li>This message appears relatively safe</li>
                      <li>Always stay vigilant with unknown senders</li>
                      <li>When in doubt, don't click — verify first</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🧠 Quiz */}
      <h2>Test Your Knowledge</h2>

      <button className="regen-btn" onClick={generateQuestions}>
        Generate New Questions
      </button>

      {quizLoading && <h3>Generating Phishing Quiz...</h3>}

      {error && <p className="error">{error}</p>}

      {!quizLoading && !error && (
        <Quiz questions={questions} type="phishing" />
      )}

    </div>
  )
}