/**
 * Theme Provider Component
 *
 * Manages the application's theme state (light/dark/system).
 * Provides context for theme control across the application.
 */

"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Available theme options
 */
type Theme = "light" | "dark" | "system";

/**
 * Props for the ThemeProvider component
 */
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

/**
 * Theme context state interface
 */
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * ThemeProvider component that manages theme state
 *
 * @param props - Component props
 * @returns ThemeProvider component
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "videoai-theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(defaultTheme);
    }
  }, [defaultTheme, storageKey]);

  // Apply theme to HTML element
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    // Add theme class to root element
    root.classList.add(theme);

    // Add or remove no-transition class to prevent transitions during theme change
    if (disableTransitionOnChange) {
      root.classList.add("no-transition");
      window.setTimeout(() => {
        root.classList.remove("no-transition");
      }, 0);
    }
  }, [theme, enableSystem, disableTransitionOnChange]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Hook to access the theme context
 *
 * @returns Theme context with current theme and setTheme function
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
