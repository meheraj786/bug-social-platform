import React from 'react'

const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse w-full max-w-2xl border border-gray-300 rounded-2xl p-8 shadow-md">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-28 h-28 rounded-full bg-gray-300 mb-2"></div>
        <div className="h-4 w-40 bg-gray-300 rounded mb-1"></div>
        <div className="h-3 w-32 bg-gray-300 rounded"></div>
      </div>

      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
        ))}
        <div className="h-20 bg-gray-300 rounded w-full"></div>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="h-10 bg-gray-300 rounded w-full"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
};


export default ProfileSkeleton