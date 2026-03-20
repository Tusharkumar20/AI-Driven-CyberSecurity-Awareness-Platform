import React from "react";
import Quiz from "../components/Quiz";

function Ddos() {

  const questions = [
    {
      question: "What is DDoS?",
      options: ["Attack using multiple systems", "Firewall", "Antivirus", "Protocol"],
      answer: "Attack using multiple systems"
    },
    {
      question: "DDoS stands for?",
      options: ["Distributed Denial of Service", "Direct Data Service", "Digital Defense System", "None"],
      answer: "Distributed Denial of Service"
    },
    {
      question: "Target of DDoS attack?",
      options: ["Server", "Mouse", "Keyboard", "Monitor"],
      answer: "Server"
    },
    {
      question: "DDoS causes?",
      options: ["Slow/Crash website", "Faster internet", "Better security", "None"],
      answer: "Slow/Crash website"
    },
    {
      question: "Botnet is?",
      options: ["Network of infected devices", "Antivirus", "Router", "App"],
      answer: "Network of infected devices"
    },
    {
      question: "Traffic used in DDoS?",
      options: ["Fake traffic", "Real traffic", "Secure traffic", "Encrypted"],
      answer: "Fake traffic"
    },
    {
      question: "DDoS uses?",
      options: ["Multiple systems", "Single system", "Router", "CPU"],
      answer: "Multiple systems"
    },
    {
      question: "Main goal of DDoS?",
      options: ["Disrupt service", "Fix bugs", "Speed up system", "Secure data"],
      answer: "Disrupt service"
    },
    {
      question: "DDoS affects?",
      options: ["Availability", "Color", "UI", "Battery"],
      answer: "Availability"
    },
    {
      question: "Flood attack is type of?",
      options: ["DDoS", "Virus", "Trojan", "Spyware"],
      answer: "DDoS"
    },
    {
      question: "Service becomes?",
      options: ["Unavailable", "Fast", "Secure", "Clean"],
      answer: "Unavailable"
    },
    {
      question: "Prevent using?",
      options: ["Firewall", "Ignore", "Shutdown", "Delete system"],
      answer: "Firewall"
    },
    {
      question: "Cloud protection helps?",
      options: ["Yes", "No", "Maybe", "Never"],
      answer: "Yes"
    },
    {
      question: "Mitigation tool?",
      options: ["Load balancer", "Mouse", "Keyboard", "Monitor"],
      answer: "Load balancer"
    },
    {
      question: "Rate limiting helps?",
      options: ["Yes", "No", "Maybe", "Never"],
      answer: "Yes"
    }
  ];

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
          compromised systems flood a server, network, or website with massive
          traffic, making it unavailable to legitimate users.
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
          (botnets) sending fake requests simultaneously. The server becomes
          overloaded and crashes, preventing real users from accessing it.
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
        <li>✔ Use firewalls and DDoS protection services</li>
        <li>✔ Implement rate limiting</li>
        <li>✔ Use load balancing</li>
        <li>✔ Monitor network traffic regularly</li>
        <li>✔ Use cloud-based protection systems</li>
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
      <Quiz questions={questions} type="ddos" />

    </div>
  );
}

export default Ddos;