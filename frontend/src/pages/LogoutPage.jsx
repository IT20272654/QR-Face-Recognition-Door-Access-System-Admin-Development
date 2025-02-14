import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const LogoutPage = () => {
  return (
    <div className="flex h-screen">
      {/* Left Image Section */}
      <div className="w-1/3">
        <img
          src="/logoutimg.png" // Path relative to the public folder
          alt="Side Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Content Section */}
      <div className="w-2/3 flex flex-col justify-center items-center bg-gray-100 p-8">
        {/* Animated Green Tick Icon */}
        <div className="relative">
          <FaCheckCircle className="text-gray-300 text-8xl absolute animate-ping-once" />
          <FaCheckCircle className="text-green-500 text-8xl z-10 animate-draw-tick" />
        </div>

        {/* Horizontal Line */}
        <hr className="w-3/4 border-gray-300 mb-6 mt-8" />

        {/* Logout Text */}
        <h1 className="text-4xl font-bold mb-4">Logout Successful</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          You have been successfully logged out.
        </p>

        {/* Return Log In Button */}
        <Link
          to="/login" // Redirect to the login page
          className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 shadow-lg"
        >
          Return to Log In
        </Link>
      </div>
    </div>
  );
};

export default LogoutPage;
