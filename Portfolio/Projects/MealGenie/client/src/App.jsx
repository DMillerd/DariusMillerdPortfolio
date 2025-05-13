import React, { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router";

//import styling
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

//import all components for App
import Hero from "./components/Hero";
import Generator from "./components/Generator";
import Registration from "./components/Registration";
import SavedRecipes from "./components/SavedRecipes";
import GroceryLists from "./components/GroceryLists";
import Preferences from "./components/Preferences";
import About from "./components/About";
// import RecipeSearch from "./components/Search"; */Keeping the search feature as a stretch goal for now./*
import Layout from "./components/Layout"; //Component to define the overall layout of the App. (Renders nav sidebar on every page. Wraps protected routes)

import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

function App() {

  return (
    <div className="appContainer">
      <SignedOut>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/dashboard" element={<Navigate to="/" replace /> } />
          <Route path="/savedrecipes" element={<Navigate to="/" replace /> } />
          <Route path="/grocerylists" element={<Navigate to="/" replace /> } />
          <Route path="/preferences" element={<Navigate to="/" replace /> } />
        </Routes>
      </SignedOut>

      <SignedIn>
        <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={ <Navigate to="/dashboard" replace/> } />
          <Route path="/dashboard" element={<Generator />} />
          <Route path="/savedrecipes" element={<SavedRecipes />} />
          <Route path="/grocerylists" element={<GroceryLists />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/about" element={<About />} />
        </Route>
        </Routes>
      </SignedIn>
    </div>
  );
}

export default App;
