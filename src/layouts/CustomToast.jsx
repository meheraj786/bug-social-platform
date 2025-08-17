import { X } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

const CustomToast = ({img, content, name, t}) => {
return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full transform transition-all duration-300`}
    >
      {/* Toast Container */}
      <div className="relative bg-white backdrop-blur-lg bg-opacity-95 shadow-2xl rounded-2xl pointer-events-auto overflow-hidden border border-gray-100">
        {/* Gradient Border Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600"></div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Avatar with gradient ring */}
            <div className="relative flex-shrink-0">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-0.5">
                <div className="bg-white rounded-full p-0.5">
                  {img ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={img}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                      ?
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Message Content */}
            <div className="flex-1 min-w-0 pt-1">
              {name && (
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {name}
                </p>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">
               {content}
              </p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={()=>toast.dismiss(t.id)}
              className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 group"
            >
              <X size={16} className="group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
      </div>
      
      {/* Shadow underneath */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-15 blur-lg transform scale-95 -z-10"></div>
    </div>
  );
}

export default CustomToast