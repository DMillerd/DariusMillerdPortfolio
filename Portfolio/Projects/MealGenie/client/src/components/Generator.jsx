import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

// Import motion for animations from the Motion library
import { motion } from "motion/react";

// Import individual Generator page components
import Header from "./Header";
import MealCard from "./MealCard";
import Filters from "./Filters";


// CSS styling for generator page
import "../styles/generator.css";

import { GiKnifeFork } from "react-icons/gi";
import EmptyMealsState from "./EmptyMealsState";

// Generator component serves as the main UI for meal recommendations
const Generator = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  //console.log("User Data:", user); // Log the user object

  const [isLoading, setisLoading] = useState(false);
  const [meals, setMeals] = useState([null]);
  const [tempMeals, setTempMeals] = useState([]);

  const endpoint = "http://localhost:3000/mealgenie/meal/random";
  const prefEndpoint = "http://localhost:3000/mealgenie/user/preference";

  const fetchMeals = () => {
    let include = [];
    let exclude = [];
    let includeParam = "";
    let excludeParam = "";

    // Get the user's preferences
    fetch(`${prefEndpoint}?userID=${user.id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Get the preferences
        let preferences = data[0]["userPreferences"];
        // For each preference type, add the preferences to exclude or include
        for (const [prefType, value] of Object.entries(preferences)) {
          // intolerances will be excluded
          if (prefType === "intolerances") {
            let intolerances = JSON.parse(JSON.stringify(value));
            for (let i = 0; i < intolerances.length; i++) {
              exclude.push(intolerances[i].toLowerCase());
            }
          }
          // cuisines will be included
          if (prefType === "cuisines") {
            let cuisines = JSON.parse(JSON.stringify(value));
            for (let i = 0; i < cuisines.length; i++) {
              include.push(cuisines[i].toLowerCase());
            }
          }
          // mealTypes will be included
          if (prefType === "mealTypes") {
            let mealTypes = JSON.parse(JSON.stringify(value));
            for (let i = 0; i < mealTypes.length; i++) {
              include.push(mealTypes[i].toLowerCase());
            }
          }
          // protein will be included
          if (prefType === "protein" && value) {
            include.push(value);
          }
          // prep time will be included
          if (prefType === "prepTime" && value) {
            include.push(value);
          }
          // dietary restrictions will be included
          if (prefType === "dietaryRestrictions") {
            let dietaryRestrictions = JSON.parse(JSON.stringify(value));
            for (let i = 0; i < dietaryRestrictions.length; i++) {
              include.push(dietaryRestrictions[i].toLowerCase());
            }
          }
        }
        // Turn include and exclude into comma separated string
        includeParam = include.toString();
        excludeParam = exclude.toString();

        setisLoading(true);
        // return the fetch call to random meal API with the preferences to exclude and include
        return fetch(
          `${endpoint}?include=${includeParam}&exclude=${excludeParam}`
        );
      })
      .then((response) => response.json())
      .then((data) => {
        const mealData = data.recipes;
        setMeals(mealData);
        setisLoading(false);
        console.log(mealData);

        let randomRecipes = [];
        mealData.forEach(function (recipe, index, arr) {
          let recipeObj = {};
          recipeObj["id"] = recipe.id;
          recipeObj["image"] = recipe.image;
          recipeObj["title"] = recipe.title;
          recipeObj["summary"] = recipe.summary;
          recipeObj["instructions"] = recipe.instructions;
          recipeObj["ingredients"] = [];
          recipe.extendedIngredients.forEach(function (ing, index, arr) {
            recipeObj["ingredients"].push(ing.name);
          });
          randomRecipes.push(recipeObj);
        });
        setTempMeals(randomRecipes);
      })
      .catch((err) => console.log(err, "Error fetching meals :(... Try Again!"))
      .catch((error) => {
        console.log(error);
      });
  };

  const checkUser = async (userId) => {
    // Get call to user DB, check if user exists. Data will return "No user with that id" if user doesn't exist
    try {
      const response = await fetch(`${prefEndpoint}?userID=${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (userId) => {
    // Creates the user
    let call = {
      method: "POST",
      body: JSON.stringify({
        userID: userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(`${prefEndpoint}`, call);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser(user.id)
      .then((data) => {
        if (data.message === "No user with that ID") {
          createUser(user.id)
            .then((data) => {
              fetchMeals(user.id);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("User already exists");
          fetchMeals(user.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!meals || meals.length === 0) {
    return (
      <EmptyMealsState fetchMeals={fetchMeals}/>
    );
  }

  return (
    <div className="container-fluid">
      <div className="gen--header">
        <Header /> {/* Displays app name and logo*/}
        <Filters /> {/* Displays filtering options for meal selection */}
        {/* Animated button for generating new meal recommendations */}
        <motion.div
          whileTap={{ scale: 0.85 }} // Adds a shrinking effect when clicked
          className="gen--button--container mb-3 mt-5"
        >
          <motion.button 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.9, duration: 0.5 }}
           whileHover={{ 
             scale: 1.05,
             transition: { type: "spring", stiffness: 400, damping: 10 }
           }}
          onClick={fetchMeals} className="btn w-20 gen--button">
            Give Me New Meals!
          </motion.button>
        </motion.div>
      </div>

      {/* Meal Display Section */}
      <div className="container-fluid">
        <div className="meal--cards  flex-grid gap-4 d-md-flex col-md-12">
          {/* Renders three meal suggestion cards */}
          {!isLoading ? (
            meals.map((meal, index) => <MealCard key={index} meal={meal} />)
          ) : (
            <div className="loading--spinner mt-5"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generator;
