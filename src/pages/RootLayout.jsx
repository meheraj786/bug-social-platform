import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/footer/Footer";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-[120px]">
      <Outlet />
      </div>
      <Footer/>
    </>
  );
};

export default RootLayout;
