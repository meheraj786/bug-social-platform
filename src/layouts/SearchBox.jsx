import React, { useState } from 'react';
import { Search, TrendingUp, User, Users, Bookmark, Hash } from 'lucide-react';

const SearchBox = ({ onSearchClick }) => {


  const handleSearchClick = () => {
      onSearchClick();
    
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Box */}
      <div 
        onClick={handleSearchClick}
        className="relative w-full h-9 flex items-center justify-start bg-white/95 backdrop-blur-xl border-2 border-white/20 rounded-full cursor-pointer transition-all duration-300 hover:bg-white hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-0.5 group"
      >
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
          <Search className="w-3 h-3 text-blue-600 transition-all duration-300 group-hover:text-blue-700 group-hover:scale-110" />
        </div>
        <div className="pl-14 pr-14 py-4 text-gray-500 text-sm font-medium">
          Search friends, pages, groups...
        </div>
      </div>

    </div>
  );
};

export default SearchBox;