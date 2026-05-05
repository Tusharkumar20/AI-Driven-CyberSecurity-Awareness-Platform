import React, { useEffect, useState } from "react";
import Quiz from "../components/Quiz";

export default function Malware() {

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = async () => {

    setLoading(true)
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
Generate ${count} malware cyber security MCQ questions.

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
      const raw = data.choices[0].message.content
      const start = raw.indexOf('[')
      const end = raw.lastIndexOf(']')
      const parsed = JSON.parse(raw.slice(start, end + 1))

      setQuestions(parsed)
      setLoading(false)

    } catch (err) {
      console.error(err)
      setError("Failed to generate questions. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="page malware">

      <h1>Malware Attack</h1>

      {/* 🔴 Attack Video */}
      <video className="attack-video" autoPlay loop muted playsInline>
        <source
          src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/rj4JQE1wnlin0rh82/873z-v1-0017-00677048-7d1i39lqq2__1019443751254b28b12df3fa30f4f850__P360.mp4"
          type="video/mp4"
        />
      </video>

      {/* 📘 Definition */}
      <div className="definition-box">
        <p>
          Malware is malicious software designed to damage or gain unauthorized
          access to systems like virus, worm, trojan, spyware and ransomware.
        </p>
      </div>

      {/* ⚠️ Example */}
      <h2>Example</h2>

      <video className="attack-video" autoPlay loop muted playsInline>
        <source
          src="https://d2j2uxe7jasn0r.cloudfront.net/watermarks/video/BTbLfho0cl6z111tx/videoblocks-o-50326_H6k3BQXwWx__090ddfee900c1dae21004ba9f9d18b04__P360.mp4"
          type="video/mp4"
        />
      </video>

      <div className="definition-box">
        <p>
          User downloads cracked software and Trojan installs secretly and
          steals login credentials.
        </p>
      </div>

      {/* 🛡️ Prevention */}
      <h2>Prevention</h2>

      <video className="attack-video" autoPlay loop muted playsInline>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3887729619/preview/stock-footage-shield-security-protection-animation-in-k.webm"
          type="video/mp4"
        />
      </video>

      <ul className="prevention-box">
        <li>✔ Install antivirus</li>
        <li>✔ Use trusted websites</li>
        <li>✔ Keep system updated</li>
        <li>✔ Avoid suspicious emails</li>
        <li>✔ Do not use pirated software</li>
      </ul>

      {/* 🧠 Quiz Section */}
      <h2>Test Your Knowledge</h2>

      <button className="regen-btn" onClick={generateQuestions}>
        Generate New Questions
      </button>

      {/* ⏳ Loading */}
      {loading && (
        <div className="loader">
          <h3>Generating Questions...</h3>
        </div>
      )}

      {/* ❌ Error */}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {/* ✅ Quiz */}
      {!loading && !error && (
        <Quiz questions={questions} type="malware" />
      )}

    </div>
  )
}