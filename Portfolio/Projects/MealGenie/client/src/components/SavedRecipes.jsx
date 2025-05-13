import React from 'react'
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import { motion, AnimatePresence } from "motion/react"; 

import MealCard from "./MealCard"; 
import "../styles/savedrecipes.css"; 
import Header from "./Header"; 
import EmptySavedMeals from './EmptySavedMeals';

const SavedRecipes = () => {
  const { user, isLoaded } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const endpoint = "http://localhost:3000/mealgenie/savedrecipes";

  const getSavedMeals = () => {
    // Make sure user is loaded first
    if (!isLoaded || !user) return;

    setIsLoading(true);

    // fetch for saved meals based on userID, push to savedRecipes array
    fetch(`${endpoint}?userID=${user.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data, "GET");
      setSavedRecipes(data || []); //set to savedRecipes to empty array if no data returned
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error fetching saved recipes:", error.message);
      setSavedRecipes([]); // Set empty array on error
      setIsLoading(false);
    });
  };

  // Funtion to remove a recipe from the UI
  const removeRecipe = (recipeId) => {
    // Filter the savedRecipes array to remove the recipe with the given ID and update the savedRecipes state
    setSavedRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
  };

  // Make sure getSavedMeals is NOT called until user is loaded
  useEffect(() => {
    if (isLoaded && user) {
      getSavedMeals();
    }
  }, [isLoaded, user]);

  // If the page is not loading and there are no saved recipes returned, show the empty state component
  if (!isLoading && (!savedRecipes || savedRecipes.length === 0)) {
    return (
      <>
        <EmptySavedMeals />
      </>
    );
  }

  return (
    <div>
      <Header />
      <div className="meal--cards recipes-grid">
        {isLoading ? (
          <div className="loading--spinner mt-5"></div>
        ) : (
          // AnimatePresence is used for the exit animations
          <AnimatePresence mode="popLayout">
          {savedRecipes.map((meal, index) => (
            <motion.div
              key={meal.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring", stiffness: 300, damping: 20,
                duration: 0.3, delay: index * 0.2 }}
              style={{ flex: '1 0 250px', margin: '10px' }} 
            >
              <MealCard meal={meal} onRemove={removeRecipe} />
            </motion.div>
          ))}
        </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;