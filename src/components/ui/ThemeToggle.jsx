import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // 1. Check saved theme
        const isDark = localStorage.getItem("theme") === "dark";
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDarkMode(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-300
      bg-gray-200 text-gray-800 hover:bg-gray-300
      dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
            aria-label="Toggle Theme"
        >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
