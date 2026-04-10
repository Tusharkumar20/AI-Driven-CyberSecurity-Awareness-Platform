import { useState, useRef, useEffect } from 'react'

const SYSTEM_PROMPT = `You are CyberGuard, an expert AI cybersecurity assistant for the CyberSafe awareness platform.
You help users understand cyber threats including phishing, malware, ransomware, and DDoS attacks.
Provide clear, concise, and actionable cybersecurity advice. Keep responses to 2-4 sentences.
Use simple language that non-technical users can understand.
If asked about non-security topics, gently redirect the conversation to cybersecurity.`

const SUGGESTED = [
  'What is phishing?',
  'How does ransomware work?',
  'How can I stay safe online?',
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm CyberGuard 🛡️ Your AI cybersecurity assistant. Ask me anything about phishing, malware, ransomware, DDoS attacks, or how to stay safe online!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggested, setShowSuggested] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return

    setShowSuggested(false)
    setInput('')
    const userMsg = { role: 'user', content }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          max_tokens: 250,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        }),
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not get a response. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm CyberGuard 🛡️ Your AI cybersecurity assistant. Ask me anything about phishing, malware, ransomware, DDoS attacks, or how to stay safe online!",
    }])
    setShowSuggested(true)
  }

  return (
    <>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">🛡️</div>
              <div>
                <div className="chatbot-name">CyberGuard AI</div>
                <div className="chatbot-status">● Online</div>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button className="chatbot-action-btn" onClick={clearChat} title="Clear chat">↺</button>
              <button className="chatbot-action-btn" onClick={() => setOpen(false)} title="Close">✕</button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="msg-avatar">🛡️</div>
                )}
                <div className="msg-bubble">{msg.content}</div>
              </div>
            ))}

            {showSuggested && (
              <div className="chatbot-suggested">
                {SUGGESTED.map(s => (
                  <button key={s} className="suggested-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="chatbot-msg assistant">
                <div className="msg-avatar">🛡️</div>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              ref={inputRef}
              className="chatbot-input"
              placeholder="Ask about cyber threats..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="chatbot-send"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        className={`chatbot-fab ${open ? 'fab-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle CyberGuard AI"
      >
        {open ? '✕' : '💬'}
        {!open && <span className="fab-pulse" />}
      </button>
    </>
  )
}
