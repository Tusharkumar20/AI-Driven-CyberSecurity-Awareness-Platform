import { useState } from "react";
import axios from "axios";
import "./ChatBot.css";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function ChatBot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text: "Hello! I am CyberSafe AI 🤖. Ask me anything about cyber security.",
      sender: "bot"
    }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = input;

    setMessages(prev => [
      ...prev,
      { text: userMessage, sender: "user" }
    ]);

    setInput("");

    try {

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          contents: [
            {
              parts: [
                {
                  text: `You are a cyber security expert AI. Explain in full detail with examples and prevention tips: ${userMessage}`
                }
              ]
            }
          ]
        }
      });

      const botReply =
        response.data.candidates[0].content.parts[0].text;

      setMessages(prev => [
        ...prev,
        { text: botReply, sender: "bot" }
      ]);

    } catch (error) {

      console.log("Gemini Error:", error.response?.data || error.message);

      setMessages(prev => [
        ...prev,
        {
          text: "⚠️ API error. Please check Gemini API key.",
          sender: "bot"
        }
      ]);
    }
  };

  return (
    <>
      <div className="chat-icon" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {open && (
        <div className="chatbot">

          <div className="chat-header">
            CyberSafe AI
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-window">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cyber security..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default ChatBot;