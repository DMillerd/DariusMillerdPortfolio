import { useReducer, useState, useEffect } from "react";
import * as motion from "motion/react-client";
import { useUser } from "@clerk/clerk-react";

//Import all icons from react icons
import {
  FaGlobeAmericas,
  FaGlobeAsia,
  FaGlobeAfrica,
  FaGlobeEurope,
  FaUtensils,
  FaIceCream,
  FaAllergies,
  FaEgg,
  FaFish,
} from "react-icons/fa";
import { MdFastfood } from "react-icons/md";
import { LuWheatOff, LuNut } from "react-icons/lu";
import { IoNutritionOutline } from "react-icons/io5";
import {
  GiCookingPot,
  GiWheat,
  GiFruitBowl,
  GiShrimp,
  GiFishCooked,
  GiHerbsBundle,
  GiCarrot,
  GiStomach,
  GiDonut,
  GiMilkCarton,
  GiPlantSeed,
  GiPeanut,
  GiSteak,
} from "react-icons/gi";

import "../styles/mealpreferences.css";
import Header from "./Header";


//===================================================================//


//endpoint for fetching and saving/updating preferneces
const endpoint = "http://localhost:3000/mealgenie/user/preference";

//initial state for the preference options
const initialState = {
  mealTypes: {
    Breakfast: false,
    Snack: false,
    "Main Course": false,
    Dessert: false,
  },
  cuisineTypes: {
    African: false,
    Asian: false,
    Thai: false,
    Japanese: false,
    Korean: false,
    Chinese: false,
    Indian: false,
    Greek: false,
    German: false,
    Italian: false,
    Mediterranean: false,
    French: false,
    Mexican: false,
    American: false,
    Southern: false,
  },
  diets: {
    "Gluten Free": false,
    Ketogenic: false,
    Paleo: false,
    Pescetarian: false,
    Vegan: false,
    Vegetarian: false,
    "Low FODMAP": false,
    Whole30: false,
  },
  intolerances: {
    Dairy: false,
    Egg: false,
    Gluten: false,
    Peanut: false,
    Seafood: false,
    Shellfish: false,
    Soy: false,
    "Tree Nut": false,
  },
  nutritionTargets: {
    minProtein: null,
    // minFiber: "",
    // maxCalories: "",
    // maxCarbs: "",
  },
  cookingPreferences: {
    maxCookTime: null,
  },
};

// Create a New user in the database

// Reducer function
function preferencesReducer(state, action) {
  switch (action.type) {
    // case to toggle a pereference
    case "TOGGLE_PREFERENCE":
      return {
        //make acopy of the state
        ...state,
        //select the specific section to update
        [action.section]: {
          //make a copy of the state of the section
          ...state[action.section],
          //toggle the specific item in the section
          [action.item]: !state[action.section][action.item],
        },
      };
    //case to update the input fields
    case "UPDATE_NUMERIC":
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          //set the specified field to the new value from the input
          [action.field]:
            action.value === ""
              ? null
              : isNaN(Number(action.value))
              ? null
              : Number(action.value),
        },
      };
    case "LOAD_PREFERENCES":
      // Load all preferences at once
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

// Reusable Preference Card Component (the toggle buttons)
const PreferenceCard = ({
  // destructure the props to be used in the component

  // item: the name of the preference
  item,
  // selected: whether the preference is selected or not
  selected,
  // onClick: the function to be called when the card is clicked
  onClick,
  // icon: the icon to be displayed on the card
  icon,
  // animationDelay: the delay for the animation
  animationDelay,
  // isIntoleranceCard: whether the card is for intolerances or not
  isIntoleranceCard,
}) => (
  <motion.div
    // conditionally add classes to the card based on the selected state
    // and whether the card is for intolerances or not
    className={`preference-card 
      ${selected ? "selected" : ""}
      ${selected && isIntoleranceCard ? "intolerance-selected" : ""}
      `}
    // add the onClick function to the card
    onClick={onClick}
    // role = "buton" for accessibility
    role="button"
    // motion animation for the card
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{
      //animation for the entrance of the card
      opacity: 1,
      y: 0,
      transition: {
        // duration of the animation
        duration: 0.3,
        // delay for the animation
        delay: animationDelay * 0.05,
        ease: "easeIn",
      },
    }}
  >
    {/* Preference Card Content/Layout */}
    <div className="card-icon">{icon}</div>

    <span className="card-label">{item}</span>
  </motion.div>
);

// Section Header Component
// This component displays the header for each section of the preferences menu
// Takes in props similar to the PreferenceCard component
const SectionHeader = ({ icon, title, description }) => (
  // Content/Layout of the SectionHeader component
  <div className="section-header">
    <h2>
      <span className="header-icon">{icon}</span>
      {title}
    </h2>
    <p className="section-description">{description}</p>
  </div>
);

// Input Section Component
// This component displays the input fields for nutrition targets and cooking preferences
const InputField = ({ label, value, onChange, unit, animationDelay }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 10 }}
    animate={{
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: animationDelay * 0.05,
        ease: "easeOut",
      },
    }}
    className="input-card"
  >
    {/* Content/Layout for the input fields */}
    <div className="input-field">
      {/* Label for the field */}
      <label>{label}</label>

      <input
        type="number"
        // Set the value of the input field to the value passed in as a prop
        value={value === 0 ? "0" : value === null ? "" : value}
        // If the value is null, set the input field to an empty string, else set it to the value entered, and convert from string to a number
        //
        onChange={(e) => {
          // The key is to handle empty string and "0" differently
          if (e.target.value === "") {
            onChange(null);
          } else {
            // This ensures "0" gets properly converted to number 0
            const numValue = Number(e.target.value);
            onChange(numValue);
          }
        }}
        // Minimum value for the input field
        min="0"
      />
      {/* Span to display unit information  */}
      <span className="unit">{unit}</span>
    </div>
  </motion.div>
);

export default function MealPreferences() {
  //useReducer to manage the Preferences state
  // useReducer takes in a reducer function and an initial state
  const [preferences, dispatch] = useReducer(preferencesReducer, initialState);

  //State to mange the active section being displayed
  const [activeSection, setActiveSection] = useState("mealTypes");

  // state to mange the saving animation of the preferences
  const [isSaving, setIsSaving] = useState(false);

  //state to mange the save status of the preferences
  const [saveStatus, setSaveStatus] = useState(null);

  // state to set the Clerk user ID to a variable
  const [userId, setUserId] = useState("");
  const { user, isLoaded } = useUser();

  // Check if the user is loaded and set the userId to Clerk user ID
  useEffect(() => {
    if (isLoaded) {
      setUserId(user.id);
    }
  }, [userId, isLoaded]);

  // Fetch user preferences from the backend
  const fetchUserPreferences = async (userId) => {
    // If not userId, skip the fetch
    if (!userId) return;

    // Try catch block to handle fetch and errors
    try {
      const response = await fetch(`${endpoint}/?userID=${userId}`);
      if (!response.ok) {
        throw new Error("Could not fetch user preferences.");
      }
      const data = await response.json();

      // If the data exists and has userPreferences, transform the data to match the frontend structure
      if (data && data[0] && data[0].userPreferences) {
        // set the data to a variable for easier access
        const backendPrefs = data[0].userPreferences;

        // Transform backend data to match frontend structure
        // Object to store the data
        const transformedData = {
          // set the value of mealTypes to the initial state
          mealTypes: mapArrayToObject(
            backendPrefs.mealTypes || [],
            initialState.mealTypes
          ), // Default, since backend doesn't store this
          // map the backend data to match the initial state with mapArrayToObject
          cuisineTypes: mapArrayToObject(
            backendPrefs.cuisines || [],
            initialState.cuisineTypes
          ),
          diets: mapArrayToObject(
            backendPrefs.dietaryRestrictions || [],
            initialState.diets
          ),
          intolerances: mapArrayToObject(
            backendPrefs.intolerances || [],
            initialState.intolerances
          ),
          nutritionTargets: {
            // ...initialState.nutritionTargets.minProtein,
            minProtein: backendPrefs.protein ?? null,
          },
          cookingPreferences: {
            // ...initialState.cookingPreferences.maxCookTime,
            maxCookTime: backendPrefs.prepTime ?? null,
          },
        };

        //Dispatch the payload to the reducer
        // This will update the preferences state with the transformed data
        dispatch({ type: "LOAD_PREFERENCES", payload: transformedData });
      }
    } catch (error) {
      console.error("Error fetching preferences:", error.message);
    }
  };

  // Helper function to convert array of selected items to object with boolean values
  function mapArrayToObject(selectedItems, allOptions) {
    // Create an object with all options set to false
    const result = {};
    // Loop through all options and set the value to true if it exists in the selectedItems array
    for (const key in allOptions) {
      // Check if the key exists in the selectedItems array
      // If it does, set the value to true, else set it to false
      result[key] = selectedItems.includes(key);
    }
    // Return the result object
    // This will be used to set the preferences state
    return result;
  }

  // fetch user prefernces from the backend when the component mounts or if the userId changes
  useEffect(() => {
    fetchUserPreferences(userId);
  }, [userId]);

  // Navigation items
  const navigationItems = [
    { id: "mealTypes", name: "Meal Types", icon: <MdFastfood /> },
    { id: "cuisineTypes", name: "Cuisines", icon: <FaGlobeAmericas /> },
    { id: "diets", name: "Diets", icon: <GiWheat /> },
    { id: "intolerances", name: "Intolerances", icon: <FaAllergies /> },
    { id: "nutritionTargets", name: "Nutrition", icon: <IoNutritionOutline /> },
    { id: "cookingPreferences", name: "Cooking", icon: <GiCookingPot /> },
  ];

  // Handlers

  // handles the toggling of the preferences
  const handleToggle = (section, item) => {
    // dispacth the action to the reducer
    // This will update the preferences state with the new value
    dispatch({ type: "TOGGLE_PREFERENCE", section, item });
  };

  // Save user preferences to the database
  const savePreferences = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus("saved");

      // setTimeout(() => {
      //   setSaveStatus(null)
      // }, 2000)
      // Add the cuisines the user has toggled (saved as preference)

      // Add comments. Also, need to add functionality for updating user preferences here
      let cuisinePreferences = [];
      const cuisineTypes = preferences.cuisineTypes;
      for (const cuisineType of Object.keys(cuisineTypes)) {
        if (cuisineTypes[cuisineType] == true) {
          cuisinePreferences.push(cuisineType);
        }
      }

      // Add the intolerances

      let intolerancePreferences = [];
      const intoleranceTypes = preferences.intolerances;
      for (const intoleranceType of Object.keys(intoleranceTypes)) {
        if (intoleranceTypes[intoleranceType] == true) {
          intolerancePreferences.push(intoleranceType);
        }
      }

      // Add the dietary restrictions
      let dietaryRestrictionPreferences = [];
      const dietaryRestrictionTypes = preferences.diets;
      for (const dietaryRestrictionType of Object.keys(
        dietaryRestrictionTypes
      )) {
        if (dietaryRestrictionTypes[dietaryRestrictionType] == true) {
          dietaryRestrictionPreferences.push(dietaryRestrictionType);
        }
      }

      // Add the meal types
      let mealTypePreferences = [];
      const mealTypes = preferences.mealTypes;
      for (const mealType of Object.keys(
        mealTypes
      )) {
        if (mealTypes[mealType] == true) {
          mealTypePreferences.push(mealType);
        }
      }

      // Add the protein
      let proteinPreference = preferences.nutritionTargets.minProtein;

      // Add the max cook time
      let maxCookTimePreference = preferences.cookingPreferences.maxCookTime;

      let data = {
        userID: userId,
        cuisines: cuisinePreferences,
        intolerances: intolerancePreferences,
        dietaryRestrictions: dietaryRestrictionPreferences,
        mealTypes: mealTypePreferences,
        protein: proteinPreference === 0 ? 0 : proteinPreference,
        prepTime: maxCookTimePreference === 0 ? 0 : maxCookTimePreference,
      };

      // Add current preferences to user preferences
      fetch(`${endpoint}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Success: ${JSON.stringify(data)}`);
          setTimeout(() => {
            setSaveStatus(null);
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
        });

      // console.log("Saved Preferences:", preferences)
    }, 1000);
  };

  return (
    <>
      {/* Header component */}
      <Header />

      {/* Meal preferences content */}
      <div className="meal-preferences-container">
        <motion.header
          className="preferences-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Personalize Your Meal Experience</h1>
          <p>Set your preferences to get personalized meal recommendations</p>
        </motion.header>

        <div className="preferences-content">
          {/* Navigation Sidebar */}
          <motion.nav
            className="preferences-nav"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ul>
              {/* Map through navigationItems to display the nav menu */}
              {navigationItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  //If the section is active, add the active class to it
                  className={activeSection === item.id ? "active" : ""}
                  onClick={() => setActiveSection(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </motion.li>
              ))}
            </ul>

            {/* Save button */}
            <motion.button
              // If the button is saving, add the saving class to it
              className={`save-preferences-btn ${isSaving ? "saving" : ""} ${
                saveStatus ? saveStatus : ""
              }`}
              onClick={savePreferences}
              disabled={isSaving}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {/* If the button is saving, show the saving text, else show the save preferences text */}
              {isSaving
                ? "Saving..."
                : saveStatus === "saved"
                ? "Saved ✓"
                : "Save Preferences"}
            </motion.button>
          </motion.nav>

          {/* Main Content Area */}
          <motion.div
            className="preferences-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Meal Types Section */}
            {/* activeSection determines which content to display based on the current navigation selection */}
            {activeSection === "mealTypes" && (
              <motion.section
                key="mealTypes"
                className="preference-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Section header with icon, title and description */}
                <SectionHeader
                  icon={<MdFastfood />}
                  title="Meal Types"
                  description="Select the types of meals you're interested in"
                />

                {/* Grid layout for meal type preference cards */}
                <div className="preference-options meal-types-grid">
                  {/* Map through meal type options and create toggle cards for each */}
                  {Object.keys(preferences.mealTypes).map((meal, idx) => (
                    <PreferenceCard
                      key={meal}
                      item={meal}
                      selected={preferences.mealTypes[meal]} // Pass current selection state
                      onClick={() => handleToggle("mealTypes", meal)} // Toggle handler
                      icon={
                        // Assign appropriate icon based on meal type
                        meal === "Breakfast" ? (
                          <FaUtensils />
                        ) : meal === "Main Course" ? (
                          <GiCookingPot />
                        ) : meal === "Snack" ? (
                          <GiDonut />
                        ) : (
                          <FaIceCream />
                        )
                      }
                      animationDelay={idx} // Stagger animation entry
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Cuisine Types Section - shows different cuisine options */}
            {activeSection === "cuisineTypes" && (
              <motion.section
                key="cuisineTypes"
                className="preference-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Section header for cuisines */}
                <SectionHeader
                  icon={<FaGlobeAmericas />}
                  title={"Cuisine Types"}
                  description={
                    "Select the types of cuisines you're interested in"
                  }
                />

                {/* Grid layout for cuisine preference cards */}
                <div className="preference-options meal-types-grid">
                  {/* Map through cuisine options and create toggle cards for each */}
                  {Object.keys(preferences.cuisineTypes).map((type, idx) => (
                    <PreferenceCard
                      key={type}
                      item={type}
                      selected={preferences.cuisineTypes[type]} // Pass current selection state
                      onClick={() => handleToggle("cuisineTypes", type)} // Toggle handler for cuisines
                      icon={
                        // Assign appropriate region-specific globe icon based on cuisine origin
                        type === "African" ? (
                          <FaGlobeAfrica />
                        ) : type === "Asain" ? (
                          <FaGlobeAsia />
                        ) : type === "Thai" ? (
                          <FaGlobeAsia />
                        ) : type === "Korean" ? (
                          <FaGlobeAsia />
                        ) : type === "Japanese" ? (
                          <FaGlobeAsia />
                        ) : type === "Chinese" ? (
                          <FaGlobeAsia />
                        ) : type === "Indian" ? (
                          <FaGlobeAsia />
                        ) : type === "Greek" ? (
                          <FaGlobeEurope />
                        ) : type === "German" ? (
                          <FaGlobeEurope />
                        ) : type === "Italian" ? (
                          <FaGlobeEurope />
                        ) : type === "Mediterranean" ? (
                          <FaGlobeEurope />
                        ) : type === "French" ? (
                          <FaGlobeEurope />
                        ) : type === "Mexico" ? (
                          <FaGlobeAmericas />
                        ) : (
                          <FaGlobeAmericas />
                        )
                      }
                      animationDelay={idx} // Stagger animation for visual effect
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Diet Types Section - shows different diet restriction options */}
            {activeSection === "diets" && (
              <motion.section
                key="diets"
                className="preference-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Section header for diets */}
                <SectionHeader
                  icon={<GiWheat />}
                  title={"Diet Types"}
                  description={"Select the types of diets you're interested in"}
                />

                {/* Grid layout for diet preference cards */}
                <div className="preference-options meal-types-grid">
                  {/* Map through diet options and create toggle cards for each */}
                  {Object.keys(preferences.diets).map((type, idx) => (
                    <PreferenceCard
                      key={type}
                      item={type}
                      selected={preferences.diets[type]} // Pass current selection state
                      onClick={() => handleToggle("diets", type)} // Toggle handler for diets
                      icon={
                        // Assign appropriate icon based on diet type
                        type === "Gluten Free" ? (
                          <LuWheatOff />
                        ) : type === "Ketogenic" ? (
                          <GiSteak />
                        ) : type === "Paleo" ? (
                          <GiFruitBowl />
                        ) : type === "Pescetarian" ? (
                          <GiFishCooked />
                        ) : type === "Vegan" ? (
                          <GiHerbsBundle />
                        ) : type === "Vegetarian" ? (
                          <GiCarrot />
                        ) : type === "Low FODMAP" ? (
                          <GiStomach />
                        ) : (
                          <GiFruitBowl />
                        )
                      }
                      animationDelay={idx} // Stagger animation for visual effect
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Intolerances Section - shows different allergy/intolerance options */}
            {activeSection === "intolerances" && (
              <motion.section
                key="intolerances"
                className="preference-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Section header for intolerances */}
                <SectionHeader
                  icon={<FaAllergies />}
                  title={"Intolerances and Allergens"}
                  description={
                    "Select items you're allergic to or intolerant of"
                  }
                />

                {/* Grid layout for intolerance preference cards */}
                <div className="preference-options meal-types-grid">
                  {/* Map through intolerance options and create toggle cards for each */}
                  {Object.keys(preferences.intolerances).map((type, idx) => (
                    <PreferenceCard
                      key={type}
                      item={type}
                      selected={preferences.intolerances[type]} // Pass current selection state
                      onClick={() => handleToggle("intolerances", type)} // Toggle handler for intolerances
                      isIntoleranceCard={true} // Flag for special styling for allergens
                      icon={
                        // Assign appropriate allergen icon based on intolerance type
                        type === "Dairy" ? (
                          <GiMilkCarton />
                        ) : type === "Egg" ? (
                          <FaEgg />
                        ) : type === "Gluten" ? (
                          <GiWheat />
                        ) : type === "Peanut" ? (
                          <GiPeanut />
                        ) : type === "Seafood" ? (
                          <FaFish />
                        ) : type === "Shellfish" ? (
                          <GiShrimp />
                        ) : type === "Soy" ? (
                          <GiPlantSeed />
                        ) : (
                          <LuNut />
                        )
                      }
                      animationDelay={idx} // Stagger animation for visual effect
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Nutrition Targets Section - allows setting nutritional goals */}
            {activeSection === "nutritionTargets" && (
              <motion.section
                key="nutritionTargets"
                className="preference-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* Section header for nutrition targets */}
                <SectionHeader
                  icon={<IoNutritionOutline />}
                  title="Nutrition Targets"
                  description="Set your target nutrition values"
                />

                {/* Layout for nutrition input fields */}
                <div className="preference-options">
                  {/* Map through nutrition target options and create input fields for each */}
                  {Object.entries(preferences.nutritionTargets).map(
                    ([field, value], idx) => {
                      // Map the field names to more user-friendly display labels
                      const displayLabels = {
                        minProtein: "Min. Protein",
                        // Additional nutrition fields can be added here
                      };

                      return (
                        <InputField
                          key={field}
                          label={displayLabels[field] || field} // Use display label or fallback to field name
                          value={value} // Current value of the nutrition field
                          unit={
                            // Assign appropriate unit based on nutrition type
                            field === "minProtein" || field === "minFiber"
                              ? "g"
                              : field === "maxCalories"
                              ? "kcal"
                              : "g"
                          }
                          onChange={(val) =>
                            // Update the numeric value in the nutrition targets section
                            dispatch({
                              type: "UPDATE_NUMERIC",
                              section: "nutritionTargets",
                              field,
                              value: val,
                            })
                          }
                          animationDelay={idx} // Stagger animation for visual effect
                        />
                      );
                    }
                  )}
                </div>
              </motion.section>
            )}

            {/* Cooking Preferences Section - allows setting cooking constraints */}
            {activeSection === "cookingPreferences" && (
              <motion.section>
                {/* Section header for cooking preferences */}
                <SectionHeader
                  icon={<GiCookingPot />}
                  title="Cooking Targets"
                  description="Specify cooking goals you'd like to aim for"
                />
                {/* Layout for cooking preference input fields */}
                <div className="preference-options">
                  <div className="input-options">
                    {/* Input field for maximum cooking time */}
                    <InputField
                      label="Max. Cook Time"
                      value={preferences.cookingPreferences["maxCookTime"]}
                      onChange={(val) =>
                        // Update the numeric value in the cooking preferences section
                        dispatch({
                          type: "UPDATE_NUMERIC",
                          section: "cookingPreferences",
                          field: "maxCookTime",
                          value: val,
                        })
                      }
                      unit=" minutes" // Time unit for cooking time
                    />
                  </div>
                </div>
              </motion.section>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
