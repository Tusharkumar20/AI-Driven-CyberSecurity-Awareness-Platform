import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import Profile from "./pages/Profile";

import Phishing from './pages/Phishing'
import Malware from './pages/Malware'
import Ransomware from './pages/Ransomware'
import DDoS from './pages/DDoS'
import Games from './pages/Games'
import MatrixBackground from './components/MatrixBackground'
import Navbar from './components/Navbr'
//import Chatbot from './components/Chatbot'

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <MatrixBackground />
      <Navbar />
      {/* <Chatbot /> */}

      <Routes>

        <Route path="/" element={<Navigate to="/main" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/main" element={<Main />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/phishing" element={<Phishing />} />
        <Route path="/malware" element={<Malware />} />
        <Route path="/ransomware" element={<Ransomware />} />
        <Route path="/ddos" element={<DDoS />} />
        <Route path="/games" element={<Games />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
