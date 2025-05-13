import React from "react";
import { useState, useEffect } from "react";
import parse from "html-react-parser";
import { useUser } from "@clerk/clerk-react";
import { TbArrowBack } from "react-icons/tb";
import { FaClock, FaHeart, FaBookmark, FaTrashAlt } from "react-icons/fa";

// Importing Motion for animation effects
import * as motion from "motion/react-client";

// CSS styling
import "../styles/mealcard.css";

/**
 * Interactive card that displays meal information on the front
 * and recipe details on the back with a flip animation.
 *
 * Features:
 * - Interactive flip animation using motion library
 * - Separate front/back views
 */

const MealCard = ({ meal, onRemove, isSavedPage = false }) => {
  const { user, isLoaded } = useUser();

  // State for tracking whether the card is flipped (front=false, back=true)
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [isSaved, setIsSaved] = useState(isSavedPage);
  const [saveAnimating, setSaveAnimating] = useState(false);

  const baseURL = "http://localhost:3000/mealgenie/savedrecipes"; //saved

  // Check if recipe is already saved when component mounts
  useEffect(() => {
    // If the user is loaded, the meal is available, and not currently on the saved page, then check if the user has the meal saved
    if (isLoaded && user && meal && !isSavedPage) {
      checkIfSaved();
    }
    // If any of the dependencies change, re-run the check. meal?.id ensures check only runs if meal is available
  }, [isLoaded, user, meal?.id, isSavedPage]);

  // Check if the recipe is already saved by this user
  const checkIfSaved = () => {
    if (!user || !meal) return;

    // Fetch the saved recipes for the user
    fetch(
      `http://localhost:3000/mealgenie/allsavedrecipes?userID=${user.id}&recipeID=${meal.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      // Data 
      .then((data) => {
        // If response is DELETE, it means recipe is already saved, setIsSaved to true
        setIsSaved(data === "DELETE");
      })
      .catch((error) => console.error(error.message));
  };

  /**
   * Handles the card flip animation
   * Checks if an animation is already in progress before allowing state change
   */
  const handleCardFlip = () => {
    if (!isAnimated) {
      setIsFlipped(!isFlipped);
      setIsAnimated(true);
    }
  };

  const handleSaveMeal = (meal) => {
    // Start save animation (pulse icon)
    setSaveAnimating(true);

    fetch(
      `http://localhost:3000/mealgenie/allsavedrecipes?userID=${user.id}&recipeID=${meal.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(`GET RESPONSE: ${data}`);

        if (data == "PUT") {
          fetch(`${baseURL}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipeID: meal.id,
              userID: user.id,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "PUT");
              setIsSaved(true);
            })
            .catch((error) => console.error(error.message));
        } else if (data == "DELETE") {
          fetch(`${baseURL}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              recipeID: meal.id,
              userID: user.id,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "DELETE");
              setIsSaved(false);

              if (onRemove) {
                onRemove(meal.id);
              }
            })
            .catch((error) => console.error(error.message));
        } else if (data == "POST") {
          fetch(`${baseURL}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: meal.id,
              title: meal.title,
              image: meal.image,
              summary: meal.summary,
              extendedIngredients: meal.extendedIngredients,
              analyzedInstructions: meal.analyzedInstructions,
              usersSaved: [user.id],
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data, "POST");
              setIsSaved(true);
            })
            .catch((error) => console.error(error.message));
        }

        // Stop save animation after 500ms
        setTimeout(() => setSaveAnimating(false), 500);
      })
      .catch((error) => {
        console.error(error.message);
        setSaveAnimating(false);
      });
  };

  if (!meal) {
    return (
      <div className="loading--spinner d-flex justify-content-center text-center"></div>
    );
  }

  return (
    // motion.div provides animation capabilities
    // The entire card container handles the 3D flip transition
    <motion.div
      className="meal--card container justify-content-center align-items-center d-md-flex"
      animate={{ rotateY: isFlipped ? 180 : 0 }} // Flip animation: 0 (front) => 180 (back)
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => setIsAnimated(false)}
    >
      {/* 
        Front side of the card
        Contains meal preview information and image
        Visible when isFlipped is false
      */}
      <div className="meal--card--front">
        <div className="img--container">
          <img
            className="card--img"
            src={meal.image}
            alt={meal.title}
            loading="lazy"
          />

          {/* Save and Delete button */}
          <span
            onClick={() => handleSaveMeal(meal)}
            className={`save--recipe ${isSaved ? "saved" : ""} ${
              saveAnimating ? "animate" : ""
            }`}
            title={isSaved ? "Remove from saved recipes" : "Save recipe"}
          >
            {isSaved ? <FaTrashAlt /> : <FaBookmark />}
          </span>

          {/* Image overlay */}
          <div className="image--overlay d-flex flex-column">
            <span onClick={handleCardFlip} className="view--recipe">
              View Recipe
            </span>
            <div className="recipe-meta">
              <span title="Cook time">
                <FaClock /> {meal.readyInMinutes}
              </span>
              <span title="Calories">
                <FaHeart /> {meal.aggregateLikes}
              </span>
            </div>
          </div>
        </div>

        {/* Meal Title */}
        <div className="card--header text-center">
          <h3>{meal.title}</h3>
        </div>
      </div>

      {/*
       * Back side of the meal card:
       * Contains recipe details (ingredients and instructions)
       * Visible when isFlipped is true
       */}

      <div className="container meal--card--back justify-content-center align-items-center text-align-center d-md-flex col-sm-4 flex-column">
        {/* Recipe Name */}
        <h5>Recipe: {meal.title}</h5>

        {/* Scrollable Container for Ingredients and Instructions */}
        <div className="scrollable--content">
          {/* Meal Summary */}
          <div className="text-start summary--container mt-3 mb-3">
            <p>
              <strong>Summary:</strong>
            </p>
            {parse(meal.summary)}
          </div>

          {/* Ingredients List */}
          <p>
            <strong>Ingredients:</strong>
          </p>
          {/* text-start places text at start of viewport (card) */}
          <ul className="text-start">
            {/* Check to make sure this data exists. Fallback message if it does not */}
            {meal.extendedIngredients && meal.extendedIngredients.length > 0 ? (
              meal.extendedIngredients
                .map((ing) => ing.original)
                .map((step, index) => <li key={index}>{step}</li>)
            ) : (
              <li>No ingredient information available for this recipe.</li>
            )}
          </ul>

          {/* Instructions List */}
          <p>
            <strong>Instructions:</strong>
          </p>
          <ol className="text-start">
            {/* Check to make sure this data exists. Fallback message if it does not */}
            {meal.analyzedInstructions &&
            meal.analyzedInstructions[0]?.steps ? (
              meal.analyzedInstructions[0].steps
                .map((step) => step.step)
                .map((step, index) => <li key={index}>{step}</li>)
            ) : (
              <li>No detailed instructions available for this recipe.</li>
            )}
          </ol>
        </div>

        {/* Back Button */}
        <motion.div whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.85 }}>
          <TbArrowBack onClick={handleCardFlip} className="back--button" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MealCard;
