import React from "react";
import { Outlet } from "react-router"; // Import Outlet from react-router for nested routing
import Nav from "./Navigation"; // Import the Navigation component
import ThemeButton from "./ThemeButton";


/**
 * Layout Component
 * 
 * This component serves as the main layout wrapper for the application.
 * It provides a consistent structure across all pages by including:
 * - A navigation bar that appears on every page
 * - A container for the current route's content (via Outlet)
 * 

 */
const Layout = ({ onLogout }) => {
    return (
        <div className="appContainer container-fluid">
            <Nav onLogout={onLogout} /> {/* Renders the navigation bar on every page */}
            <ThemeButton />
            <Outlet /> {/* Dynamically renders the content of the current route */}
        </div>
    );
};

export default Layout;