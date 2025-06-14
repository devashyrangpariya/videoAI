'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-950 py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 opacity-70"></div>

      {/* Purple blob */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        animate={{ opacity: 0.15, scale: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute top-1/4 right-0 w-96 h-96 bg-purple-700 rounded-full blur-3xl -z-10"
      ></motion.div>

      {/* Blue blob */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -100 }}
        animate={{ opacity: 0.15, scale: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="absolute bottom-0 left-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl -z-10"
      ></motion.div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Share Your Videos with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">World</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                Upload, share, and discover amazing videos with our AI-powered platform. Get smart recommendations and reach your audience effortlessly.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {session ? (
                <Link 
                  href="/video"
                  className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 inline-flex items-center justify-center"
                >
                  Browse Videos
                </Link>
              ) : (
                <>
                  <Link 
                    href="/register"
                    className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 inline-flex items-center justify-center"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/login"
                    className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium transition-colors duration-200 inline-flex items-center justify-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          <motion.div 
            className="lg:max-w-lg xl:max-w-xl w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[9/16] w-full max-w-sm mx-auto bg-gray-900 rounded-2xl overflow-hidden relative">
                {/* Decorative elements */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Phone frame mockup */}
                <div className="absolute inset-0 pointer-events-none border-[8px] border-gray-900 rounded-2xl"></div>
                
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-600/20"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 