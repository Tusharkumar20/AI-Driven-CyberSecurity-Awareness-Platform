import React, { useEffect, useState } from "react";
import Quiz from "../components/Quiz";

function Ddos() {

  const topic = "DDoS"

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
Generate ${count} DDoS cyber security MCQ questions.

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
      setLoading(false)

    } catch (err) {
      console.error(err)
      setError("Failed to generate DDoS quiz. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="page ddos">

      <h1>DDoS Attack</h1>

      {/* 🔴 Attack Video */}
      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3608092235/preview/stock-footage-ddos-attack-white-line-animation-internet-bots-animated-icon-moving-lines-scaling-dots-internet.webm"
          type="video/mp4"
        />
      </video>

      {/* 📘 Definition */}
      <div className="definition-box">
        <p>
          A Distributed Denial of Service (DDoS) attack occurs when multiple
          compromised systems flood a server or website with massive traffic,
          making it unavailable to legitimate users.
        </p>
      </div>

      {/* ⚠️ Example */}
      <h2>Example</h2>

      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3608093555/preview/stock-footage-hacking-animation-library-malware-animated-white-line-icons-virus-computer-protection-threat.webm"
          type="video/mp4"
        />
      </video>

      <div className="definition-box">
        <p>
          A popular website is targeted by thousands of infected devices
          sending fake requests simultaneously. The server crashes and real
          users cannot access the site.
        </p>
      </div>

      {/* 🟢 Prevention */}
      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3604217725/preview/stock-footage-ddos-attack-for-network-security-animation.webm"
          type="video/mp4"
        />
      </video>

      <h2>Prevention</h2>

      <ul className="prevention-box">
        <li>✔ Use firewalls and DDoS protection</li>
        <li>✔ Implement rate limiting</li>
        <li>✔ Use load balancing</li>
        <li>✔ Monitor network traffic</li>
        <li>✔ Use cloud-based protection</li>
      </ul>

      {/* 🎬 Video Link */}
      <a
        className="video-link"
        href="https://www.youtube.com/watch?v=VhZxC6C2L7g"
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch Video About DDoS
      </a>

      {/* 🧠 Quiz */}
      <h2>Test Your Knowledge</h2>

      <button className="regen-btn" onClick={generateQuestions}>
        Generate New Questions
      </button>

      {loading && <h3>Generating DDoS Quiz...</h3>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <Quiz questions={questions} type="ddos" />
      )}

    </div>
  );
}

export default Ddos;