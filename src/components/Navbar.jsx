//imports
import { Link } from 'react-router-dom';

import "../style/Navbar.css";


//main function
const Navbar = () => {



return (
    <div className='navbar-container'>
        <span className="navbar-buttons"><Link to="/DariusMillerdPortfolio/home">Home</Link></span>

        <span className="navbar-buttons"><Link to="/DariusMillerdPortfolio/about">About</Link></span>

        <span className="navbar-buttons"><Link to="/DariusMillerdPortfolio/experience">Experience</Link></span>

        <span className="navbar-buttons"><Link to="/DariusMillerdPortfolio/proficiencies">Proficiencies</Link></span>

        <span className="navbar-buttons"><Link to="/DariusMillerdPortfolio/projects">Projects</Link></span>

        <span className="navbar-buttons"><Link to="/DariusMillerdPortfolio/resume">Resume</Link></span>

    </div>
    );

};

export default Navbar;