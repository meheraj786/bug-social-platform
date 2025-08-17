import React from "react";

const TypingAnimation = ({ size = "sm", variant = "default" }) => {
  const sizeClasses = {
    xs: "w-1 h-1",
    sm: "w-2 h-2", 
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const variants = {
    default: "bg-gray-400",
    primary: "bg-blue-500",
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
    success: "bg-green-500",
    warning: "bg-yellow-500"
  };

  return (
    <div className="flex items-center justify-center gap-1 p-2">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`
              ${sizeClasses[size]} 
              ${variants[variant]}
              rounded-full 
              animate-bounce
              shadow-sm
              transition-all 
              duration-300 
              ease-in-out
            `}
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: "0.8s",
              animationTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
            }}
          />
        ))}
      </div>
      <span className="ml-2 text-xs text-gray-500 font-medium animate-pulse">
        typing...
      </span>
      
      {/* Alternative wave animation */}
      <style jsx>{`
        @keyframes wave {
          0%, 40%, 100% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-8px);
          }
        }
        
        .wave-animation {
          animation: wave 1.2s infinite ease-in-out;
        }
        
        .wave-1 { animation-delay: 0s; }
        .wave-2 { animation-delay: 0.2s; }
        .wave-3 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

// Advanced version with multiple animation styles
export const AdvancedTypingAnimation = ({ 
  style = "dots", 
  color = "blue",
  showText = true 
}) => {
  if (style === "wave") {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex items-end gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-1 bg-${color}-500 rounded-full wave-animation wave-${index + 1}`}
              style={{ height: '12px' }}
            />
          ))}
        </div>
        {showText && (
          <span className="text-xs text-gray-500 animate-pulse">typing...</span>
        )}
      </div>
    );
  }

  if (style === "pulse") {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 bg-${color}-500 rounded-full animate-pulse`}
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {showText && (
          <span className="text-xs text-gray-500">typing...</span>
        )}
      </div>
    );
  }

  // Default dots animation
  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`
              w-2.5 h-2.5 
              bg-gradient-to-r from-${color}-400 to-${color}-600
              rounded-full 
              animate-bounce
              shadow-lg
              transform-gpu
            `}
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: "1s",
              animationTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              willChange: "transform"
            }}
          />
        ))}
      </div>
      {showText && (
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600 font-medium">Someone</span>
          <span className="text-xs text-gray-400 animate-pulse">is typing...</span>
        </div>
      )}
    </div>
  );
};

// Chat bubble style typing animation
export const ChatBubbleTyping = ({ 
  isOwnMessage = false,
  userName = "Someone" 
}) => {
  return (
    <div className={`flex items-end gap-3 mb-4 ${
      isOwnMessage ? "justify-end" : "justify-start"
    }`}>
      {!isOwnMessage && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      )}
      
      <div className={`
        relative max-w-[70%] px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm
        ${isOwnMessage 
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md" 
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
        }
      `}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full animate-bounce
                  ${isOwnMessage ? "bg-white/70" : "bg-gray-400"}
                `}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: "1.2s"
                }}
              />
            ))}
          </div>
          <span className={`text-xs ${
            isOwnMessage ? "text-white/70" : "text-gray-500"
          }`}>
            typing...
          </span>
        </div>
        
        {/* Message tail */}
        <div className={`
          absolute top-3 w-3 h-3 transform rotate-45
          ${isOwnMessage 
            ? "-right-1 bg-gradient-to-r from-blue-600 to-purple-600" 
            : "-left-1 g-gradient-to-r from-blue-600 to-purple-600 border-l border-b border-gray-200"
          }
        `}></div>
      </div>
    </div>
  );
};

export default TypingAnimation;