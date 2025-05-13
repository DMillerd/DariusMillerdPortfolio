import React from "react";
import { FaSearch } from "react-icons/fa";
import Filters from "./Filters";
import { GiMagicLamp } from "react-icons/gi";
import Header from "./Header"
import "../styles/sidebar.css"

const RecipeSearch = () => {
  return (
      <div className="search--container">
        <div className="row">
        <div className="search--header">
              <Header />
              <Filters />
        </div>
        </div>
      </div>
  );
};

export default RecipeSearch;