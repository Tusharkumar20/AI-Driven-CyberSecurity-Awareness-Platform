import React from "react";
import Quiz from "../components/Quiz";

function Ransomware() {

  const questions = [
    {
      question: "What is ransomware?",
      options: ["Locks data for money", "Firewall", "Antivirus", "Protocol"],
      answer: "Locks data for money"
    },
    {
      question: "Ransomware demands?",
      options: ["Money", "RAM", "CPU", "Battery"],
      answer: "Money"
    },
    {
      question: "Data becomes?",
      options: ["Encrypted", "Deleted", "Public", "Safe"],
      answer: "Encrypted"
    },
    {
      question: "Ransomware spreads via?",
      options: ["Email", "USB", "Downloads", "All of these"],
      answer: "All of these"
    },
    {
      question: "User sees?",
      options: ["Ransom note", "Login page", "Game", "Wallpaper"],
      answer: "Ransom note"
    },
    {
      question: "Best prevention?",
      options: ["Backup data", "Ignore", "Restart", "Delete system"],
      answer: "Backup data"
    },
    {
      question: "Encryption means?",
      options: ["Lock data", "Delete data", "Copy data", "Move data"],
      answer: "Lock data"
    },
    {
      question: "Phishing helps ransomware?",
      options: ["Yes", "No", "Maybe", "Never"],
      answer: "Yes"
    },
    {
      question: "Paying ransom is?",
      options: ["Risky", "Safe", "Good", "Fast"],
      answer: "Risky"
    },
    {
      question: "Backup helps?",
      options: ["Recover data", "Delete data", "Hack system", "Slow PC"],
      answer: "Recover data"
    },
    {
      question: "Ransomware is a?",
      options: ["Malware", "Hardware", "Network", "App"],
      answer: "Malware"
    },
    {
      question: "Goal of ransomware?",
      options: ["Money extortion", "Fix system", "Speed up", "Clean data"],
      answer: "Money extortion"
    },
    {
      question: "Safe practice?",
      options: ["Regular backup", "Click unknown links", "Share password", "Ignore updates"],
      answer: "Regular backup"
    },
    {
      question: "Antivirus helps?",
      options: ["Yes", "No", "Maybe", "Never"],
      answer: "Yes"
    },
    {
      question: "Ransomware affects?",
      options: ["Data security", "Color", "UI", "Mouse"],
      answer: "Data security"
    }
  ];

  return (
    <div className="page ransomware">

      <h1>Ransomware Attack</h1>

      {/* 🔴 Attack Video */}
      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3545589449/preview/stock-footage-hacked-computer-illustration-animation-looping-animation-transparent-background.webm"
          type="video/mp4"
        />
      </video>

      {/* 📘 Definition */}
      <div className="definition-box">
        <p>
          Ransomware is a type of malware that encrypts a victim’s files or
          system and demands a ransom payment to restore access.
        </p>
      </div>

      {/* ⚠️ Example */}
      <h2>Example</h2>

      <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3541146013/preview/stock-footage-explanatory-animation-about-ransomware-attacks-hacking-animation-computer-virus-animation.webm"
          type="video/mp4"
        />
      </video>

      <div className="definition-box">
        <p>
          A user opens an infected email attachment. The ransomware encrypts all
          files and shows a message demanding payment to unlock them.
        </p>
      </div>

      {/* 🟢 Prevention */}
       <video className="attack-video" autoPlay loop muted playsInline controls>
        <source
          src="https://www.shutterstock.com/shutterstock/videos/3987070775/preview/stock-footage-high-quality-ransomware-protection-animated-icon-created-in-clean-d-flat-motion-design-represents.webm"
          type="video/mp4"
        />
      </video>

      <h2>Prevention</h2>

      <ul className="prevention-box">
        <li>✔ Backup important files regularly</li>
        <li>✔ Avoid suspicious email attachments</li>
        <li>✔ Use strong security software</li>
        <li>✔ Keep operating systems updated</li>
      </ul>

      {/* 🎬 Video Link */}
      <a
        className="video-link"
        href="https://www.youtube.com/watch?v=-KL9APUjj3E"
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch Video About Ransomware
      </a>

      {/* 🧠 Quiz */}
      <h2>Test Your Knowledge</h2>
      <Quiz questions={questions} type="ransomware" />

    </div>
  );
}

export default Ransomware;