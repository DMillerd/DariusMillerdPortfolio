import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { UserButton, useUser } from "@clerk/clerk-react";
//import Motion library for animations
import * as motion from "motion/react-client";

//Import React icons for Navigation
import { FaRegUser, FaBook, FaList, FaHome, FaUtensils } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

export default function Nav({ onLogout }) {
  const navigate = useNavigate()
  const { user } = useUser()
  //useState hook to manage the open state of the filters menu, defaults to false (closed)
  const [isOpen, setIsOpen] = useState(false);

  //useRef hook to reference the container element for animations
  const containerRef = useRef(null);

  //Content for Nav component to render
  return (
    <div>
      <div>
        {/* Animated nav/sidebar from Motion react */}
        <motion.nav
          //No initial animations
          initial={false}
          //Open and closed animations based on isOpen state
          animate={isOpen ? "open" : "closed"}
          ref={containerRef}
        >
          {/* Prebuilt toggle component that handles opening and closing of sidebar; reverses the current state of isOpen and closes all open sub-menus by setting setOpenSections back to empty array. */}
          <motion.div style={background} variants={sidebarVariants} />
          <MenuToggle toggle={() => setIsOpen(!isOpen)} />

        

          {/* Prebuilt animated sidebar component. Passing down all necessary states and functions to enable functionality */}
          <Navigation
            onLogout={onLogout}
            //Handles toggling the menu closed after every interaction. 
            // Any time an item is selected isOpen is set to false (closed).
            toggleMenu={() => setIsOpen(false)}
            isOpen={isOpen}
            user={user}
          />
       

        </motion.nav>
      </div>
    </div>
  );
}

//Array of objects containing Nav items and their properties. Each object includes a name, icon, colorIndex, and path. 
//The paths are what need to be passed in order to navigate application
const menuItems = [
  { name: "Home", icon: <FaHome />, colorIndex: 0, path: "/dashboard" },
  //Search is commented out for now (Stretch feature)
  // {
  //   name: "Search Recipes",
  //   icon: <FaSearch />,
  //   colorIndex: 1,
  //   path: "/search",
  // },
  {
    name: "Saved Recipes",
    icon: <FaBook />,
    colorIndex: 2,
    path: "/savedrecipes",
  },
  // {
  //   name: "Grocery Lists",
  //   icon: <FaList />,
  //   colorIndex: 3,
  //   path: "/grocerylists",
  // },
  {
    name: "Meal Preferences",
    icon: <FaRegUser />,
    colorIndex: 4,
    path: "/preferences",
  },
  {
    name: "About",
    icon: <FaUtensils />,
    colorIndex: 5,
    path: "/about",
  },
  // { name: "Logout", icon: <TbLogout2 />, colorIndex: 5 },
];

//Sidebar component that renders the navigation sidebar
//Takes in all necessary state and handler functions as props
const Navigation = ({ onLogout, toggleMenu, isOpen, user }) => (
  
  // Animated unordered list; conditional statement disables pointer events when closed
  // This prevents users from clicking on hidden elements during animations
  <motion.ul
    style={{ ...list, pointerEvents: isOpen ? "auto" : "none" }}
    //Animation variants for Nav list
    variants={navVariants}
  >

    {/* Maps through menuItems array to render each Nav item. MenuItem gets a unique key and all necessary props for functionality */}
   {menuItems.map((item, index) => (
     <MenuItem
       key={index}
       name={item.name}
       icon={item.icon}
       colorIndex={item.colorIndex}
       path={item.path}
       onLogout={onLogout}
       toggleMenu={toggleMenu}
     />
   ))}
          <motion.li
        style={{...listItem, marginBottom: 30}}
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          // navigate("/");
          // if (toggleMenu) toggleMenu();
        }}
      >
        <div style={{ ...iconPlaceholder, border: "2px solid var(--accent-color)" }}>
          <UserButton 
               appearance={{
                elements: {
                  rootBox: "clerk-root-box",
                  card: "clerk-card",
                  headerTitle: "clerk-header-title",
                  socialButtons: "clerk-social-buttons",
                  dividerLine: "clerk-divider-line",
                  formFieldLabel: "clerk-form-label",
                  formButtonPrimary: "btn btn-primary meal--button",
                  footerActionLink: "clerk-footer-link"
                }
              }}
          />
        </div>
      </motion.li>
  </motion.ul>
);

// Color palette for Nav list borders
// Each index corresponds to a colorIndex in the menuItems array
const colors = [
  "#BF5700",
  "#D309E1",
  "#9C1AFF",
  "#7700FF",
  "#4400FF",
  "#A80000",
];

//MenuItem component that renders individual Nav items 
//Takes in all necessary props for rendering and functionality  
const MenuItem = ({ name, icon, colorIndex, onLogout, path, toggleMenu }) => {
  // Defines border style based on the color index provided
  const border = `2px solid ${colors[colorIndex]}`;

  //Hook for navigation
  const navigate = useNavigate();

   /**
   * Handles click events on menu items
   * - For Logout: Calls onLogout function and navigates to home
   * - For other items: Navigates to the specified path
   * - Always closes the menu after action
   */
  const handleClick = () => {

    navigate(path); // Navigate to the assigned path
    
    if (toggleMenu) toggleMenu(); //toggles the menu closed after any item is clicked
  };


  return (
    //Animated list items with hover and click (tap) effects to enhance UI/UX
    <motion.li
      style={listItem}
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <div style={{ ...iconPlaceholder, border }}>{icon}</div>
      <div style={{ ...textPlaceholder, border }}>{name}</div>
    </motion.li>
  );
};

// Variants are sets of animations that can be grouped together and activated with a single event listener.
//Animations for the individual sidebar items on the opening and closing of the sidebar
const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

// Animation variants for list items
// Defines how items animate when the sidebar opens and closes
const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

// Animation variants for the sidebar background
// Creates a circular reveal/hide effect
const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,

    transition: {
      type: "spring",
      stiffness: 10,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

//Creates the hamburger style toggle button
const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

//Prebuilt toggle button component for the sidebar
//Transforms between hamburger and X icons
const MenuToggle = ({ toggle }) => (
  <button style={toggleContainer} onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

// Navigation inline styling
// Inline styling for Nav bar and elements
const background = {
  backgroundColor: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 2px 15px rgba(0, 0, 0, 0.3)",
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: "300px",
  borderRadius: "0px 20px 20px 0px",
  zIndex: 1000,
};

const toggleContainer = {
  zIndex: 1002,
  outline: "none",
  border: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  cursor: "pointer",
  position: "absolute",
  top: 15,
  left: 15,
  width: 50,
  height: 50,
  borderRadius: "50%",
  backgroundColor: "var(--accent-color)",
};

const list = {
  listStyle: "none",
  padding: 20,
  margin: 0,
  position: "absolute",
  top: 80,
  left: 30,
  width: 250,
  zIndex: 1001,
};

const listItem = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: 0,
  margin: 0,
  listStyle: "none",
  marginBottom: 20,
  cursor: "pointer",
};

const iconPlaceholder = {
  width: 40,
  height: 40,
  fontSize: "1.1rem",
  borderRadius: "50%",
  marginRight: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "var(--primary-color)",
  color: "var(--accent-color)",
};

const textPlaceholder = {
  borderRadius: 5,
  fontSize: "1.1rem",
  padding: 2,
  width: "auto",
  height: "auto",
  flex: 1,
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  justifyContent: "center",
  backgroundColor: "var(--primary-color)",
  color: "var(--accent-color)",
};
