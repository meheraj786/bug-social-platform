import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import Flex from "../../layouts/Flex";
import { LuPenLine } from "react-icons/lu";
import { RiHome2Line, RiLoginCircleFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { FaRegQuestionCircle, FaRegUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Logo from "../../layouts/Logo";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { BiLogOutCircle } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const dispatch= useDispatch()
  const navigate= useNavigate()
  // const [user,setUser]= useState(null)
  const user= useSelector((state)=>state.user.user)
  
  // useEffect(() => {
  // setUser(data)
 
  // }, [data])
  
  
  return (
    <div className="bg-black fixed w-full  z-[999] font-primary text-white py-4">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <Container>
        <Flex className="justify-center lg:justify-between gap-y-5 lg:gap-y-0">
          <Logo/>

          <Flex>
            <Link to="/" className="flex items-center gap-x-1 mx-5">
              <RiHome2Line /> Home
            </Link>
            <Link to="/blogs" className="flex items-center gap-x-1 mx-5">
              <CgNotes />
              Blogs
            </Link>
            {
              user ? (<>
              <Link to="/profile" className="flex items-center gap-x-1 mx-5">
              <FaRegUserCircle />
              Profile
            </Link>
              <div onClick={()=>{dispatch(clearUser())
                navigate("/")
                toast.success("Logout Success");
              }} className="flex cursor-pointer items-center gap-x-1 mx-5">
              <BiLogOutCircle />
              Logout
            </div>
              </>) : <Link to="/auth" className="flex items-center gap-x-1 mx-5">
              <RiLoginCircleFill />
              Signup
            </Link>
            }
            
          </Flex>
        </Flex>
      </Container>
    </div>
  );
};

export default Navbar;
