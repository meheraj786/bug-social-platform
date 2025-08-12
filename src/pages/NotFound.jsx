import { Link } from "react-router";
import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-700 text-white p-6">
      <h1 className="text-[8rem] font-extrabold drop-shadow-lg">404</h1>
      <p className="text-2xl mb-6 font-medium">Oops! The page you’re looking for doesn’t exist.</p>
      
      <div className="relative mb-12">
        <div className="w-40 h-40 bg-white/10 rounded-full animate-ping absolute"></div>
        <div className="w-40 h-40 bg-white/20 rounded-full"></div>
      </div>

      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-white text-purple-700 font-semibold shadow-lg hover:scale-105 transform transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
