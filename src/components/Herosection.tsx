"use client";
import React from "react";
import { BackgroundLines } from "./ui/background-lines";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <BackgroundLines className="relative flex items-center justify-center text-center min-h-screen w-full">
      <div className="z-10 py-20 md:py-40 px-0">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600 font-inter"
        >
          SonicScribe AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-4 text-lg md:text-xl font-inter text-muted-foreground"
        >
          Intelligence that Listens. Precision that Heals.
        </motion.p>
      </div>
    </BackgroundLines>
  );
};
