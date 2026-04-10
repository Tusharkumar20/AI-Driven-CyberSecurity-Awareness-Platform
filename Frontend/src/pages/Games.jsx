import { useState, useEffect, useCallback } from 'react'

// ═══════════════════════════════════════════════════════
// GAME DATA
// ═══════════════════════════════════════════════════════

const EMAILS = [
  { from: 'security@paypa1-secure.net', subject: '⚠️ URGENT: Your account is limited!', body: 'Dear Customer, your PayPal account has been limited due to unusual activity. Verify immediately or your account and funds will be suspended within 24 hours.', link: 'paypa1-secure-verify.net/login', isPhishing: true, clue: 'Fake domain (paypa1, not paypal), generic greeting, extreme urgency, suspicious link.' },
  { from: 'newsletter@spotify.com', subject: 'Your October Wrapped is here 🎵', body: 'Hi there! Your monthly listening stats are ready. See which artists topped your charts this month. Open the app to explore.', link: 'open.spotify.com/wrapped', isPhishing: false, clue: 'Real Spotify domain, no urgency, no credential request, personalized tone.' },
  { from: 'support@amaz0n-help.net', subject: 'Your order has been CANCELED', body: 'Your Amazon order was canceled due to payment failure. Login immediately to resolve this or lose your purchase and account standing permanently.', link: 'amaz0n-help.net/resolve', isPhishing: true, clue: 'Misspelled domain (amaz0n), false urgency, threats of permanent loss.' },
  { from: 'noreply@github.com', subject: 'New sign-in to your account', body: 'Hi, we noticed a new sign-in to your GitHub account from Chrome on Windows. If this was you, no action is needed. If not, visit your security settings.', link: 'github.com/settings/security', isPhishing: false, clue: 'Real GitHub domain, calm tone, no credential request, provides choice to ignore.' },
  { from: 'security@bank-alert-portal.com', subject: 'URGENT: Account will be CLOSED!', body: 'Suspicious transactions detected! You MUST verify your details within 12 hours or your account will be permanently closed and funds frozen.', link: 'bank-alert-portal.com/verify', isPhishing: true, clue: 'Not a real bank domain, extreme urgency, threats of freezing funds — classic manipulation.' },
  { from: 'no-reply@notion.so', subject: 'Priya shared a doc with you', body: 'Priya Patel shared "Q4 Planning Doc" with you. Open it in Notion to view and collaborate on the file.', link: 'notion.so/shared/q4-planning', isPhishing: false, clue: 'Real Notion domain, simple notification, no urgency, no credentials requested.' },
  { from: 'hr@payroll-update.company-portal.net', subject: 'Update your direct deposit ASAP!', body: 'All employees must update their direct deposit information by EOD to avoid missing next paycheck. Click below to update your bank details now.', link: 'company-portal.net/payroll/update', isPhishing: true, clue: 'Suspicious subdomain, requests banking info, artificial deadline — CEO/HR fraud pattern.' },
  { from: 'no-reply@accounts.google.com', subject: 'Security alert for your account', body: 'A new sign-in was detected on your Google Account. If this was you, no action is needed. Review your security activity if you don\'t recognize this.', link: 'myaccount.google.com/security', isPhishing: false, clue: 'Real Google domain, informational only, no urgency, no password or card requested.' },
]

const WAVES = [
  { attack: '🎣 Phishing Email', defenses: ['🛡️ Antivirus', '🔍 Email Verification', '🔥 Firewall', '🔐 Encryption'], correct: '🔍 Email Verification', tip: 'Always verify the sender before clicking any links in emails.' },
  { attack: '🦠 Malware Download', defenses: ['📧 Spam Filter', '🛡️ Antivirus', '🔑 Two-Factor Auth', '🌐 VPN'], correct: '🛡️ Antivirus', tip: 'Antivirus software scans and removes malicious files before they cause damage.' },
  { attack: '💥 DDoS Flood', defenses: ['🔐 Encryption', '🛡️ Antivirus', '🔥 Firewall', '🔑 Two-Factor Auth'], correct: '🔥 Firewall', tip: 'Firewalls detect and block the flood of fake traffic from a DDoS attack.' },
  { attack: '🔒 Ransomware Strike', defenses: ['💾 Regular Backups', '🌐 VPN', '📧 Spam Filter', '🔍 Email Check'], correct: '💾 Regular Backups', tip: 'Backups let you restore your files without paying the ransom.' },
  { attack: '🕵️ Password Breach', defenses: ['🔥 Firewall', '🛡️ Antivirus', '🔑 Two-Factor Auth', '🌐 VPN'], correct: '🔑 Two-Factor Auth', tip: '2FA stops attackers cold even when they have your correct password.' },
  { attack: '📧 Mass Spam Campaign', defenses: ['🔑 2FA', '💾 Backup', '📧 Spam Filter', '🔐 Encryption'], correct: '📧 Spam Filter', tip: 'Spam filters block phishing and junk mail before it reaches your inbox.' },
  { attack: '🌐 Man-in-the-Middle', defenses: ['📧 Spam Filter', '🛡️ Antivirus', '🔥 Firewall', '🔐 Encryption'], correct: '🔐 Encryption', tip: 'Encryption scrambles data so interceptors cannot read it in transit.' },
]

const STORY = [
  {
    scene: 'You receive an email from your "IT department" saying your password expires today and must be reset via a link they provide.',
    choices: [
      { text: 'Click the link and reset your password', outcome: 'bad', feedback: '❌ Wrong! You just handed your credentials to attackers. Always verify IT requests through official channels.' },
      { text: 'Contact IT directly using the company directory', outcome: 'good', feedback: '✅ Smart! Verifying requests through an independent channel protects you from social engineering.' },
      { text: 'Ignore the email entirely', outcome: 'neutral', feedback: '⚠️ Better than clicking, but you should also report suspicious emails to your IT security team.' },
    ]
  },
  {
    scene: 'A caller claims to be from your bank, says your account is compromised, and asks you to confirm your full card number to "verify your identity".',
    choices: [
      { text: 'Provide your card number to verify', outcome: 'bad', feedback: '❌ Real banks never ask for your full card number over the phone. This is vishing — hang up!' },
      { text: 'Hang up and call the bank using the number on your card', outcome: 'good', feedback: '✅ Perfect! Always initiate the call yourself using the official number on your card.' },
      { text: 'Give only the last 4 digits', outcome: 'neutral', feedback: '⚠️ Still risky — attackers use partial info to seem legitimate on follow-up calls.' },
    ]
  },
  {
    scene: 'A USB drive labelled "Staff Salaries Q4" is found in your office parking lot. You\'re curious about its contents.',
    choices: [
      { text: "Plug it in to see what's on it", outcome: 'bad', feedback: '❌ Dangerous! This is a classic "baiting" attack. Malware installs the instant you connect it.' },
      { text: 'Hand it to the IT/security team', outcome: 'good', feedback: '✅ Exactly right. Never plug in unknown drives — report them to IT for safe analysis.' },
      { text: 'Leave it where you found it', outcome: 'neutral', feedback: '⚠️ Better than plugging it in, but someone else might. Always report suspicious devices to IT.' },
    ]
  },
  {
    scene: 'Your "CEO" messages you on WhatsApp asking you to urgently buy $500 in gift cards and send the codes. They say they\'re in a meeting and can\'t call.',
    choices: [
      { text: 'Buy the gift cards immediately to help', outcome: 'bad', feedback: '❌ This is CEO fraud (whaling). No legitimate executive ever requests gift cards.' },
      { text: 'Call the CEO directly on their known number', outcome: 'good', feedback: '✅ Always verify urgent financial requests through a separate, pre-known communication channel.' },
      { text: 'Ask for more proof via WhatsApp first', outcome: 'neutral', feedback: '⚠️ Don\'t keep engaging on the same channel — attackers can fake any response there.' },
    ]
  },
]

const TF_QUESTIONS = [
  { q: 'HTTPS means a website is completely safe to use.', answer: false, tip: 'HTTPS only encrypts the connection — phishing sites also use HTTPS.' },
  { q: 'Using the same strong password on multiple sites is acceptable.', answer: false, tip: 'If one site is breached, attackers try your password everywhere (credential stuffing).' },
  { q: 'Two-factor authentication (2FA) significantly improves security.', answer: true, tip: '2FA blocks over 99% of automated attacks even if your password is stolen.' },
  { q: 'Antivirus software alone is enough to stay fully protected online.', answer: false, tip: 'You also need safe habits, regular updates, and strong unique passwords.' },
  { q: 'Using public Wi-Fi without a VPN risks exposing your data.', answer: true, tip: 'Attackers on the same network can intercept unencrypted traffic.' },
  { q: 'Phishing attacks only arrive via email.', answer: false, tip: 'Phishing also happens via SMS (smishing), phone calls (vishing), and social media.' },
  { q: 'Clicking "Unsubscribe" on spam emails is always safe.', answer: false, tip: 'This confirms your email is active and can increase spam and phishing attempts.' },
  { q: 'Installing software updates quickly helps protect against attacks.', answer: true, tip: 'Updates patch security vulnerabilities that attackers actively exploit.' },
  { q: 'A padlock icon in the browser means a website cannot steal your data.', answer: false, tip: 'The padlock only means the connection is encrypted — not that the site is legitimate.' },
  { q: 'Ransomware can spread through email attachments.', answer: true, tip: 'Never open unexpected attachments, even from people you know.' },
  { q: 'A long passphrase like "correct-horse-battery" is weaker than "P@$$w0rd".', answer: false, tip: 'Length beats complexity. Long passphrases are both stronger and easier to remember.' },
  { q: 'Deleting an email removes it from the mail server immediately.', answer: false, tip: 'Deleted emails go to trash first and may persist on servers. Always report phishing.' },
]

// ═══════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function calcPasswordScore(pw) {
  const checks = {
    length8: pw.length >= 8,
    length12: pw.length >= 12,
    length16: pw.length >= 16,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }
  return { score: Object.values(checks).filter(Boolean).length, checks }
}

function getCrackTime(score) {
  return ['Instantly', 'A few seconds', 'Minutes', 'Hours', 'Days', 'Months', 'Years', 'Centuries+'][score] ?? 'Instantly'
}

function getStrengthInfo(score) {
  if (score <= 1) return { label: 'Very Weak', color: '#ef4444', pct: 14 }
  if (score <= 2) return { label: 'Weak', color: '#f97316', pct: 28 }
  if (score <= 3) return { label: 'Fair', color: '#eab308', pct: 44 }
  if (score <= 4) return { label: 'Moderate', color: '#84cc16', pct: 58 }
  if (score <= 5) return { label: 'Strong', color: '#22c55e', pct: 74 }
  if (score <= 6) return { label: 'Very Strong', color: '#10b981', pct: 90 }
  return { label: 'Fortress', color: '#06b6d4', pct: 100 }
}

// ═══════════════════════════════════════════════════════
// GAME 1 — Phishing or Legit?
// ═══════════════════════════════════════════════════════

function PhishingGame({ onBack }) {
  const [queue] = useState(() => shuffle(EMAILS))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(false)
  const [answered, setAnswered] = useState(false)

  const current = queue[index]

  const answer = (isPhishing) => {
    if (answered) return
    setAnswered(true)
    const correct = isPhishing === current.isPhishing
    if (correct) setScore(s => s + 1)
    setFeedback({ correct, clue: current.clue, wasPhishing: current.isPhishing })
  }

  const next = () => {
    if (index + 1 >= queue.length) { setDone(true); return }
    setIndex(i => i + 1)
    setFeedback(null)
    setAnswered(false)
  }

  const reset = () => { setIndex(0); setScore(0); setFeedback(null); setDone(false); setAnswered(false) }

  if (done) return (
    <div className="game-area">
      <div className="game-done">
        <div className="done-emoji">{score >= 6 ? '🏆' : score >= 4 ? '🥈' : '😬'}</div>
        <h2>Round Complete!</h2>
        <p className="done-score">{score} / {queue.length} correct</p>
        <p className="done-msg">{score >= 6 ? 'Excellent phishing radar! You spotted almost all of them.' : score >= 4 ? 'Good work! Keep practicing to sharpen your detection skills.' : 'Phishers are crafty — review the clues and try again!'}</p>
        <div className="done-btns">
          <button className="g-btn g-btn-primary" onClick={reset}>Play Again</button>
          <button className="g-btn g-btn-ghost" onClick={onBack}>Back to Games</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="game-area">
      <div className="game-progress-bar">
        <div className="game-progress-fill" style={{ width: `${((index) / queue.length) * 100}%` }} />
      </div>
      <div className="game-meta">
        <span className="game-q-count">Email {index + 1} of {queue.length}</span>
        <span className="game-score-badge">✅ {score}</span>
      </div>

      <div className="email-card">
        <div className="email-card-header">
          <div className="email-avatar">{current.from[0].toUpperCase()}</div>
          <div>
            <div className="email-from">{current.from}</div>
            <div className="email-subject">{current.subject}</div>
          </div>
        </div>
        <div className="email-body">{current.body}</div>
        <div className="email-link-row">
          <span className="email-link-label">Link:</span>
          <span className="email-link-url">{current.link}</span>
        </div>
      </div>

      {!feedback ? (
        <div className="phishing-btns">
          <button className="g-btn phish-btn-bad" onClick={() => answer(true)}>🎣 Phishing</button>
          <button className="g-btn phish-btn-good" onClick={() => answer(false)}>✅ Legitimate</button>
        </div>
      ) : (
        <div className={`game-feedback ${feedback.correct ? 'feedback-good' : 'feedback-bad'}`}>
          <div className="feedback-icon">{feedback.correct ? '✅' : '❌'}</div>
          <div>
            <strong>{feedback.correct ? 'Correct!' : `Wrong — it was ${feedback.wasPhishing ? 'Phishing' : 'Legitimate'}`}</strong>
            <p>{feedback.clue}</p>
          </div>
          <button className="g-btn g-btn-ghost feedback-next" onClick={next}>{index + 1 < queue.length ? 'Next →' : 'See Results'}</button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// GAME 2 — Password Fortress
// ═══════════════════════════════════════════════════════

function PasswordGame({ onBack }) {
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const { score, checks } = calcPasswordScore(pw)
  const { label, color, pct } = getStrengthInfo(pw.length === 0 ? -1 : score)
  const crackTime = getCrackTime(pw.length === 0 ? 0 : score)

  const checkItems = [
    { key: 'length8', label: 'At least 8 characters' },
    { key: 'length12', label: 'At least 12 characters' },
    { key: 'length16', label: 'At least 16 characters' },
    { key: 'upper', label: 'Uppercase letter (A–Z)' },
    { key: 'lower', label: 'Lowercase letter (a–z)' },
    { key: 'number', label: 'Number (0–9)' },
    { key: 'special', label: 'Special character (!@#$...)' },
  ]

  return (
    <div className="game-area">
      <p className="game-instruction">Type any password to see how strong it is and how long it would take to crack.</p>

      <div className="pw-card">
        <div className="pw-input-wrap">
          <input
            className="pw-input"
            type={show ? 'text' : 'password'}
            placeholder="Type a password to test..."
            value={pw}
            onChange={e => setPw(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <button className="pw-toggle" onClick={() => setShow(s => !s)}>{show ? '🙈' : '👁️'}</button>
        </div>

        <div className="pw-bar-wrap">
          <div className="pw-bar-track">
            <div className="pw-bar-fill" style={{ width: pw ? `${pct}%` : '0%', background: color }} />
          </div>
          <span className="pw-label" style={{ color: pw ? color : '#374151' }}>{pw ? label : '—'}</span>
        </div>

        <div className="pw-crack">
          <span className="crack-label">⏱ Estimated crack time:</span>
          <span className="crack-time" style={{ color: pw ? color : '#374151' }}>{pw ? crackTime : '—'}</span>
        </div>

        <ul className="pw-checklist">
          {checkItems.map(item => (
            <li key={item.key} className={`pw-check-item ${pw && checks[item.key] ? 'check-pass' : pw ? 'check-fail' : ''}`}>
              <span className="check-icon">{pw ? (checks[item.key] ? '✅' : '✗') : '○'}</span>
              {item.label}
            </li>
          ))}
        </ul>

        <div className="pw-tip">
          <span>💡</span>
          <span>Tip: A long passphrase like <em>correct-horse-battery-staple</em> is stronger and easier to remember than <em>P@$$w0rd1</em></span>
        </div>
      </div>

      <button className="g-btn g-btn-ghost" onClick={onBack}>← Back to Games</button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// GAME 3 — Spot the Red Flags
// ═══════════════════════════════════════════════════════

function SpotGame({ onBack }) {
  const [found, setFound] = useState(new Set())
  const [lastFound, setLastFound] = useState(null)
  const [done, setDone] = useState(false)
  const total = 5

  const tap = useCallback((id, label, desc) => {
    if (found.has(id)) return
    const next = new Set(found)
    next.add(id)
    setFound(next)
    setLastFound({ label, desc })
    if (next.size === total) setTimeout(() => setDone(true), 1200)
  }, [found])

  const rf = (id, label, desc) => ({
    onClick: () => tap(id, label, desc),
    className: `rf-spot${found.has(id) ? ' rf-found' : ''}`,
  })

  const reset = () => { setFound(new Set()); setLastFound(null); setDone(false) }

  return (
    <div className="game-area">
      <p className="game-instruction">🖱️ Click on every suspicious element you spot in this email. Find all <strong>{total}</strong> red flags!</p>

      <div className="rf-progress">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`rf-dot ${i < found.size ? 'rf-dot-found' : ''}`} />
        ))}
        <span className="rf-count">{found.size}/{total} found</span>
      </div>

      <div className="fake-email">
        <div className="fake-email-top">
          <div className="fe-field">
            <span className="fe-label">From:</span>
            <span {...rf('sender', '⚠️ Fake sender domain', 'paypal-secure-verify.net is NOT paypal.com — phishers use lookalike domains to deceive you.')}>
              security@paypal-secure-verify.net
            </span>
          </div>
          <div className="fe-field">
            <span className="fe-label">Subject:</span>
            <span {...rf('subject', '⚠️ Urgent subject line', 'Creating panic in the subject pressures you to act without thinking — a hallmark of phishing.')}>
              ⚠️ URGENT: Your account will be suspended in 24 hours!
            </span>
          </div>
        </div>
        <div className="fake-email-body">
          <p>
            <span {...rf('greeting', '⚠️ Generic greeting', '"Dear Customer" instead of your real name suggests this is a mass phishing campaign, not a personal message.')}>
              Dear Customer,
            </span>
          </p>
          <p>
            <span {...rf('threat', '⚠️ Threat of financial loss', 'Threatening to freeze funds or close accounts is a manipulation tactic to force quick, panicked action.')}>
              We have detected suspicious activity on your PayPal account. Failure to verify your identity within 24 hours will result in <strong>permanent account suspension</strong> and your funds being frozen.
            </span>
          </p>
          <p>To secure your account, please verify your identity immediately by clicking below:</p>
          <div className="fe-btn-wrap">
            <span {...rf('link', '⚠️ Suspicious button link', 'This button links to paypa1-verify.com — NOT paypal.com. Always inspect links before clicking.')}>
              <span className="fake-btn">Verify My Account Now →</span>
            </span>
          </div>
          <p className="fake-footer">© 2024 PayPal Security Team | paypa1-account-verify.com</p>
        </div>
      </div>

      {lastFound && !done && (
        <div className="rf-toast">
          <strong>{lastFound.label}</strong>
          <p>{lastFound.desc}</p>
        </div>
      )}

      {done && (
        <div className="game-feedback feedback-good">
          <div className="feedback-icon">🎉</div>
          <div>
            <strong>All {total} red flags found!</strong>
            <p>You have a sharp eye for phishing tactics. Stay vigilant out there!</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="g-btn g-btn-primary" onClick={reset}>Try Again</button>
            <button className="g-btn g-btn-ghost" onClick={onBack}>Back</button>
          </div>
        </div>
      )}

      {!done && <button className="g-btn g-btn-ghost" style={{ marginTop: 16 }} onClick={onBack}>← Back to Games</button>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// GAME 4 — Cyber Defense
// ═══════════════════════════════════════════════════════

function DefenseGame({ onBack }) {
  const [waves] = useState(() => shuffle(WAVES))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [done, setDone] = useState(false)

  const current = waves[index]

  const pick = (defense) => {
    if (chosen) return
    setChosen(defense)
    if (defense === current.correct) setScore(s => s + 1)
  }

  const next = () => {
    if (index + 1 >= waves.length) { setDone(true); return }
    setIndex(i => i + 1)
    setChosen(null)
  }

  const reset = () => { setIndex(0); setScore(0); setChosen(null); setDone(false) }

  if (done) return (
    <div className="game-area">
      <div className="game-done">
        <div className="done-emoji">{score >= 6 ? '🏆' : score >= 4 ? '🛡️' : '💥'}</div>
        <h2>Defense Report</h2>
        <p className="done-score">{score} / {waves.length} attacks blocked</p>
        <p className="done-msg">{score >= 6 ? 'Outstanding! Your cyber defenses held strong.' : score >= 4 ? 'Good defense. Review the attacks you missed to improve.' : 'The attackers broke through — study the defenses and try again!'}</p>
        <div className="done-btns">
          <button className="g-btn g-btn-primary" onClick={reset}>Play Again</button>
          <button className="g-btn g-btn-ghost" onClick={onBack}>Back to Games</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="game-area">
      <div className="game-progress-bar">
        <div className="game-progress-fill" style={{ width: `${(index / waves.length) * 100}%` }} />
      </div>
      <div className="game-meta">
        <span className="game-q-count">Wave {index + 1} of {waves.length}</span>
        <span className="game-score-badge">🛡️ {score}</span>
      </div>

      <div className="attack-display">
        <div className="attack-icon">{current.attack.split(' ')[0]}</div>
        <div>
          <div className="attack-incoming">Incoming attack:</div>
          <div className="attack-name">{current.attack.split(' ').slice(1).join(' ')}</div>
        </div>
      </div>

      <p className="game-instruction" style={{ marginBottom: 12 }}>Select the best defense against this attack:</p>

      <div className="defense-grid">
        {current.defenses.map(d => {
          const isCorrect = d === current.correct
          const isChosen = d === chosen
          let cls = 'defense-btn'
          if (chosen) cls += isCorrect ? ' def-correct' : isChosen ? ' def-wrong' : ' def-dim'
          return (
            <button key={d} className={cls} onClick={() => pick(d)}>{d}</button>
          )
        })}
      </div>

      {chosen && (
        <div className={`game-feedback ${chosen === current.correct ? 'feedback-good' : 'feedback-bad'}`}>
          <div className="feedback-icon">{chosen === current.correct ? '🛡️' : '💥'}</div>
          <div>
            <strong>{chosen === current.correct ? 'Attack blocked!' : 'Attack got through!'}</strong>
            <p>{current.tip}</p>
          </div>
          <button className="g-btn g-btn-ghost feedback-next" onClick={next}>{index + 1 < waves.length ? 'Next Wave →' : 'See Results'}</button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// GAME 5 — Social Engineering Story
// ═══════════════════════════════════════════════════════

function StoryGame({ onBack }) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [chosen, setChosen] = useState(null)
  const [done, setDone] = useState(false)

  const current = STORY[index]

  const choose = (choice) => {
    if (chosen) return
    setChosen(choice)
    if (choice.outcome === 'good') setScore(s => s + 2)
    else if (choice.outcome === 'neutral') setScore(s => s + 1)
  }

  const next = () => {
    if (index + 1 >= STORY.length) { setDone(true); return }
    setIndex(i => i + 1)
    setChosen(null)
  }

  const reset = () => { setIndex(0); setScore(0); setChosen(null); setDone(false) }
  const maxScore = STORY.length * 2

  if (done) return (
    <div className="game-area">
      <div className="game-done">
        <div className="done-emoji">{score >= maxScore * 0.8 ? '🕵️' : score >= maxScore * 0.5 ? '🧠' : '😵'}</div>
        <h2>Mission Complete</h2>
        <p className="done-score">{score} / {maxScore} points</p>
        <p className="done-msg">{score >= maxScore * 0.8 ? 'Elite awareness! You made the right call every time under pressure.' : score >= maxScore * 0.5 ? 'Good instincts — but social engineers are persistent. Keep practicing!' : 'Social engineers are clever. Review each scenario and try again!'}</p>
        <div className="done-btns">
          <button className="g-btn g-btn-primary" onClick={reset}>Play Again</button>
          <button className="g-btn g-btn-ghost" onClick={onBack}>Back to Games</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="game-area">
      <div className="game-progress-bar">
        <div className="game-progress-fill" style={{ width: `${(index / STORY.length) * 100}%` }} />
      </div>
      <div className="game-meta">
        <span className="game-q-count">Scenario {index + 1} of {STORY.length}</span>
        <span className="game-score-badge">⭐ {score}</span>
      </div>

      <div className="story-scene">
        <div className="story-icon">🎭</div>
        <p className="story-text">{current.scene}</p>
      </div>

      <p className="game-instruction" style={{ marginBottom: 12 }}>What do you do?</p>

      <div className="story-choices">
        {current.choices.map((c, i) => {
          let cls = 'story-choice'
          if (chosen) {
            if (c === chosen) cls += c.outcome === 'good' ? ' choice-good' : c.outcome === 'neutral' ? ' choice-neutral' : ' choice-bad'
            else cls += ' choice-dim'
          }
          return (
            <button key={i} className={cls} onClick={() => choose(c)}>
              <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
              {c.text}
            </button>
          )
        })}
      </div>

      {chosen && (
        <div className={`game-feedback ${chosen.outcome === 'good' ? 'feedback-good' : chosen.outcome === 'neutral' ? 'feedback-neutral' : 'feedback-bad'}`}>
          <div className="feedback-icon">{chosen.outcome === 'good' ? '✅' : chosen.outcome === 'neutral' ? '⚠️' : '❌'}</div>
          <div>
            <p>{chosen.feedback}</p>
          </div>
          <button className="g-btn g-btn-ghost feedback-next" onClick={next}>{index + 1 < STORY.length ? 'Next Scenario →' : 'See Results'}</button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// GAME 6 — True or False Blitz
// ═══════════════════════════════════════════════════════

const BLITZ_TIME = 10

function BlitzGame({ onBack }) {
  const [questions] = useState(() => shuffle(TF_QUESTIONS))
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(BLITZ_TIME)
  const [answered, setAnswered] = useState(null)
  const [done, setDone] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (answered !== null || done) return
    if (timeLeft <= 0) {
      setTimedOut(true)
      setAnswered('timeout')
      setStreak(0)
      return
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, answered, done])

  const answer = (val) => {
    if (answered !== null) return
    const correct = val === questions[index].answer
    setAnswered(val)
    setTimedOut(false)
    if (correct) {
      setScore(s => s + 1)
      setStreak(s => {
        const next = s + 1
        setBestStreak(b => Math.max(b, next))
        return next
      })
    } else {
      setStreak(0)
    }
  }

  const next = () => {
    if (index + 1 >= questions.length) { setDone(true); return }
    setIndex(i => i + 1)
    setAnswered(null)
    setTimedOut(false)
    setTimeLeft(BLITZ_TIME)
  }

  const reset = () => { setIndex(0); setScore(0); setStreak(0); setBestStreak(0); setTimeLeft(BLITZ_TIME); setAnswered(null); setDone(false); setTimedOut(false) }

  const timerPct = (timeLeft / BLITZ_TIME) * 100
  const timerColor = timeLeft > 6 ? '#22c55e' : timeLeft > 3 ? '#eab308' : '#ef4444'
  const current = questions[index]

  if (done) return (
    <div className="game-area">
      <div className="game-done">
        <div className="done-emoji">{score >= 10 ? '🏆' : score >= 7 ? '⚡' : '🧪'}</div>
        <h2>Blitz Complete!</h2>
        <p className="done-score">{score} / {questions.length} correct</p>
        <div className="done-stats">
          <div className="done-stat"><span>🔥</span><strong>{bestStreak}</strong><small>Best Streak</small></div>
          <div className="done-stat"><span>⚡</span><strong>{Math.round((score / questions.length) * 100)}%</strong><small>Accuracy</small></div>
        </div>
        <p className="done-msg">{score >= 10 ? 'Perfect knowledge! You are a cyber awareness expert.' : score >= 7 ? 'Great score — just a few myths to clear up.' : 'Study the tips and try again to beat your streak!'}</p>
        <div className="done-btns">
          <button className="g-btn g-btn-primary" onClick={reset}>Play Again</button>
          <button className="g-btn g-btn-ghost" onClick={onBack}>Back to Games</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="game-area">
      <div className="game-meta">
        <span className="game-q-count">Q{index + 1}/{questions.length}</span>
        <span className="game-score-badge">🔥 {streak} streak &nbsp; ✅ {score}</span>
      </div>

      <div className="blitz-timer-wrap">
        <div className="blitz-timer-track">
          <div className="blitz-timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
        <span className="blitz-timer-num" style={{ color: timerColor }}>{timeLeft}s</span>
      </div>

      <div className="blitz-question">
        <div className="blitz-q-text">{current.q}</div>
      </div>

      <div className="blitz-btns">
        <button
          className={`blitz-btn blitz-true ${answered !== null ? (current.answer === true ? 'blitz-correct' : answered === true ? 'blitz-wrong' : 'blitz-dim') : ''}`}
          onClick={() => answer(true)}
          disabled={answered !== null}
        >✅ True</button>
        <button
          className={`blitz-btn blitz-false ${answered !== null ? (current.answer === false ? 'blitz-correct' : answered === false ? 'blitz-wrong' : 'blitz-dim') : ''}`}
          onClick={() => answer(false)}
          disabled={answered !== null}
        >❌ False</button>
      </div>

      {answered !== null && (
        <div className={`game-feedback ${timedOut ? 'feedback-bad' : answered === current.answer ? 'feedback-good' : 'feedback-bad'}`}>
          <div className="feedback-icon">{timedOut ? '⏰' : answered === current.answer ? '✅' : '❌'}</div>
          <div>
            <strong>{timedOut ? 'Time\'s up!' : answered === current.answer ? 'Correct!' : `Wrong — the answer is ${current.answer ? 'True' : 'False'}`}</strong>
            <p>{current.tip}</p>
          </div>
          <button className="g-btn g-btn-ghost feedback-next" onClick={next}>{index + 1 < questions.length ? 'Next →' : 'See Results'}</button>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// GAME CARDS LOBBY
// ═══════════════════════════════════════════════════════

const GAME_LIST = [
  { id: 'phishing', icon: '🎣', title: 'Phishing or Legit?', desc: 'Judge real-looking emails — is it a phishing attempt or the genuine article?', difficulty: 'Medium', color: '#f97316', players: '8 emails' },
  { id: 'password', icon: '🔑', title: 'Password Fortress', desc: 'Test your passwords live and see exactly how long they would take to crack.', difficulty: 'Easy', color: '#22c55e', players: 'Sandbox' },
  { id: 'spot', icon: '🚩', title: 'Spot the Red Flags', desc: 'Find every suspicious element hidden inside a fake phishing email.', difficulty: 'Hard', color: '#ef4444', players: '5 flags' },
  { id: 'defense', icon: '🛡️', title: 'Cyber Defense', desc: 'Attacks are incoming! Pick the right tool to block each one before it breaks through.', difficulty: 'Medium', color: '#6366f1', players: '7 waves' },
  { id: 'story', icon: '🎭', title: 'Social Engineering', desc: 'A branching scenario game — make the right choices or get compromised.', difficulty: 'Hard', color: '#ec4899', players: '4 scenarios' },
  { id: 'blitz', icon: '⚡', title: 'True or False Blitz', desc: 'Answer 12 rapid-fire cybersecurity questions before the 10-second timer runs out.', difficulty: 'Medium', color: '#eab308', players: '12 questions' },
]

const DIFF_COLOR = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' }

function GameCard({ game, onPlay }) {
  return (
    <div className="game-card" style={{ '--gc': game.color }} onClick={() => onPlay(game.id)}>
      <div className="gc-icon">{game.icon}</div>
      <div className="gc-body">
        <div className="gc-title">{game.title}</div>
        <div className="gc-desc">{game.desc}</div>
        <div className="gc-footer">
          <span className="gc-diff" style={{ color: DIFF_COLOR[game.difficulty] }}>{game.difficulty}</span>
          <span className="gc-players">{game.players}</span>
          <span className="gc-play">Play →</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════

const GAME_COMPONENTS = {
  phishing: PhishingGame,
  password: PasswordGame,
  spot: SpotGame,
  defense: DefenseGame,
  story: StoryGame,
  blitz: BlitzGame,
}

export default function Games() {
  const [activeGame, setActiveGame] = useState(null)
  const activeMeta = GAME_LIST.find(g => g.id === activeGame)
  const ActiveComponent = activeGame ? GAME_COMPONENTS[activeGame] : null

  return (
    <div className="games-page">
      <div className="games-hero">
        <h1 className="games-title">🎮 Cyber Games</h1>
        <p className="games-subtitle">Learn cybersecurity the fun way — play games, earn knowledge, stay safe.</p>
      </div>

      {!activeGame ? (
        <div className="games-grid">
          {GAME_LIST.map(game => (
            <GameCard key={game.id} game={game} onPlay={setActiveGame} />
          ))}
        </div>
      ) : (
        <div className="game-container">
          <div className="game-header">
            <button className="g-btn g-btn-ghost" onClick={() => setActiveGame(null)}>← All Games</button>
            <div className="game-title-wrap">
              <span>{activeMeta.icon}</span>
              <span>{activeMeta.title}</span>
            </div>
          </div>
          <ActiveComponent onBack={() => setActiveGame(null)} />
        </div>
      )}
    </div>
  )
}
