import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-[120px]">
      <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
