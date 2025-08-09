import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Banner from "./components/banner/Banner";
import BlogPostForm from "./components/blogPostForm/BlogPostForm";
import BlogList from "./components/blogList/BlogList";
import ProfileSidebar from "./components/profileSidebar/ProfileSidebar";
import FriendList from "./components/userList/UserList";
import FeatureImage from "./components/featureImage/FeatureImage";

function App() {
  return (
    <>
      {/* <Banner /> */}
      <FeatureImage/>
      <ProfileSidebar/>
      <FriendList/>
      <BlogPostForm />
      <BlogList />
    </>
  );
}

export default App;
