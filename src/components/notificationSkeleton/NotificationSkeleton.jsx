import { motion } from "framer-motion";
import React from "react";

export default function NotificationSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          className="group relative bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg p-6 flex gap-4 animate-pulse overflow-hidden"
        >
          {/* Left color bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-200 to-gray-300"></div>

          {/* Icon placeholder */}
          <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-2xl"></div>

          {/* Content placeholder */}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="flex items-center gap-3">
              <div className="h-3 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded-full w-14"></div>
            </div>
          </div>

          {/* Delete button placeholder */}
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
        </motion.div>
      ))}
    </div>
  );
}
