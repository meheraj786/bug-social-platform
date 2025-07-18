import React from "react";
import Container from "../../layouts/Container";
import Flex from "../../layouts/Flex";
import { LuPenLine } from "react-icons/lu";
import { RiHome2Line } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { FaRegQuestionCircle, FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <div className="bg-black fixed w-full  z-[999] font-primary text-white py-4">
      <Container>
        <Flex className="justify-center lg:justify-between gap-y-5 lg:gap-y-0">
          <div className="logo flex  items-center gap-x-2 text-[20px] font-semibold">
            <LuPenLine size={30} />
            Anonymous Blog
          </div>

          <Flex>
            <Link to="/" className="flex items-center gap-x-1 mx-5">
              <RiHome2Line /> Home
            </Link>
            <Link to="/blogs" className="flex items-center gap-x-1 mx-5">
              <CgNotes />
              Blogs
            </Link>
            <Link to="/profile" className="flex items-center gap-x-1 mx-5">
              <FaRegUserCircle />
              Profile
            </Link>
          </Flex>
        </Flex>
      </Container>
    </div>
  );
};

export default Navbar;
