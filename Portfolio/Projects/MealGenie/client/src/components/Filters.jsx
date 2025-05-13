import { useRef, useState, useEffect, useReducer } from "react";
import { useUser } from "@clerk/clerk-react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

// Import React icons for filter bar
import { FaGlobeAmericas, FaAllergies } from "react-icons/fa";
import { MdNoFood } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";

// Import CSS styling
import "../styles/filters.css";

// API endpoint
const endpoint = "http://localhost:3000/mealgenie/user/preference";

// Initial state for filters - matching the structure in MealPreferences
const filtersInitialState = {
  cuisineTypes: {
    Mexican: false,
    Asian: false,
    European: false,
    American: false,
  },
  diets: {
    "Gluten Free": false,
    Ketogenic: false,
    Paleo: false,
    Pescetarian: false,
    Vegan: false,
    Vegetarian: false,
  },
  intolerances: {
    Dairy: false,
    Gluten: false,
    Egg: false,
    Peanut: false,
    Seafood: false,
    Shellfish: false,
    Soy: false,
    "Tree Nut": false,
  },
};

// Reducer function
function filtersReducer(state, action) {
  switch (action.type) {
    //reducer case to toggle preferences
    case "TOGGLE_PREFERENCE":
      return {
        //makes a shallow copy of the state
        ...state,
        //selects a specific section
        [action.section]: {
          //make a copy of the state of the section
          ...state[action.section],
          //toggle the boolean value of the selected item in the specified section
          [action.item]: !state[action.section][action.item],
        },
      };
    //reducer case to load all saved preferences
    case "LOAD_PREFERENCES":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

export default function Filters() {
  // State setup
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  //State to show the selected section of filters
  const [activeSection, setActiveSection] = useState("cuisineTypes");
  const [filterState, dispatch] = useReducer(
    filtersReducer,
    filtersInitialState
  );

  // Save animation states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // User data
  const [userId, setUserId] = useState("");
  const { user, isLoaded } = useUser();

  //set Clerk userID to userId variable
  useEffect(() => {
    if (isLoaded) {
      setUserId(user.id);
    }
  }, [isLoaded]);

  // Helper function to convert array of selected items to object with boolean values
  function mapArrayToObject(selectedItems, allOptions) {
    const result = {};
    for (const key in allOptions) {
      result[key] = selectedItems.includes(key);
    }
    return result;
  }

  // Fetch user preferences from API
  const fetchUserPreferences = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(`${endpoint}/?userID=${userId}`);
      if (!response.ok) {
        throw new Error("Could not fetch user preferences");
      }
      const data = await response.json();

      if (data && data[0] && data[0].userPreferences) {
        const backendPrefs = data[0].userPreferences;

        // Transform backend data to match frontend structure
        const transformedData = {
          cuisineTypes: mapArrayToObject(
            backendPrefs.cuisines || [],
            filtersInitialState.cuisineTypes
          ),
          diets: mapArrayToObject(
            backendPrefs.dietaryRestrictions || [],
            filtersInitialState.diets
          ),
          intolerances: mapArrayToObject(
            backendPrefs.intolerances || [],
            filtersInitialState.intolerances
          ),
        };

        // Load transformed data into state
        dispatch({
          type: "LOAD_PREFERENCES",
          payload: transformedData,
        });
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  // Fetch user preferences when userId changes
  useEffect(() => {
    if (userId) {
      fetchUserPreferences(userId);
    }
  }, [userId]);

  // Handle toggle of filter items
  const handleToggle = (section, item) => {
    dispatch({ type: "TOGGLE_PREFERENCE", section, item });
  };

  // Save user preferences back to the API with animation
  const saveUserPreferences = async () => {
    if (!userId) return;

    // Start saving animation
    setIsSaving(true);

    try {
      // Extract selected preferences
      const cuisinePreferences = Object.keys(filterState.cuisineTypes).filter(
        (cuisine) => filterState.cuisineTypes[cuisine]
      );

      const dietaryRestrictionPreferences = Object.keys(
        filterState.diets
      ).filter((diet) => filterState.diets[diet]);

      const intolerancePreferences = Object.keys(
        filterState.intolerances
      ).filter((intolerance) => filterState.intolerances[intolerance]);

      // Create request data
      const data = {
        userID: userId,
        cuisines: cuisinePreferences,
        intolerances: intolerancePreferences,
        dietaryRestrictions: dietaryRestrictionPreferences,
      };

      // Send data to API
      const response = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Show success state after a slight delay
      setTimeout(() => {
        setIsSaving(false);
        setSaveStatus("saved");

        // Reset the status after 2 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 2000);
      }, 1000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      // Show error state
      setTimeout(() => {
        setIsSaving(false);
        setSaveStatus("error");

        // Reset the status after 2 seconds
        setTimeout(() => {
          setSaveStatus(null);
        }, 2000);
      }, 1000);
    }
  };

  // Array of filter categories/sections
  const menuItems = [
    {
      name: "cuisineTypes",
      displayName: "Cuisine Types",
      icon: <FaGlobeAmericas />,
      colorIndex: 1,
    },
    {
      name: "diets",
      displayName: "Diets",
      icon: <MdNoFood />,
      colorIndex: 2,
    },
    {
      name: "intolerances",
      displayName: "Intolerances",
      icon: <FaAllergies />,
      colorIndex: 5,
    },
  ];

  return (
    <div>
      <div>
        {/* Animated sidebar for filters */}
        <motion.nav
          initial={false}
          animate={isOpen ? "open" : "closed"}
          ref={containerRef}
          layout
        >
          {/* Background for sidebar */}
          <motion.div style={background} variants={sidebarVariants} />

          {/* Toggle button for opening/closing the sidebar */}
          <MenuToggle
            toggle={() => {
              setIsOpen(!isOpen);
              setActiveSection("cuisineTypes");
            }}
          />

          <AnimatePresence>
            {/* Sidebar content */}
            {isOpen && (
              <motion.div
                style={{ ...sidebar, pointerEvents: "auto" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.2, delay: 0.05 } }}
                transition={{ duration: 0.3 }}
              >
                {/* Section navigation */}
                <div className="filter-sections">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      className={`filter-section-tab ${
                        activeSection === item.name ? "active" : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      onClick={() => setActiveSection(item.name)}
                    >
                      <div className="section-icon">{item.icon}</div>
                      <div className="section-name">{item.displayName}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Active section's filters */}
                <div className="filter-options">
                  <h3>
                    {
                      menuItems.find((item) => item.name === activeSection)
                        ?.displayName
                    }
                  </h3>

                  <div className="options-grid">
                    {Object.keys(filterState[activeSection] || {}).map(
                      (item, index) => (
                        <motion.button
                          key={item}
                          className={`filter-option ${
                            filterState[activeSection][item] ? "selected" : ""
                          } ${
                            activeSection === "intolerances" &&
                            filterState[activeSection][item]
                              ? "intolerance-selected"
                              : ""
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          onClick={() => handleToggle(activeSection, item)}
                        >
                          {item}
                        </motion.button>
                      )
                    )}
                  </div>
                </div>

                {/* Save button with animation states */}
                <motion.button
                  className={`save-filters-btn ${isSaving ? "saving" : ""} ${
                    saveStatus ? saveStatus : ""
                  }`}
                  onClick={saveUserPreferences}
                  disabled={isSaving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  {isSaving
                    ? "Saving..."
                    : saveStatus === "saved"
                    ? "Saved ✓"
                    : "Apply Filters"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </div>
  );
}

// Toggle button component
const MenuToggle = ({ toggle }) => (
  <motion.button
    whileHover={{ rotate: 90 }}
    whileTap={{ rotate: 360 }}
    className="menu-toggle"
    onClick={toggle}
  >
    <IoSettingsSharp style={settings} />
  </motion.button>
);

// Animation variants for the sidebar background
const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
    transition: {
      type: "spring",
      stiffness: 10,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at calc(100% - 40px) 40px)",
    transition: {
      delay: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

// Styling

const background = {
  backgroundColor: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 2px 15px rgba(0, 0, 0, 0.3)",
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  width: "300px",
  borderRadius: "20px 0 0 20px",
  zIndex: 1000,
};

const sidebar = {
  position: "absolute",
  top: 60,
  right: 0,
  width: "280px",
  padding: "20px",
  zIndex: 1001,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxHeight: "calc(100vh - 80px)",
  overflowY: "auto",
};

const settings = {
  width: 30,
  height: 30,
};
