import {React} from "react";
import { useNavigate, Link } from "react-router";
import { FaRegUser, FaSearch, FaBook, FaList, FaHome } from "react-icons/fa";
import { GiMagicLamp } from "react-icons/gi";
import { IoSettingsSharp } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import "../styles/sidebar.css";



// onLogOut passed down as a prop from App.jsx
const Sidebar = ({ onLogout }) => {

  // Funtion to run once the Logout button is clicked, calls onLogOut => handleLogOut => sets logged in state to false and navigates to root
  const handleLogoutClick = () => {
    onLogout()
  }

  return (
    
    <div className="container-fluid menu d-flex flex-column  p-3 shadow-sm col-md-3">
      
      <div className="logo">
        <GiMagicLamp className="icon" />
        <h1 className="mb-0">Meal Genie</h1>
      </div>

      <div className="menu--list w-100 d-flex flex-column gap-3">
        <Link to="/dashboard" className="item d-flex align-items-center gap-2 p-2 rounded ">
          <FaHome className="icon" />
          Dashboard
        </Link>
        <Link to="/" className="item d-flex align-items-center gap-2 p-2 rounded">
          <FaSearch className="icon" />
          Find New Recipes
        </Link>
        <Link to="/savedrecipes" className="item d-flex align-items-center gap-2 p-2 rounded">
          <FaBook className="icon" />
          Saved Recipes
        </Link>
        <Link to="/grocerylists" className="item d-flex align-items-center gap-2 p-2 rounded">
          <FaList className="icon" />
          Grocery Lists 
        </Link>
        <Link to="/" className="item d-flex align-items-center gap-2 p-2 rounded">
          <IoSettingsSharp className="icon" />
          My Meal Preferences
        </Link>
        <Link  onClick={handleLogoutClick} className="item d-flex align-items-center gap-2 p-2 rounded">
          <TbLogout2 className="icon" />
          Logout
        </Link>
      </div>

    </div>
  );
};

export default Sidebar;
