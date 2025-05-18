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
          <Route path='/' element={<Landing />}/>
          <Route path='/home' element={<Home />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/experience' element={<Experience />}/>
          <Route path='/proficiencies' element={<Proficiencies />}/>
          <Route path='/projects' element={<Projects />}/>
          <Route path='/resume' element={<Resume />}/>
          <Route path='*' element={<NotFound />}/>
        </Routes>


    </>
  )
}

export default App
