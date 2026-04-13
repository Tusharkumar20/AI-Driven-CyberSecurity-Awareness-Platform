import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const KB = [
  {
    tags: ['phishing', 'phish', 'fake email', 'suspicious email', 'scam email', 'spam'],
    response: `🪝 **Phishing** is when attackers send fake emails or messages pretending to be trusted sources to steal your credentials or personal info.\n\n**Red flags to watch for:**\n• Urgent language ("Act now or your account will be closed!")\n• Misspelled sender domains (support@paypa1.com)\n• Generic greetings ("Dear Customer")\n• Suspicious links — hover before clicking\n• Unexpected attachments\n\nNever click links in unsolicited emails. Go directly to the website instead. Want to learn more? Head to the [Phishing page](/phishing).`,
    nav: '/phishing',
  },
  {
    tags: ['malware', 'virus', 'trojan', 'spyware', 'worm', 'infected', 'malicious software'],
    response: `☣️ **Malware** is malicious software designed to damage, disrupt, or gain unauthorized access to your systems.\n\n**Common types:**\n• **Virus** — attaches to files and spreads\n• **Trojan** — disguises itself as legitimate software\n• **Spyware** — secretly monitors your activity\n• **Worm** — self-replicates across networks\n\n**How to stay safe:**\n• Keep your OS and apps updated\n• Use reputable antivirus software\n• Don't download software from untrusted sources\n• Avoid pirated content\n\nVisit the [Malware page](/malware) to explore more.`,
    nav: '/malware',
  },
  {
    tags: ['ransomware', 'ransom', 'encrypted files', 'decrypt', 'hostage'],
    response: `🔐 **Ransomware** encrypts your files and demands payment (usually in cryptocurrency) for the decryption key.\n\n**What to do if hit:**\n• Disconnect from the internet immediately\n• Do NOT pay the ransom — it doesn't guarantee recovery\n• Report to authorities (FBI IC3, local law enforcement)\n• Restore from clean backups\n\n**Prevention:**\n• Maintain regular offline backups\n• Keep software patched and updated\n• Use email filtering\n• Restrict admin privileges\n\nLearn more on the [Ransomware page](/ransomware).`,
    nav: '/ransomware',
  },
  {
    tags: ['ddos', 'dos', 'denial of service', 'distributed attack', 'server down', 'flood attack'],
    response: `⚡ **DDoS (Distributed Denial of Service)** attacks flood servers with massive traffic to make services unavailable to real users.\n\n**How it works:**\n• Attackers control a botnet (thousands of compromised devices)\n• They direct all bots to overwhelm a target server\n• Legitimate users are unable to connect\n\n**Protection methods:**\n• Use a CDN with DDoS protection (Cloudflare, AWS Shield)\n• Rate limiting on your servers\n• Traffic analysis and anomaly detection\n• Incident response plan\n\nVisit the [DDoS page](/ddos) to learn more.`,
    nav: '/ddos',
  },
  {
    tags: ['password', 'strong password', 'weak password', 'credential', 'passphrase'],
    response: `🔑 **Strong Password Tips:**\n\n• Use at least **12–16 characters**\n• Mix uppercase, lowercase, numbers, and symbols\n• Avoid dictionary words, names, or dates\n• Use a **passphrase**: "Coffee#Mountain$Rain9" is strong and memorable\n• Never reuse passwords across sites\n• Use a **password manager** (Bitwarden, 1Password, etc.)\n\n💡 **Tip:** Type "check password" and I'll analyze its strength for you!`,
  },
  {
    tags: ['two factor', '2fa', 'mfa', 'multi factor', 'authenticator', 'otp', 'verification code'],
    response: `🛡️ **Two-Factor Authentication (2FA)** adds a second layer of security beyond your password.\n\n**Types (ranked best to worst):**\n1. **Hardware key** (YubiKey) — most secure\n2. **Authenticator app** (Google Authenticator, Authy) — highly secure\n3. **Push notification** — convenient and secure\n4. **SMS/text code** — better than nothing, but vulnerable to SIM swapping\n\n**Always enable 2FA** on your email, banking, and social media accounts. Even if your password is stolen, attackers can't get in without the second factor.`,
  },
  {
    tags: ['vpn', 'virtual private network', 'public wifi', 'encrypt traffic', 'anonymous'],
    response: `🌐 **VPN (Virtual Private Network)** encrypts your internet traffic and hides your IP address.\n\n**When to use a VPN:**\n• On public Wi-Fi (cafes, airports, hotels)\n• To protect your browsing from your ISP\n• To access geo-restricted content\n\n**Choosing a VPN:**\n• Look for a strict **no-logs policy**\n• Prefer open-source or independently audited VPNs\n• Reputable options: ProtonVPN, Mullvad, ExpressVPN\n• Avoid free VPNs — they often sell your data\n\n⚠️ A VPN does NOT make you anonymous or protect against malware.`,
  },
  {
    tags: ['social engineering', 'manipulation', 'pretexting', 'vishing', 'smishing', 'baiting'],
    response: `🎭 **Social Engineering** manipulates people into revealing confidential information or performing actions that compromise security.\n\n**Common tactics:**\n• **Pretexting** — creating a fake scenario ("I'm from IT support")\n• **Vishing** — voice phishing over the phone\n• **Smishing** — SMS-based phishing\n• **Baiting** — leaving infected USB drives in parking lots\n• **Tailgating** — physically following someone into a secure area\n\n**Defense:** Verify identities independently. When in doubt, hang up and call the official number. No legitimate company will pressure you for immediate action.`,
  },
  {
    tags: ['data breach', 'leaked data', 'have i been pwned', 'my data leaked', 'account compromised'],
    response: `📊 **Data Breach — What to Do:**\n\n1. **Check if you're affected** — visit haveibeenpwned.com and enter your email\n2. **Change your password** on the breached service immediately\n3. **Change passwords** on any other accounts using the same password\n4. **Enable 2FA** on all important accounts\n5. **Monitor** your bank/credit statements for suspicious activity\n6. **Consider** a credit freeze if financial data was exposed\n\n⚠️ Be wary of fake "breach notification" emails — they're often phishing attempts!`,
  },
  {
    tags: ['firewall', 'network security', 'intrusion detection', 'ids', 'ips'],
    response: `🔥 **Firewalls** monitor and control incoming/outgoing network traffic based on security rules.\n\n**Types:**\n• **Packet filtering** — inspects packets at network level\n• **Stateful inspection** — tracks connection state\n• **Application layer** — inspects traffic at the application level (WAF)\n• **Next-gen firewall (NGFW)** — combines all above with deep packet inspection\n\n**Best practices:**\n• Enable your OS firewall (Windows Defender Firewall, macOS Firewall)\n• Block all unused ports\n• Use allowlist over blocklist where possible\n• Log and monitor firewall events`,
  },
  {
    tags: ['encryption', 'https', 'ssl', 'tls', 'end to end', 'encrypt'],
    response: `🔒 **Encryption** converts data into an unreadable format that only authorized parties can decode.\n\n**Key types:**\n• **HTTPS/TLS** — protects data in transit (look for 🔒 in your browser)\n• **End-to-end encryption (E2EE)** — only sender and recipient can read messages (Signal, WhatsApp)\n• **Full-disk encryption** — protects data at rest (BitLocker, FileVault)\n\n**Quick tips:**\n• Always use HTTPS websites — never enter sensitive info on HTTP\n• Use Signal or similar E2EE apps for sensitive conversations\n• Enable full-disk encryption on your laptop`,
  },
  {
    tags: ['update', 'patch', 'software update', 'outdated software', 'vulnerability'],
    response: `🔄 **Keeping Software Updated** is one of the most effective security measures.\n\n**Why it matters:**\n• 60% of breaches exploit known vulnerabilities that had patches available\n• Zero-days get patched quickly once discovered\n• Outdated software is a top attack vector\n\n**Best practices:**\n• Enable **automatic updates** on your OS, browser, and apps\n• Prioritize security patches\n• Update router firmware regularly\n• Remove software you no longer use\n\n💡 Set a monthly reminder to check for updates on devices that don't auto-update.`,
  },
  {
    tags: ['safe browsing', 'browser security', 'extensions', 'cookies', 'tracking'],
    response: `🌐 **Safe Browsing Tips:**\n\n• Use a privacy-focused browser (Firefox, Brave) or harden Chrome\n• Install **uBlock Origin** to block ads and malicious scripts\n• Look for **HTTPS** before entering any sensitive info\n• Clear cookies and cache regularly\n• Use **private/incognito mode** on shared computers\n• Disable unnecessary browser extensions — they can access your data\n• Use **DNS over HTTPS** (Cloudflare 1.1.1.1 or Google 8.8.8.8)\n\n⚠️ Never save passwords in your browser on shared or public computers.`,
  },
  {
    tags: ['backup', 'data recovery', 'backup strategy', '3-2-1'],
    response: `💾 **Backup Strategy — The 3-2-1 Rule:**\n\n• **3** copies of your data\n• **2** different storage types (e.g., local drive + cloud)\n• **1** offsite backup (different physical location)\n\n**Tips:**\n• Automate backups — don't rely on remembering\n• Test your backups periodically (can you actually restore?)\n• Keep at least one backup **offline** (disconnected from network) to protect against ransomware\n• Encrypt your backups\n\nRecommended tools: Time Machine (Mac), Windows Backup, Backblaze, Acronis`,
  },
  {
    tags: ['hello', 'hi', 'hey', 'help', 'start', 'what can you do'],
    response: `👋 Hi! I'm **CyberGuard**, your cyber awareness assistant.\n\nI can help you with:\n\n🛡️ **Cyber Threats** — Phishing, Malware, Ransomware, DDoS\n🔐 **Security Practices** — Passwords, 2FA, VPN, Encryption\n🌐 **Safe Browsing** — Browser security, safe habits\n📊 **Incident Response** — Data breaches, ransomware recovery\n🔧 **Basic Tasks** — Password strength checker, phishing email analyzer\n\nTry asking me anything like:\n• "How do I spot phishing?"\n• "Check my password: MyPass123"\n• "Is this email suspicious: [paste email text]"\n• "What is ransomware?"`,
  },
  {
    tags: ['thank', 'thanks', 'thank you', 'great', 'helpful', 'awesome'],
    response: `😊 You're welcome! Stay safe out there. Remember:\n\n• 🔑 Use strong, unique passwords\n• 🛡️ Enable 2FA everywhere\n• 🔄 Keep software updated\n• 🤔 Think before you click\n\nFeel free to ask me anything else about cybersecurity!`,
  },
]

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
  { pattern: /unsubscribe|you received this|this email was sent to/i, label: 'Unsolicited bulk email markers', severity: 'low' },
]

function analyzePhishing(text) {
  const found = PHISHING_SIGNALS.filter(s => s.pattern.test(text))
  const high = found.filter(f => f.severity === 'high').length
  const medium = found.filter(f => f.severity === 'medium').length

  let risk = 'Low'
  let emoji = '✅'
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

  return { checks, score, strength }
}

function getResponse(input) {
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

    return `🔑 **Password Strength: ${strength}**\n\n${tips.length ? '**Improvements needed:**\n' + tips.join('\n') : '✅ Your password looks solid! Remember to use a unique password for each account and store it in a password manager.'}`
  }

  if (/analyze (email|message|text)|is this (email|message) (phishing|suspicious|safe)|check (this )?(email|message)/i.test(lower)) {
    return `📧 **Phishing Email Analyzer**\n\nPaste the email or message text you want to analyze and start your message with:\n\n**"analyze:"** followed by the text\n\nExample: "analyze: Dear customer, your account has been suspended. Click here to verify immediately."`
  }

  if (/^analyze[:\s]+(.+)/i.test(input)) {
    const text = input.replace(/^analyze[:\s]+/i, '').trim()
    if (text.length < 10) return "Please paste the full email or message text after 'analyze:' so I can check it properly."
    const { found, risk, emoji } = analyzePhishing(text)

    if (found.length === 0) {
      return `${emoji} **Risk Level: Low**\n\nNo obvious phishing signals detected in this text. However, always:\n• Verify the sender's email address directly\n• Don't click links — navigate to the site manually\n• When in doubt, contact the company through official channels`
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
    return `🎲 **Generated Strong Password:**\n\n\`${pwd}\`\n\n✅ 16 characters • Uppercase • Lowercase • Numbers • Symbols\n\n⚠️ Save this in a **password manager** (Bitwarden, 1Password) — don't write it on paper or store it in plain text.`
  }

  if (/what (is|are) (a )?(cyber|cybersecurity|information security|infosec)/i.test(lower)) {
    return `🔐 **Cybersecurity** is the practice of protecting systems, networks, and data from digital attacks, unauthorized access, and damage.\n\n**Core pillars (CIA Triad):**\n• **Confidentiality** — only authorized users can access data\n• **Integrity** — data is accurate and hasn't been tampered with\n• **Availability** — systems and data are accessible when needed\n\n**This platform covers:**\n• 🪝 Phishing attacks\n• ☣️ Malware\n• 🔐 Ransomware\n• ⚡ DDoS attacks\n\nExplore the threat modules to build your cyber skills!`
  }

  for (const entry of KB) {
    if (entry.tags.some(tag => lower.includes(tag))) {
      return entry.response
    }
  }

  return `🤔 I'm not sure about that specific question, but I can help with:\n\n• **Threats:** phishing, malware, ransomware, DDoS, social engineering\n• **Protection:** passwords, 2FA, VPN, encryption, backups, updates\n• **Tasks:** "check password YourPassword", "analyze: [paste email text]", "generate password"\n• **Incidents:** data breaches, ransomware recovery\n\nTry rephrasing your question or pick one of the topics above!`
}

const SUGGESTED = [
  'How do I spot phishing?',
  'What is ransomware?',
  'Check password: MyPass123',
  'Generate a strong password',
  'What is 2FA?',
  'Safe browsing tips',
]

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm **CyberGuard** — your cyber awareness assistant!\n\nI can help you understand cyber threats, best security practices, and I can even analyze suspicious emails or check password strength.\n\nWhat would you like to know?`,
    },
  ])
  const [input, setInput] = useState('')
  const [showSuggested, setShowSuggested] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = (text) => {
    const content = (text || input).trim()
    if (!content) return

    setShowSuggested(false)
    setInput('')

    const userMsg = { role: 'user', content }
    const reply = getResponse(content)

    const navMatch = KB.find(e => e.tags.some(t => content.toLowerCase().includes(t)) && e.nav)

    setMessages(prev => {
      const next = [...prev, userMsg, { role: 'assistant', content: reply }]
      if (navMatch) {
        setTimeout(() => {
          setMessages(m => [...m, {
            role: 'assistant',
            content: `📚 Want to dive deeper? I can take you to the **${navMatch.nav.replace('/', '').replace(/^\w/, c => c.toUpperCase())}** page.`,
            navAction: navMatch.nav,
            navLabel: navMatch.nav.replace('/', '').replace(/^\w/, c => c.toUpperCase()) + ' Page',
          }])
        }, 400)
      }
      return next
    })
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
      content: `👋 Hi! I'm **CyberGuard** — your cyber awareness assistant!\n\nI can help you understand cyber threats, best security practices, and I can even analyze suspicious emails or check password strength.\n\nWhat would you like to know?`,
    }])
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
    if (nav) {
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
                {msg.role === 'assistant' && <div className="msg-avatar">🛡️</div>}
                <div className="msg-bubble">
                  <span
                    dangerouslySetInnerHTML={{ __html: renderText(msg.content) }}
                    onClick={handleMsgClick}
                  />
                  {msg.navAction && (
                    <button
                      onClick={() => { setOpen(false); navigate(msg.navAction) }}
                      style={{
                        display: 'block',
                        marginTop: '10px',
                        padding: '6px 14px',
                        background: 'rgba(34,197,94,0.15)',
                        border: '1px solid rgba(34,197,94,0.4)',
                        borderRadius: '6px',
                        color: '#22c55e',
                        cursor: 'pointer',
                        fontSize: '0.82em',
                        fontWeight: 600,
                      }}
                    >
                      Go to {msg.navLabel} →
                    </button>
                  )}
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

            <div ref={bottomRef} />
          </div>

          <div className="chatbot-input-row">
            <input
              ref={inputRef}
              className="chatbot-input"
              placeholder='Ask anything, or "check password …"'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="chatbot-send"
              onClick={() => send()}
              disabled={!input.trim()}
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
