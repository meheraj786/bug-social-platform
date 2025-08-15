import React from "react";
import { PenTool, Sparkles } from 'lucide-react';

const NoBlog = () => {
  return (
    <div className="w-full max-w-lg mx-auto px-6 py-20">
      <div className="relative text-center bg-gradient-to-br from-white via-gray-50/80 to-blue-50/40 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-16 shadow-2xl shadow-gray-900/5 overflow-hidden group hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-500">
        
        {/* Floating background elements */}
        <div className="absolute top-4 right-6 w-20 h-20 bg-gradient-to-br from-blue-100/60 to-purple-100/60 rounded-full blur-2xl opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-6 left-4 w-16 h-16 bg-gradient-to-tr from-pink-100/50 to-orange-100/50 rounded-full blur-xl opacity-30 group-hover:scale-105 transition-transform duration-500"></div>
        
        {/* Icon with floating sparkle */}
        <div className="relative mb-8 inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-xl shadow-gray-400/20 group-hover:scale-105 group-hover:shadow-gray-400/30 transition-all duration-300">
            <PenTool size={32} className="text-gray-500 group-hover:text-gray-600 transition-colors duration-300" strokeWidth={1.5} />
          </div>
          
          {/* Animated sparkle */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <Sparkles size={12} className="text-white" />
          </div>
        </div>

        {/* Title with gradient */}
        <h2 className="text-3xl font-black bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-4 tracking-tight">
          No blogs yet
        </h2>

        {/* Modern subtitle */}
        <p className="text-gray-500 text-base font-medium leading-relaxed opacity-80">
          Your stories are waiting to be told ✨
        </p>

        {/* Subtle accent line */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-6 opacity-60"></div>
      </div>
    </div>
  );
};

export default NoBlog;