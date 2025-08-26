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
import PageSidebar from "./layouts/PageSidebar";
import GroupListSidebar from "./layouts/GroupListSidebar";
import Friends from "./components/friends/Friends";

function App() {
  return (
    <>
      <FeatureImage/>
      <ProfileSidebar/>
      <Friends/>
      <FriendList/>
      <GroupListSidebar/>
      <PageSidebar/>
      <BlogPostForm />
      <BlogList />
    </>
  );
}

export default App;
