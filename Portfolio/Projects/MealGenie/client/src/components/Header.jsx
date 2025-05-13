import React from "react";
import { GiMagicLamp } from "react-icons/gi";
import "../styles/header.css"

const Header = () => {
  return (
    <div className="container-fluid header--content d-flex justify-content-center align-items-center">
       <div className="logo">
              <GiMagicLamp className="icon" />
              <h1 className="logo">Meal Genie</h1>
            </div>
    </div>
  );
};

export default Header;