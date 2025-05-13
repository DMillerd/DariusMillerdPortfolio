import React from 'react'
import { useTheme } from './ThemeContext';
import "../styles/themeButton.css"
import { FaPalette } from 'react-icons/fa';
import * as motion from "motion/react-client";


const ThemeButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
      <div className='theme--button--container'>
        <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85, rotate: 90 }}
        // transition={{duration: 0.4}}
        className='theme--button' onClick={toggleTheme}> <FaPalette className='theme--icon'/> </motion.button>
      </div>
    );
  }

export default ThemeButton