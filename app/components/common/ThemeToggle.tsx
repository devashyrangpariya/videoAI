/**
 * Theme Toggle Component
 *
 * Button component that toggles between light, dark, and system themes.
 * Uses the ThemeProvider context to manage theme state.
 */

"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  /**
   * Toggle between light, dark, and system themes
   */
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-orange-500" />
      ) : theme === "dark" ? (
        <Moon className="h-5 w-5 text-blue-500" />
      ) : (
        <Laptop className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      )}
    </button>
  );
}
