/**
 * Utility Functions
 * 
 * This module provides common utility functions used throughout the application.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * 
 * This utility helps merge Tailwind CSS classes without conflicts,
 * allowing conditional classes and variants to be applied properly.
 * 
 * @param inputs - Class values to be merged
 * @returns A string of merged class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
