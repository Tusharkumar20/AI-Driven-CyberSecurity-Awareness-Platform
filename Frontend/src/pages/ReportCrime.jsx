import { useState } from 'react'

const STEPS = [
  {
    icon: '🧘',
    title: 'Stay Calm & Act Quickly',
    desc: 'Do not panic. Cybercrime can be addressed — the sooner you report, the better the chance of recovery. Avoid making impulsive decisions like paying ransoms or deleting evidence.',
  },
  {
    icon: '📸',
    title: 'Document Everything',
    desc: 'Take screenshots of suspicious messages, emails, websites, transactions, or any content related to the crime. Note the date, time, and any usernames or URLs involved.',
  },
  {
    icon: '🗂️',
    title: 'Preserve All Evidence',
    desc: 'Do NOT delete emails, messages, or files — they are crucial evidence. Save all communications and keep original copies. Avoid reformatting devices or changing passwords until advised.',
  },
  {
    icon: '🏦',
    title: 'Contact Your Bank Immediately',
    desc: 'If financial fraud is involved, call your bank or card provider right away to freeze transactions, reverse charges, or flag your account. Time is critical for recovering stolen funds.',
  },
  {
    icon: '🚔',
    title: 'File a Local Police Report',
    desc: 'Visit or contact your local police station to file an official cybercrime report. Ask for a crime reference number — you will need it for insurance claims and follow-up investigations.',
  },
  {
    icon: '🌐',
    title: 'Report to National Cybercrime Authority',
    desc: 'Submit a detailed report to your country\'s dedicated cybercrime agency (listed below). Include all evidence: screenshots, emails, transaction records, and any communication with the attacker.',
  },
  {
    icon: '📢',
    title: 'Report to the Platform Involved',
    desc: 'Report the incident to the relevant platform (Google, Facebook, your email provider, etc.). This helps them take down malicious accounts and protect other users.',
  },
  {
    icon: '🔒',
    title: 'Secure Your Accounts',
    desc: 'Change passwords on all affected accounts. Enable two-factor authentication everywhere. Run an antivirus scan. If identity theft occurred, consider placing a fraud alert with credit bureaus.',
  },
]

const AUTHORITIES = [
  {
    flag: '🇺🇸',
    country: 'United States',
    agencies: [
      { name: 'IC3 — FBI Internet Crime Complaint Center', url: 'https://www.ic3.gov', desc: 'Primary portal for reporting all types of internet crime to the FBI.' },
      { name: 'FTC — Report Fraud', url: 'https://reportfraud.ftc.gov', desc: 'Report scams, identity theft, and consumer fraud to the Federal Trade Commission.' },
      { name: 'CISA — Cybersecurity & Infrastructure', url: 'https://www.cisa.gov/report', desc: 'Report cybersecurity incidents affecting critical infrastructure.' },
      { name: 'NCMEC — Child Exploitation', url: 'https://www.missingkids.org/gethelpnow/cybertipline', desc: 'Report child sexual exploitation and online predators.' },
    ]
  },
  {
    flag: '🇬🇧',
    country: 'United Kingdom',
    agencies: [
      { name: 'Action Fraud', url: 'https://www.actionfraud.police.uk', desc: 'UK\'s national reporting centre for fraud and cybercrime. Available 24/7.' },
      { name: 'NCSC — National Cyber Security Centre', url: 'https://www.ncsc.gov.uk/section/about-this-website/report-an-incident', desc: 'Report significant cyber incidents affecting UK organisations.' },
      { name: 'Report Suspicious Emails', url: 'https://www.ncsc.gov.uk/collection/phishing-scams', desc: 'Forward phishing emails to report@phishing.gov.uk' },
    ]
  },
  {
    flag: '🇮🇳',
    country: 'India',
    agencies: [
      { name: 'National Cyber Crime Reporting Portal', url: 'https://cybercrime.gov.in', desc: 'Official government portal to report all cybercrimes. Available in multiple languages.' },
      { name: 'Cybercrime Helpline — 1930', url: 'tel:1930', desc: 'Call 1930 immediately for financial fraud — available 24/7 for fast response.' },
      { name: 'CERT-In — Indian Computer Emergency', url: 'https://www.cert-in.org.in', desc: 'Report cybersecurity incidents and vulnerabilities to the national CERT.' },
    ]
  },
  {
    flag: '🇦🇺',
    country: 'Australia',
    agencies: [
      { name: 'ReportCyber — ACSC', url: 'https://www.cyber.gov.au/report-and-recover/report', desc: 'Australian Cyber Security Centre\'s official cybercrime reporting portal.' },
      { name: 'Scamwatch — ACCC', url: 'https://www.scamwatch.gov.au/report-a-scam', desc: 'Report scams and fraud to the Australian Competition & Consumer Commission.' },
      { name: 'eSafety Commissioner', url: 'https://www.esafety.gov.au/report', desc: 'Report online abuse, image-based abuse, and cyberbullying.' },
    ]
  },
  {
    flag: '🇨🇦',
    country: 'Canada',
    agencies: [
      { name: 'Canadian Anti-Fraud Centre', url: 'https://www.antifraudcentre-centreantifraude.ca', desc: 'Report mass marketing fraud, identity theft, and cybercrime.' },
      { name: 'Cyber Centre — CCCS', url: 'https://cyber.gc.ca/en/incident-management', desc: 'Report significant cybersecurity incidents to the Canadian Centre for Cyber Security.' },
      { name: 'RCMP — Report a Cybercrime', url: 'https://www.rcmp-grc.gc.ca/en/contact-us', desc: 'Contact the Royal Canadian Mounted Police for serious cybercrime.' },
    ]
  },
  {
    flag: '🇪🇺',
    country: 'European Union',
    agencies: [
      { name: 'Europol — Report Cybercrime', url: 'https://www.europol.europa.eu/report-a-crime/report-cybercrime-online', desc: 'Report cross-border cybercrime to the EU\'s law enforcement agency.' },
      { name: 'ENISA — EU Cybersecurity Agency', url: 'https://www.enisa.europa.eu', desc: 'EU Agency for Cybersecurity — incident reporting for member states.' },
    ]
  },
  {
    flag: '🌍',
    country: 'International',
    agencies: [
      { name: 'INTERPOL — Cybercrime', url: 'https://www.interpol.int/Crimes/Cybercrime', desc: 'For cross-border cybercrime involving multiple countries, contact INTERPOL through your national police.' },
      { name: 'Global Anti-Scam Alliance', url: 'https://www.globalantiscam.org', desc: 'International coalition for reporting and tracking online scams worldwide.' },
    ]
  },
]

const CRIME_TYPES = [
  {
    icon: '🎣',
    type: 'Phishing / Identity Theft',
    steps: [
      'Do not click any links in the suspicious message',
      'Forward phishing emails to your email provider\'s abuse team',
      'Report to your national cybercrime authority',
      'If credentials were stolen, change passwords immediately and enable 2FA',
      'File a report with your local police for identity theft documentation',
    ],
    color: '#f97316',
  },
  {
    icon: '💳',
    type: 'Online Financial Fraud',
    steps: [
      'Contact your bank immediately — ask them to freeze the account or reverse transactions',
      'Save all transaction records and communications as evidence',
      'Report to your national fraud hotline (e.g., IC3, Action Fraud, 1930)',
      'File a police report and obtain a crime reference number',
      'Report to the payment platform (PayPal, bank app, etc.)',
    ],
    color: '#22c55e',
  },
  {
    icon: '🔒',
    type: 'Ransomware Attack',
    steps: [
      'Disconnect the infected device from the internet immediately',
      'Do NOT pay the ransom — it does not guarantee file recovery',
      'Report to your national CERT/cybercrime authority',
      'Contact a professional cybersecurity firm for recovery assistance',
      'Restore from clean backups if available',
    ],
    color: '#ef4444',
  },
  {
    icon: '😡',
    type: 'Cyberbullying / Harassment',
    steps: [
      'Block the harasser on all platforms',
      'Screenshot and save all harassing messages before blocking',
      'Report the user to the platform (Instagram, Twitter, etc.)',
      'Contact your national cybercrime or eSafety authority',
      'If threats are involved, contact local police immediately',
    ],
    color: '#ec4899',
  },
  {
    icon: '🕵️',
    type: 'Data Breach / Hacking',
    steps: [
      'Change passwords on all affected accounts immediately',
      'Enable two-factor authentication on all important accounts',
      'Check haveibeenpwned.com to see what data was exposed',
      'Report the breach to your national cybersecurity authority',
      'If it affects a business, notify affected users and relevant data protection authority (e.g., ICO, GDPR supervisory authority)',
    ],
    color: '#6366f1',
  },
  {
    icon: '🛒',
    type: 'Online Shopping Scams',
    steps: [
      'Stop all communication with the scammer',
      'Report to the marketplace or website where the scam occurred',
      'Contact your bank or payment provider for a chargeback',
      'Report to your national consumer protection agency',
      'Leave reviews to warn other potential victims',
    ],
    color: '#eab308',
  },
]

const EVIDENCE_CHECKLIST = [
  'Screenshots of suspicious messages, emails, or websites',
  'Full email headers (not just the message body)',
  'URLs and domain names involved',
  'Dates and times of all incidents',
  'Usernames, phone numbers, or account names of the attacker',
  'Transaction IDs and bank statements (for financial fraud)',
  'Any files or attachments received (do not open them)',
  'Witness details if anyone else saw the incident',
  'Your device information (OS, browser used)',
  'Any communication you had with the attacker',
]

export default function ReportCrime() {
  const [openCountry, setOpenCountry] = useState(null)
  const [openCrime, setOpenCrime] = useState(null)
  const [checkedItems, setCheckedItems] = useState(new Set())

  const toggleCheck = (i) => {
    const next = new Set(checkedItems)
    next.has(i) ? next.delete(i) : next.add(i)
    setCheckedItems(next)
  }

  return (
    <div className="report-page">

      {/* Hero */}
      <div className="report-hero">
        <div className="report-hero-badge">🚨 Official Guidance</div>
        <h1 className="report-hero-title">How to Report Cybercrime</h1>
        <p className="report-hero-sub">
          Step-by-step guidance on reporting cybercrimes to the right authorities — wherever you are in the world.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="report-emergency">
        <span className="emergency-icon">⚠️</span>
        <div>
          <strong>If you are in immediate danger</strong>, contact your local emergency services (911 / 999 / 112) first before filing a cybercrime report.
        </div>
      </div>

      {/* Steps */}
      <section className="report-section">
        <h2 className="report-section-title">
          <span>📋</span> General Steps to Follow
        </h2>
        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div className="step-card" key={i}>
              <div className="step-number">0{i + 1}</div>
              <div className="step-icon">{step.icon}</div>
              <div className="step-body">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence Checklist */}
      <section className="report-section">
        <h2 className="report-section-title">
          <span>📂</span> Evidence Checklist
        </h2>
        <p className="report-section-sub">Check off each item you have gathered before submitting your report. The more evidence you provide, the stronger your case.</p>
        <div className="checklist-card">
          {EVIDENCE_CHECKLIST.map((item, i) => (
            <div
              key={i}
              className={`checklist-item ${checkedItems.has(i) ? 'checked' : ''}`}
              onClick={() => toggleCheck(i)}
            >
              <div className="check-box">{checkedItems.has(i) ? '✅' : '☐'}</div>
              <span>{item}</span>
            </div>
          ))}
          <div className="checklist-progress">
            <div className="checklist-bar">
              <div className="checklist-bar-fill" style={{ width: `${(checkedItems.size / EVIDENCE_CHECKLIST.length) * 100}%` }} />
            </div>
            <span>{checkedItems.size}/{EVIDENCE_CHECKLIST.length} items collected</span>
          </div>
        </div>
      </section>

      {/* Crime Type Specific */}
      <section className="report-section">
        <h2 className="report-section-title">
          <span>🎯</span> Report by Crime Type
        </h2>
        <p className="report-section-sub">Select the type of crime you experienced for specific reporting steps.</p>
        <div className="crime-list">
          {CRIME_TYPES.map((crime, i) => (
            <div key={i} className="crime-accordion" style={{ '--cc': crime.color }}>
              <button
                className={`crime-acc-header ${openCrime === i ? 'acc-open' : ''}`}
                onClick={() => setOpenCrime(openCrime === i ? null : i)}
              >
                <span className="crime-acc-icon">{crime.icon}</span>
                <span className="crime-acc-title">{crime.type}</span>
                <span className="crime-acc-chevron">{openCrime === i ? '▲' : '▼'}</span>
              </button>
              {openCrime === i && (
                <div className="crime-acc-body">
                  <ol className="crime-steps-list">
                    {crime.steps.map((step, j) => (
                      <li key={j}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Authorities by Country */}
      <section className="report-section">
        <h2 className="report-section-title">
          <span>🌐</span> Reporting Authorities by Country
        </h2>
        <p className="report-section-sub">Select your country to find the official agencies and reporting portals.</p>
        <div className="country-list">
          {AUTHORITIES.map((auth, i) => (
            <div key={i} className="country-accordion">
              <button
                className={`country-acc-header ${openCountry === i ? 'acc-open' : ''}`}
                onClick={() => setOpenCountry(openCountry === i ? null : i)}
              >
                <span className="country-flag">{auth.flag}</span>
                <span className="country-name">{auth.country}</span>
                <span className="country-count">{auth.agencies.length} agencies</span>
                <span className="country-chevron">{openCountry === i ? '▲' : '▼'}</span>
              </button>
              {openCountry === i && (
                <div className="country-acc-body">
                  {auth.agencies.map((agency, j) => (
                    <a
                      key={j}
                      href={agency.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="agency-card"
                    >
                      <div className="agency-info">
                        <div className="agency-name">{agency.name}</div>
                        <div className="agency-desc">{agency.desc}</div>
                      </div>
                      <div className="agency-arrow">↗</div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer tip */}
      <div className="report-footer-tip">
        <span>💡</span>
        <p>Even if you think the crime is minor or you won't get your money back, reporting still matters — your report helps authorities identify patterns and protect others from the same attack.</p>
      </div>

    </div>
  )
}
