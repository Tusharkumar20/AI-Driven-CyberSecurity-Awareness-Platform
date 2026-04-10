import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* Left Section (Logo → Home) */}
      <div className="nav-left">
        <Link to="/" className="logo-link">

          <img
            src="/Cyber-logo5.svg"
            alt="CyberSafe Logo"
            className="nav-logo"
          />

          <span className="logo-text">CyberSafe</span>

        </Link>
      </div>

      {/* Right Section */}
      <div className="nav-right">

        <Link to="/" className="nav-item">
          Home
        </Link>

        <Link to="/profile" className="nav-item">
          Profile
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;