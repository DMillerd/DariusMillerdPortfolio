import { createContext, useState, useEffect, useContext } from "react";

const themes = ['main', 'dark', 'cat', 'tokyo', 'green', 'red', 'matrix', 'space', 'galaxy', 'neon', 'cyber', 
];
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme && themes.includes(savedTheme) ? savedTheme : 'cat'
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const currentIndex = themes.indexOf(prev);
      const nextIndex = (currentIndex + 1) % themes.length;
      return themes[nextIndex];
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.className = '';
    root.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme)
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, themes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);