//imports
import { Link } from 'react-router-dom';

import "../style/Navbar.css";


//main function
const Navbar = () => {

return (
    <div className='navbar-container'>
        <span className="navbar-buttons"><Link to="/home">Home</Link></span>
        <span className="navbar-buttons"><Link to="/about">About</Link></span>
        <span className="navbar-buttons"><Link to="/experience">Experience</Link></span>
        <span className="navbar-buttons"><Link to="/proficiencies">Proficiencies</Link></span>
        <span className="navbar-buttons"><Link to="/projects">Projects</Link></span>
        <span className="navbar-buttons"><Link to="/resume">Resume</Link></span>
    </div>
    );
};

export default Navbar;