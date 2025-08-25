import React from "react";
import { createPortal } from "react-dom";
import { FaBug } from "react-icons/fa";

const CustomLoader = () => {
  return createPortal(
    <div className="fixed top-0 left-0 w-full bg-white h-screen flex z-[99999] justify-center items-center">
      <div className="logo flex font-primary items-center gap-x-2 text-[50px] text-purple-500 font-black">
        <FaBug className="text-purple-500 bug-crawl" />
        BUG
      </div>
    </div>, 
    document.body
  );
};

export default CustomLoader;
