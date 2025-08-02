import React from "react";
import { LuPenLine } from "react-icons/lu";

const NoBlog = () => {
  return (
    <div className="blogCard mx-20 text-center w-full p-10 bg-white rounded-lg ">
      <LuPenLine size={60} className="mx-auto" color="#9CA3AF" />
      <h2 className="font-primary text-[32px] text-black mt-4 mb-2">
        No blogs yet
      </h2>
      <p className="font-secondary text-gray-400">
        Be the first to share your thoughts!
      </p>
    </div>
  );
};

export default NoBlog;
