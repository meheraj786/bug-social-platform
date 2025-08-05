import { createPortal } from "react-dom";
import React from "react";
import { Link } from "react-router";

const FullScreenOverlay = ({ reactors, setReactionPop }) => {
return createPortal(
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-[9999] p-4">
    {/* Modal Container */}
    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[80vh] overflow-hidden animate-modalSlideIn">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Reactions</h2>
              <p className="text-sm text-gray-500">{reactors.length} {reactors.length === 1 ? 'person reacted' : 'people reacted'}</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setReactionPop(false)}
            className="group w-10 h-10 bg-gray-100 hover:bg-red-100 rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {reactors.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No reactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to react!</p>
          </div>
        ) : (
          // Reactors List
          <ul className="space-y-2">
            {reactors.map((reactor, index) => (
              <li
                key={reactor.id}
                className="group animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link 
                  to={`/profile/${reactor.reactorId}`}
                  className="block"
                  onClick={() => setReactionPop(false)}
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-blue-200/50">
                    
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={reactor.imageUrl}
                        alt={reactor.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-lg group-hover:border-blue-300 transition-all duration-300"
                      />
                      
                      {/* Reaction Icon Overlay */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors truncate">
                        {reactor.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Reacted to your post
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>,
  document.body
);
};

export default FullScreenOverlay;
