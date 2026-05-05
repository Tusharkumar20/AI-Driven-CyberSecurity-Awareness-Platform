import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PHISHING_SIGNALS = [
  { pattern: /urgent|immediately|act now|expires today|within 24 hours|limited time/i, label: 'Urgency language', severity: 'high' },
  { pattern: /verify your account|confirm your (identity|email|password|details)/i, label: 'Account verification request', severity: 'high' },
  { pattern: /click here|click the link below|follow this link/i, label: 'Generic "click here" link', severity: 'medium' },
  { pattern: /dear (customer|user|member|sir|madam|friend)/i, label: 'Generic greeting', severity: 'medium' },
  { pattern: /suspended|disabled|locked|unusual activity|security alert/i, label: 'Fear/threat language', severity: 'high' },
  { pattern: /free (gift|iphone|prize|money|reward)/i, label: 'Too-good-to-be-true offer', severity: 'high' },
  { pattern: /password|username|ssn|social security|credit card|bank account/i, label: 'Requests sensitive info', severity: 'high' },
  { pattern: /\b(paypa1|arnazon|g00gle|micros0ft|app1e)\b/i, label: 'Misspelled brand name', severity: 'high' },
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/i, label: 'URL shortener (hides real destination)', severity: 'medium' },
]

function analyzePhishing(text) {
  const found = PHISHING_SIGNALS.filter(s => s.pattern.test(text))
  const high = found.filter(f => f.severity === 'high').length
  const medium = found.filter(f => f.severity === 'medium').length
  let risk = 'Low'; let emoji = '✅'
  if (high >= 2 || (high >= 1 && medium >= 1)) { risk = 'High'; emoji = '🚨' }
  else if (high === 1 || medium >= 2) { risk = 'Medium'; emoji = '⚠️' }
  return { found, risk, emoji }
}

function checkPassword(password) {
  const checks = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    noCommon: !/^(password|123456|qwerty|abc123|letmein|monkey|dragon)/i.test(password),
  }
  const score = Object.values(checks).filter(Boolean).length
  let strength = 'Weak 🔴'
  if (score >= 6) strength = 'Very Strong 🟢'
  else if (score >= 5) strength = 'Strong 🟡'
  else if (score >= 4) strength = 'Moderate 🟠'
  return { checks, strength }
}

function handleLocalCommand(input) {
  const lower = input.toLowerCase().trim()

  if (/^check password[:\s]+(.+)/i.test(input)) {
    const pwd = input.replace(/^check password[:\s]+/i, '').trim()
    if (!pwd) return "Please provide a password to check. Example: `check password MySecretPass123!`"
    const { checks, strength } = checkPassword(pwd)
    const tips = []
    if (!checks.length) tips.push('• Use at least 12 characters')
    if (!checks.uppercase) tips.push('• Add uppercase letters (A-Z)')
    if (!checks.lowercase) tips.push('• Add lowercase letters (a-z)')
    if (!checks.number) tips.push('• Add numbers (0-9)')
    if (!checks.symbol) tips.push('• Add symbols (!@#$%^&*)')
    if (!checks.noCommon) tips.push('• Avoid common/dictionary words')
    return `🔑 **Password Strength: ${strength}**\n\n${tips.length ? '**Improvements needed:**\n' + tips.join('\n') : '✅ Your password looks solid! Store it in a password manager and never reuse it.'}`
  }

  if (/^analyze[:\s]+(.+)/i.test(input)) {
    const text = input.replace(/^analyze[:\s]+/i, '').trim()
    if (text.length < 10) return "Please paste the full email or message text after 'analyze:' so I can check it properly."
    const { found, risk, emoji } = analyzePhishing(text)
    if (found.length === 0) {
      return `${emoji} **Risk Level: Low**\n\nNo obvious phishing signals detected. Always verify the sender's address directly and navigate to sites manually rather than clicking links.`
    }
    const signals = found.map(f => `• **${f.label}** (${f.severity} risk)`).join('\n')
    return `${emoji} **Risk Level: ${risk}**\n\n**Phishing signals detected:**\n${signals}\n\n**Recommendation:** ${risk === 'High' ? 'Do NOT interact with this message. Report it as phishing and delete it.' : 'Treat with caution. Verify the sender through official channels before taking any action.'}`
  }

  if (/generate password|create password|random password|suggest password/i.test(lower)) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*-_=+'
    let pwd = ''
    const arr = new Uint32Array(16)
    crypto.getRandomValues(arr)
    arr.forEach(v => { pwd += chars[v % chars.length] })
    return `🎲 **Generated Strong Password:**\n\n\`${pwd}\`\n\n✅ 16 characters • Uppercase • Lowercase • Numbers • Symbols\n\n⚠️ Save this in a **password manager** — never store it in plain text.`
  }

  return null
}

const SUGGESTED = [
  'How do I spot phishing?',
  'What is ransomware?',
  'Check password: MyPass123!',
  'Generate a strong password',
  'What is 2FA?',
  'Analyze: Dear customer, your account is suspended. Click here now.',
]

const WELCOME = `👋 Hi! I'm **CyberGuard** — your AI-powered cyber awareness assistant!\n\nI can answer questions about cybersecurity, analyze suspicious emails, check password strength, and more — all\n\nWhat would you like to know?`

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggested, setShowSuggested] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

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

    const local = handleLocalCommand(content)
    if (local) {
      setMessages(prev => [
        ...prev,
        { role: 'user', content },
        { role: 'assistant', content: local },
      ])
      return
    }

    const userMsg = { role: 'user', content }
    const history = [...messages, userMsg]
    setMessages(history)
    setLoading(true)

    try {
      const apiHistory = history
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error || 'Something went wrong. Please try again.'}` }])
        return
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('Chatbot error:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Connection error. Please check your connection and try again.' }])
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
    setMessages([{ role: 'assistant', content: WELCOME }])
    setShowSuggested(true)
  }

  const renderText = (text) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code style="background:rgba(34,197,94,0.15);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#22c55e;text-decoration:underline;cursor:pointer" data-nav="$2">$1</a>')
      .split('\n')
      .map(line => `<span>${line}</span>`)
      .join('<br/>')
  }

  const handleMsgClick = (e) => {
    const nav = e.target.dataset?.nav
    if (nav && nav.startsWith('/')) {
      e.preventDefault()
      setOpen(false)
      navigate(nav)
    }
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
                {msg.role === 'assistant' && <div className="msg-avatar">🛡️</div>}
                <div className="msg-bubble">
                  <span
                    dangerouslySetInnerHTML={{ __html: renderText(msg.content) }}
                    onClick={handleMsgClick}
                  />
                </div>
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
              placeholder='Ask anything about cybersecurity…'
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
