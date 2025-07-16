import React from "react";
import Flex from "../../layouts/Flex";

const BlogCardSkeleton = () => {
  return (
    <div className="blogCard mb-5 bg-white rounded-lg animate-pulse">
      <div className="p-6">
        <Flex className="justify-between items-center">
          <Flex className="gap-x-3 items-center">
            <div className="w-6 h-6 rounded-full bg-gray-300"></div>
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full mx-2"></div>
            <div className="w-32 h-4 bg-gray-300 rounded flex items-center gap-x-1"></div>
          </Flex>
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </Flex>

        <div className="mt-5 mb-3 w-full h-6 bg-gray-300 rounded"></div>
        <div className="w-28 h-4 bg-gray-300 rounded"></div>
      </div>

      <div className="p-6 bg-gray-50 rounded-b-lg border-t border-gray-200">
        <Flex className="justify-between items-center">
          <div className="w-40 h-4 bg-gray-300 rounded"></div>
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
        </Flex>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
