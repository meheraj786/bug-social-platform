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
import { IoMdNotifications } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { getDatabase, onValue, ref } from "firebase/database";
import { AiOutlineMessage } from "react-icons/ai";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notification, setNotification]= useState([])
  const user = useSelector((state) => state.user.user);
  const db= getDatabase()

  const signOutHandler = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        {
          dispatch(clearUser());
          navigate("/");
          toast.success("Logout Success");
          localStorage.removeItem("user");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    const notificationRef = ref(db, "notification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.notifyReciver == user?.uid) {
          arr.push({
            id: item.key,
            ...notification,
          });
        }
      });
      setNotification(arr);
    });
  }, []);

  return (
    <div className="bg-black fixed w-full  z-[999] font-primary text-white py-4">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <Container>
        <Flex className="justify-center lg:justify-between gap-y-5 lg:gap-y-0">
          <Logo />

          <Flex>
            <NavLink to="/" className="flex items-center gap-x-1 mx-5">
              <RiHome2Line /> Home
            </NavLink>
            <NavLink to="/blogs" className="flex items-center gap-x-1 mx-5">
              <CgNotes />
              My Blogs
            </NavLink>
            {user ? (
              <>
                
                <NavLink
                  to="/notification"
                  className="flex relative items-center gap-x-1 mx-5"
                >
                  {notification.length > 0 && (
                    <span className="w-5 h-5 flex justify-center items-center bg-red-600 text-white rounded-full absolute -top-2 -right-4 text-[12px] z-10">
                      {notification.length}
                    </span>
                  )}
                  <IoNotificationsOutline />
                  Notification
                </NavLink>
                <NavLink
                  to="/messages"
                  className="flex relative items-center gap-x-1 mx-5"
                >
                  <AiOutlineMessage />
                  Messages
                </NavLink>
                <NavLink
                  to={`/profile/${user.uid}`}
                  className="flex items-center gap-x-1 mx-5"
                >
                  <FaRegUserCircle />
                  Profile
                </NavLink>
                <div
                  onClick={signOutHandler}
                  className="flex cursor-pointer items-center gap-x-1 mx-5"
                >
                  <BiLogOutCircle />
                  Logout
                </div>
              </>
            ) : (
              <NavLink to="/auth" className="flex items-center gap-x-1 mx-5">
                <RiLoginCircleFill />
                Signup
              </NavLink>
            )}
          </Flex>
        </Flex>
      </Container>
    </div>
  );
};

export default Navbar;
