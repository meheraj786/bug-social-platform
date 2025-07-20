import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import Flex from "../../layouts/Flex";
import { LuPenLine } from "react-icons/lu";
import { RiHome2Line, RiLoginCircleFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { FaRegQuestionCircle, FaRegUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import Logo from "../../layouts/Logo";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { BiLogOutCircle } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const dispatch= useDispatch()
  const navigate= useNavigate()
  const user= useSelector((state)=>state.user.user)

    const signOutHandler=()=>{
      const auth = getAuth();
  signOut(auth).then(() => {
  {dispatch(clearUser())
                navigate("/")
                toast.success("Logout Success");
                localStorage.removeItem("user")
              }
  }).catch((error) => {
    console.log(error.message);
    
  });
    }

  
  return (
    <div className="bg-black fixed w-full  z-[999] font-primary text-white py-4">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <Container>
        <Flex className="justify-center lg:justify-between gap-y-5 lg:gap-y-0">
          <Logo/>

          <Flex>
            <NavLink to="/" className="flex items-center gap-x-1 mx-5">
              <RiHome2Line /> Home
            </NavLink>
            <NavLink to="/blogs" className="flex items-center gap-x-1 mx-5">
              <CgNotes />
              My Blogs
            </NavLink>
            {
              user ? (<>
              <NavLink to={`/profile/${user.uid}`} className="flex items-center gap-x-1 mx-5">
              <FaRegUserCircle />
              Profile
            </NavLink>
              <div onClick={signOutHandler} className="flex cursor-pointer items-center gap-x-1 mx-5">
              <BiLogOutCircle />
              Logout
            </div>
              </>) : <NavLink to="/auth" className="flex items-center gap-x-1 mx-5">
              <RiLoginCircleFill />
              Signup
            </NavLink>
            }
            
          </Flex>
        </Flex>
      </Container>
    </div>
  );
};

export default Navbar;
