import React from "react";
import Quiz from "../components/Quiz";

export default function Phishing() {
    const questions = [
  {
    question: "What is phishing?",
    options: [
      "A cyber attack using fake emails",
      "A type of firewall",
      "A database system",
      "An antivirus"
    ],
    answer: "A cyber attack using fake emails"
  },
  {
    question: "Phishing mainly targets?",
    options: ["CPU", "User credentials", "Hardware", "RAM"],
    answer: "User credentials"
  },
  {
    question: "Phishing is an example of?",
    options: ["Social engineering", "Hardware attack", "Encryption", "Networking"],
    answer: "Social engineering"
  },
  {
    question: "Phishing mostly happens via?",
    options: ["Email", "Mouse", "Keyboard", "Monitor"],
    answer: "Email"
  },
  {
    question: "Fake websites are used in phishing?",
    options: ["Yes", "No", "Sometimes", "Never"],
    answer: "Yes"
  },
  {
    question: "Secure website starts with?",
    options: ["http", "https", "ftp", "smtp"],
    answer: "https"
  },
  {
    question: "Should you share OTP?",
    options: ["Yes", "No", "Sometimes", "Only with friends"],
    answer: "No"
  },
  {
    question: "Banks ask password via email?",
    options: ["Yes", "No", "Sometimes", "Always"],
    answer: "No"
  },
  {
    question: "Phishing emails often create?",
    options: ["Urgency", "Relaxation", "Silence", "Fun"],
    answer: "Urgency"
  },
  {
    question: "Email spoofing means?",
    options: ["Fake sender identity", "Real sender", "Encryption", "Firewall"],
    answer: "Fake sender identity"
  },
  {
    question: "Best way to prevent phishing?",
    options: [
      "Ignore unknown emails",
      "Click all links",
      "Share passwords",
      "Disable antivirus"
    ],
    answer: "Ignore unknown emails"
  },
  {
    question: "Two-factor authentication helps?",
    options: ["Yes", "No", "Maybe", "Never"],
    answer: "Yes"
  },
  {
    question: "Phishing steals?",
    options: ["Data", "RAM", "CPU", "Battery"],
    answer: "Data"
  },
  {
    question: "Suspicious email should be?",
    options: ["Avoided", "Opened", "Clicked", "Replied"],
    answer: "Avoided"
  },
  {
    question: "Phishing links often look?",
    options: ["Real", "Broken", "Blank", "Colorful"],
    answer: "Real"
  },
  {
    question: "Fake login pages are used in?",
    options: ["Phishing", "Malware", "DDoS", "Firewall"],
    answer: "Phishing"
  },
  {
    question: "Phishing attack goal?",
    options: ["Steal information", "Speed up system", "Repair PC", "Install OS"],
    answer: "Steal information"
  },
  {
    question: "Spam emails are?",
    options: ["Unwanted emails", "System files", "Drivers", "Updates"],
    answer: "Unwanted emails"
  },
  {
    question: "Phishing uses?",
    options: ["Psychology", "Hardware", "CPU", "RAM"],
    answer: "Psychology"
  },
  {
    question: "Best defense against phishing?",
    options: ["User awareness", "Restart PC", "Delete files", "Shutdown"],
    answer: "User awareness"
  }
];
  return (
    <div className="page phishing">

      <h1>Phishing Attack</h1>

      {/* 🎥 Animation (VIDEO) */}
      <video
        className="attack-gif"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://cdnl.iconscout.com/lottie/premium/thumb/phishing-attack-animation-gif-download-5619125.mp4" type="video/mp4" />
      </video>

      {/* 📘 Definition */}
      <div className="definition-box">
        <p>
          Phishing is a cyber attack where attackers try to trick users into
          revealing sensitive information like passwords, bank details, or
          personal data by pretending to be a trusted source.
        </p>
      </div>

      {/* ⚠️ Example */}
      <h2>Example</h2>

      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3563146233/preview/stock-footage-email-phishing-email-scam-stealing-personal-information-through-phishing-email-financial-email.webm"
          type="video/mp4"
        />
      </video>

      <div className="definition-box">
        <p>
          You receive an email that looks like it’s from your bank asking you to
          “verify your account.” When you click the link, it takes you to a fake
          website that looks real. When you enter your login details, hackers
          steal your information.
        </p>
      </div>

      {/* 🛡️ Prevention */}
      <h2>Prevention</h2>

     <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3881012921/preview/stock-footage-animated-concept-showcasing-phishing-scams-cyber-threats-and-data-security-with-copy-space-for.webm"
          type="video/mp4"
        />
      </video>

      <ul className="prevention-box">
        <li>✔ Never click on unknown links in emails or messages</li>
        <li>✔ Check sender email address carefully</li>
        <li>✔ Use two-factor authentication (2FA)</li>
        <li>✔ Always verify websites before entering credentials</li>
        <li>✔ Install antivirus and security software</li>
      </ul>

      {/* 🎬 Video Link */}
      <a
        href="https://www.youtube.com/watch?v=XBkzBrXlle0"
        target="_blank"
        rel="noreferrer"
        className="video-link"
      >
        Watch Full Video
      </a>
       <h2>Test Your Knowledge</h2>

      <Quiz questions={questions} type="phishing" />

    </div>
  );
}