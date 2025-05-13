import React from "react";
import { motion } from "motion/react"; 
import { GiKnifeFork } from "react-icons/gi";
import Header from "./Header";

const EmptySavedMeals = () => {
  return (
    <div className="container-fluid">
      <div className="gen--header">
        <Header />
       
      </div>
      <div className="container-fluid">
        <div className="d-flex flex-column text-center">
          {/* Animated icon with bounce effect */}
          <motion.div 
            className="m-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 10, 
              duration: 0.8 
            }}
          >
            <GiKnifeFork size={48} className="no--meals--icon" />
          </motion.div>

          {/* Animated heading with fade-in */}
          <motion.h2 
            className="mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            No Meals Available
          </motion.h2>

          {/* Animated paragraphs with sequential fade-in */}
          <motion.p 
            className="lead p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            You don't have any meals saved right now 😕
          </motion.p>
          <motion.p 
            className="lead p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Come back after saving your favorite meals!
          </motion.p>

        </div>
      </div>
    </div>
  );
};

export default EmptySavedMeals;