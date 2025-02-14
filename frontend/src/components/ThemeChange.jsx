import React from 'react';
import { useTheme } from "../../context/ThemeContext";

const ThemeChange = () => {
    
    const { theme, toggleTheme } = useTheme();
    const handleSelectTheme = (selectedTheme) => {
        if (theme !== selectedTheme) {
          toggleTheme(); // Switch the theme if it's different
        }
      }
    
  return (
    <div className='m-2'>
      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
              Theme Settings
        </h3>

        <div className="flex flex-col space-y-3">
        {/* Light Theme */}
        <button
          className={`flex items-center p-3 rounded-md cursor-pointer transition ${
            theme === "light"
              ? "bg-blue-300 text-white shadow-lg"
              : "bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
          }`}
          onClick={() => handleSelectTheme("light")}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              theme === "light" ? "bg-white border-blue-500" : "border-gray-500"
            }`}
          >
            {theme === "light" && (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            )}
          </div>
          Light
        </button>

        {/* Dark Theme */}
        <button
          className={`flex items-center p-3 rounded-md cursor-pointer transition ${
            theme === "dark"
              ? "bg-slate-800 text-white shadow-lg"
              : "bg-slate-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
          onClick={() => handleSelectTheme("dark")}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
              theme === "dark" ? "bg-white border-blue-500" : "border-gray-500"
            }`}
          >
            {theme === "dark" && (
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            )}
          </div>
          Dark
        </button>
      </div>
    </div>
  )
}

export default ThemeChange
