import React, { useState, useEffect } from "react";

import { SignUp, useSignUp } from "@clerk/clerk-react";

import { useNavigate } from "react-router";

import "../styles/registration.css";
import { GiMagicLamp } from "react-icons/gi";

//Stock images for the image carousel on Hero page
import image1 from "../assets/HeroFood/pancakes.jpg";
import image2 from "../assets/HeroFood/tacos.jpg";
import image3 from "../assets/HeroFood/pizza.jpg";
import image4 from "../assets/HeroFood/hamburger.jpg";
import image5 from "../assets/HeroFood/noodles.jpg";
import image6 from "../assets/HeroFood/spring-roll.jpg";

//Import Motion library for animations
import * as motion from "motion/react-client";

const Registration = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    diets: [],
    preferences: [],
    intolerances: [],
  });

  const [pendingverification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Image Carousel State
  const images = [image1, image2, image3, image4, image5, image6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Image Carousel Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // Start fade-in
      }, 500); // Short delay between fade in and fade out
    }, 4000); // Image changes every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  // Current Step State
  const [step, setStep] = useState(1);

  // Filters state
  const [filterToggles, setFilterToggles] = useState({
    //Cuisine Types
    Mexican: false,
    American: false,
    Chinese: false,
    Asian: false,
    Greek: false,
    Italian: false,
    Japanese: false,
    Indian: false,

    //Diets
    Paleo: false,
    Keto: false,
    Vegan: false,
    Vegetarian: false,
    Pescatarian: false,

    //Intolerances
    Dairy: false,
    Egg: false,
    Gluten: false,
    Peanut: false,
    Seafood: false,
    Shellfish: false,
    Soy: false,
    "Tree Nut": false,
  });

  const diets = [
    "Gluten Free",
    "Keto",
    "Paleo",
    "Pescatarian",
    "Vegan",
    "Vegetarian",
  ];

  const mealPreferences = [
    "Asian",
    "American",
    "Chinese",
    "Greek",
    "Indian",
    "Italian",
    "Japanese",
    "Mexican",
  ];

  const mealIntolerances = [
    "Dairy",
    "Egg",
    "Gluten",
    "Peanut",
    "Seafood",
    "Shellfish",
    "Soy",
    "Tree Nut",
  ];

  const toggleFilters = (filterName) => {
    setFilterToggles((prev) => ({ ...prev, [filterName]: !prev[filterName] }));

    setFormData((prev) => {
      const isPreference = mealPreferences.includes(filterName);
      const isIntolerance = mealIntolerances.includes(filterName);
      const isDiets = diets.includes(filterName);

      if (isPreference) {
        const newPreferences = prev.preferences.includes(filterName)
          ? prev.preferences.filter((item) => item !== filterName)
          : [...prev.preferences, filterName];
        return { ...prev, preferences: newPreferences };
      }

      if (isIntolerance) {
        const newIntolerances = prev.intolerances.includes(filterName)
          ? prev.intolerances.filter((item) => item !== filterName)
          : [...prev.intolerances, filterName];
        return { ...prev, intolerances: newIntolerances };
      }

      if (isDiets) {
        const newDiets = prev.diets.includes(filterName)
          ? prev.diets.filter((item) => item !== filterName)
          : [...prev.diets, filterName];
        return { ...prev, diets: newDiets };
      }

      return prev;
    });
  };

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Move to next step
  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  // Handle form submission (API call placeholder)
  // const handleSubmit = () => {
  //   console.log("Form submitted:", formData);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      setError(error.errors[0].message);
    }
  };

  const [verificationCode, setVerificationCode] = useState("");

  const handleVerification = async () => {
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Verification failed:", error.errors);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <motion.div
      initial={{
        backgroundImage:
          "linear-gradient(135deg, #0a0f1d 0%, #2c3e50 50%, #073b24 100%)",
      }}
      animate={{
        backgroundImage: [
          "linear-gradient(135deg, #0a0f1d 0%, #2c3e50 50%, #073b24 100%)",
          "linear-gradient(225deg, #073b24 0%, #0a0f1d 50%, #2c3e50 100%)",
          "linear-gradient(315deg, #2c3e50 0%, #073b24 50%, #0a0f1d 100%)",
          "linear-gradient(45deg, #2c3e50 0%, #0a0f1d 50%, #073b24 100%)",
        ],
        transition: {
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        },
      }}
      className="registration--container vh-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="row mt-0 align-items-center">
          {/* Image Carousel Column */}
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <motion.div
              className="image-container"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                className={`img-fluid hero-image ${
                  fade ? "fade-in" : "fade-out"
                }`}
                src={images[currentIndex]}
                alt={`Artwork ${currentIndex + 1}`}
                style={{
                  maxHeight: "500px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
            </motion.div>
          </div>

          {/* Registration Form Column */}
          <div className="col-md-6 d-flex mt-3 flex-column justify-content-center align-items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="signUp--container w-100 shadow"
            >
              <div className="row">
                <motion.div
                  className="logo--container text-center m-0"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <GiMagicLamp className="logo--icon" />
                  <h2 className="heroName fw-bold">Meal Genie</h2>
                </motion.div>
              </div>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <SignUp signInUrl="/" />
              </div>
            </motion.div>

            {/* Log In Redirect */}
            {/* <span className="mb-0 d-flex">
              <motion.div className="mt-3">
                <p className="text-center">
                  Already have an account?
                  <motion.button
                    className="btn mt-0 bg-none w-25 login--button"
                    onClick={() => navigate("/")}
                    whileTap={{ scale: 0.9 }}
                  >
                    Log In
                  </motion.button>
                </p>
              </motion.div>
            </span> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const subItemList = {
  padding: 0,
};

const subItem = {
  backgroundColor: "var(--primary-color)",
  justifyContent: "center",
  textAlign: "center",
  padding: 5,
  margin: 3,
  borderRadius: "5px",
  listStyle: "none",
  marginBottom: "0.25rem",
  cursor: "pointer",
  fontSize: "1rem",
};

export default Registration;
