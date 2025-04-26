"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative flex items-center w-14 h-8 rounded-full p-1 bg-gray-200 dark:bg-gray-900"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute left-1 transition-transform duration-200
          ${theme === "light" ? "translate-x-0" : "translate-x-6"}`}
      >
        {theme === "light" ? (
          <Sun className="w-6 h-6 text-yellow-600" />
        ) : (
          <Moon className="w-6 h-6 text-blue-300" />
        )}
      </span>
    </button>
  )
} 