import React from "react";
import Flex from "../../layouts/Flex";

const BlogCardSkeleton = () => {
return (
  <div className="w-full max-w-4xl font-secondary mx-auto mb-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden animate-pulse">
    {/* Header Section */}
    <div className="p-6 font-primary pb-4 flex justify-between items-start">
      <div className="flex gap-4 items-center flex-1">
        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>

    {/* Content Section */}
    <div className="px-6 pb-4">
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
    </div>

    {/* Comments Section */}
    <div className="px-6 py-4 bg-gradient-to-br from-gray-50/50 to-white border-t border-gray-100 space-y-3">
      {/* Comment Form Skeleton */}
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Comment List Skeleton */}
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  </div>
);

};

export default BlogCardSkeleton;
