import { Link } from "react-router-dom";

function Navbar(){
return(

<nav className="navbar">

<div className="nav-left">
    <img src="/cyber-logo.svg" alt="CyberSafe Logo" className="nav-logo" />


    

<div className="logo"> CyberSafe</div>
</div>

<div className="nav-right">
<Link to="/">Home</Link>


<Link to="/profile">Profile</Link>

</div>

</nav>

);
}

export default Navbar;