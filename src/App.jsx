import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router';

//import components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Resume from "./components/Resume";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Proficiencies from "./components/Proficiencies";
import NotFound from "./components/NotFound";
import Landing from "./components/Landing";





function App() {

  return (
    <>
      <Navbar />
        <Routes>
          <Route path='/DariusMillerdPortfolio/' element={<Landing />}/>
          <Route path='/DariusMillerdPortfolio/home' element={<Home />}/>
          <Route path='/DariusMillerdPortfolio/about' element={<About />}/>
          <Route path='/DariusMillerdPortfolio/experience' element={<Experience />}/>
          <Route path='/DariusMillerdPortfolio/proficiencies' element={<Proficiencies />}/>
          <Route path='/DariusMillerdPortfolio/projects' element={<Projects />}/>
          <Route path='/DariusMillerdPortfolio/resume' element={<Resume />}/>
          <Route path='*' element={<NotFound />}/>
        </Routes>


    </>
  )
}

export default App
