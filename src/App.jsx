import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Banner from "./components/banner/Banner";
import BlogPostForm from "./components/blogPostForm/BlogPostForm";
import BlogList from "./components/blogList/BlogList";

function App() {
  return (
    <>
      <Banner />
      <BlogPostForm />
      <BlogList />
    </>
  );
}

export default App;
