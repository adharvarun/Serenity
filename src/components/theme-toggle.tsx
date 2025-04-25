"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    className={`relative flex items-center w-14 h-8 rounded-full p-1 transition-colors duration-300 
      ${theme === "light" ? "bg-gray-300" : "bg-gray-700"}`}
    aria-label="Toggle theme"
  >
    <span
      className={`absolute left-1 transition-transform duration-300 transform 
        ${theme === "light" ? "translate-x-0" : "translate-x-6"}`}
    >
      {theme === "light" ? (
        <Sun className="w-6 h-6 text-black" />
      ) : (
        <Moon className="w-6 h-6 text-white" /> 
      )}
    </span>
  </button>
  )
} 