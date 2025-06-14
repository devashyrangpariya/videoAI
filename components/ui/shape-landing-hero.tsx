"use client";

import React from "react";
import { motion } from "framer-motion";

interface ShapeLandingHeroProps {
  title: React.ReactNode;
  subheading: string;
  image?: string;
  ctaButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}

export function ShapeLandingHero({
  title,
  subheading,
  image,
  ctaButton,
  secondaryButton,
}: ShapeLandingHeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-purple-600 to-blue-600 overflow-hidden py-20 md:py-28">
      {/* Background grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      </div>
      
      {/* Floating shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/4 left-10 md:left-32 w-24 h-24 md:w-40 md:h-40 rounded-full bg-purple-400 bg-opacity-30 blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 3, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-1/4 right-10 md:right-32 w-32 h-32 md:w-56 md:h-56 rounded-full bg-blue-400 bg-opacity-30 blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-1/2 left-1/3 w-20 h-20 md:w-32 md:h-32 rounded-full bg-pink-400 bg-opacity-30 blur-2xl"
      />
      
      <div className="relative container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 mb-10"
          >
            {subheading}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {ctaButton}
            {secondaryButton}
          </motion.div>
        </div>
        
        {/* Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full lg:w-1/2 max-w-lg xl:max-w-xl"
          >
            <img
              src={image}
              alt="Hero"
              className="w-full h-auto object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
