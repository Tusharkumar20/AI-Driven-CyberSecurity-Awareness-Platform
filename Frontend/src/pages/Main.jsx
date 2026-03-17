import { auth } from '../config/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Main() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    localStorage.removeItem('token')
    setUser(null)
  }

  return (

    <div className="page home">

      <div className="hero">



        <div className="hero-left">

          <h1>Secure Your Business with Expert Cyber Awareness</h1>

          <p>
            Our cyber awareness platform helps users understand common
            cyber threats like phishing, malware, ransomware, and DDoS
            attacks so they can stay safe online.
          </p>

          {user && (
            <div>
              <p>Logged in as {user.displayName || "User"}</p>
            {/*  <button onClick={handleLogout}>Logout</button>*/}
            </div>
          )}

        </div>


        

        <div className="hero-right">

          <div className="feature-card">
            <h3>Phishing Attack</h3>
            <p>Fake emails or websites used to steal user information.</p>
            <Link to="/phishing">Learn More</Link>
          </div>

          <div className="feature-card">
            <h3>Malware Attack</h3>
            <p>Malicious software designed to damage systems.</p>
            <Link to="/malware">Learn More</Link>
          </div>

          <div className="feature-card">
            <h3>Ransomware Attack</h3>
            <p>Attackers lock your files and demand payment.</p>
            <Link to="/ransomware">Learn More</Link>
          </div>

          <div className="feature-card">
            <h3>DDoS Attack</h3>
            <p>Overloading servers with massive traffic.</p>
            <Link to="/ddos">Learn More</Link>
          </div>

        </div>

      </div>

    </div>
  )
}