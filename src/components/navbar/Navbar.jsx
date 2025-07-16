import React from "react";
import Container from "../../layouts/Container";
import Flex from "../../layouts/Flex";
import { LuPenLine } from "react-icons/lu";
import { RiHome2Line } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { FaRegQuestionCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="bg-black fixed w-full z-[999] font-primary text-white py-4">
      <Container>
        <Flex>
          <div className="logo flex items-center gap-x-2 text-[20px] font-semibold">
            <LuPenLine size={30} />
            Anonymous Blog
          </div>
          <ul>
            <Flex>
              <li className="flex items-center gap-x-1 mx-5">
                <RiHome2Line /> Home
              </li>
              <li className="flex items-center gap-x-1 mx-5">
                <CgNotes />
                Blogs
              </li>
              <li className="flex items-center gap-x-1 mx-5"><FaRegQuestionCircle />
About</li>
            </Flex>
          </ul>
        </Flex>
      </Container>
    </div>
  );
};

export default Navbar;
