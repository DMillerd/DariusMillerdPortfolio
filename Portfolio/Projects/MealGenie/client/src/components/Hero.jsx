import React, { useState, useEffect } from "react";
//import motion for all animations from motion react
import { motion } from "motion/react";
import ThemeButton from "./ThemeButton";

// React icon for genie lamo
import { GiMagicLamp } from "react-icons/gi";

//Styling for Hero page
import "../styles/Hero.css";

//Stock images for the image carousel on Hero page
import image1 from "../assets/HeroFood/pancakes.jpg";
import image2 from "../assets/HeroFood/tacos.jpg";
import image3 from "../assets/HeroFood/pizza.jpg";
import image4 from "../assets/HeroFood/hamburger.jpg";
import image5 from "../assets/HeroFood/steak.jpg";
import image6 from "../assets/HeroFood/spring-roll.jpg";

import {
  SignIn,
  SignedOut,
} from "@clerk/clerk-react";

// onLogin prop getting passed down to Hero component from parent component (App.jsx). Gives access to the handleLogin function and ability to update isLoggedIn state
const Hero = () => {
  //Array of images that image carousel will scroll through
  const images = [image1, image2, image3, image4, image5, image6];

  //useState hook to track the current index of the image in the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  //Controls the the fade in and fade out effects on the images
  const [fade, setFade] = useState(true);

  //useEffect hook to handle the transitions of the image carousel
  useEffect(() => {
    //interval function calling setInterval function which is used to for the timing of the images fading in and out.
    const interval = setInterval(() => {
      setFade(false); // Start fade-out
      // setTimeout function used to specify the length of time between images fading in and out
      setTimeout(() => {
        // Update currentIndex to the next image, looping back to the first image after the last one
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // Start fade-in
      }, 500); // Short delay between fade in and fade out
    }, 4000); // Image changes every 4 seconds

    return () => clearInterval(interval);
  }, []); //Empty dependency array to ensure useEffect only runs once on initial render.


  return (
    <div className="hero-container">
      <ThemeButton />
      <div className="container text-center">
        <div className="row align-items-center">
          {/* Image Carousel (Left Side) */}
          <div className="col-md-6">
            <img
              // Conditional statement for image carousel. If fade is true the image will fade in (animation effect from CSS) then fade out after 4 seconds (specified in the setTimeout function)
              className={`img-fluid hero-image ${
                fade ? "fade-in" : "fade-out"
              }`}
              //SRC and ALT update dynamically based on the current index of the image in the carousel
              src={images[currentIndex]}
              alt={`Artwork ${currentIndex + 1}`}
            />
          </div>

          {/* Login Form (Right Side) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="col-md-6 d-flex form--container mt-3 flex-column justify-content-center align-items-center"
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              className="logo--container"
            >
              <GiMagicLamp className="logo--icon" />
              <h1 className="heroName display-4 fw-bold">Meal Genie</h1>
            </motion.div>

            <SignedOut>
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "clerk-root-box",
                    card: "clerk-card",
                    headerTitle: "clerk-header-title",
                    socialButtons: "clerk-social-buttons",
                    dividerLine: "clerk-divider-line",
                    formFieldLabel: "clerk-form-label",
                    formButtonPrimary: "btn btn-primary meal--button",
                    footerActionLink: "clerk-footer-link",
                  },
                }}
                navigate={(to) => navigate(to)}
                signUpUrl="/registration"
                signInUrl="/dashboard"
              />
            </SignedOut>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
