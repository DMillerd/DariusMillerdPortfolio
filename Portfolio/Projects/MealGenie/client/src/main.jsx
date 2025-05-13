import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "../src/components/ThemeContext";
import { BrowserRouter as Router } from "react-router";
import {ClerkProvider} from "@clerk/clerk-react"

import "./index.css";
import App from "./App.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_API_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}


createRoot(document.getElementById("root")).render(
  <Router>
    <ClerkProvider 
    // afterSignOutUrl={"/"}
    signInForceRedirectUrl={"/dashboard"}
    publishableKey={PUBLISHABLE_KEY}>
    {/* <StrictMode> */}
    <ThemeProvider >
    <App />
    </ThemeProvider>
    {/* </StrictMode> */}
    </ClerkProvider>
  </Router>
);
