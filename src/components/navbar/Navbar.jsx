import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import Flex from "../../layouts/Flex";
import { LuPenLine } from "react-icons/lu";
import { RiHome2Line, RiLoginCircleFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import Logo from "../../layouts/Logo";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { BiLogOutCircle } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";
import { IoNotificationsOutline } from "react-icons/io5";
import { getDatabase, onValue, ref } from "firebase/database";
import { AiOutlineMessage } from "react-icons/ai";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const user = useSelector((state) => state.user.user);
  const db = getDatabase();
  const [msgNotification, setMsgNotification] = useState([]);
useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push(request.reciverid + request.senderid);
      });
      setFriendList(arr);
    });
  }, [db]);
  useEffect(() => {
    const notificationRef = ref(db, "messagenotification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.reciverid == user?.uid && (friendList.includes(notification.senderid+user?.uid)|| friendList.includes(user?.uid+notification.senderid))) {
          arr.push({
            id: item.key,
            ...notification,
          });
        }
      });
      setMsgNotification(arr);
    });
  }, [user?.uid, db, friendList]);

  const signOutHandler = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(clearUser());
        navigate("/");
        toast.success("Logout Success");
        localStorage.removeItem("user");
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
        if (
          notification.notifyReciver == user?.uid &&
          notification.reactorId !== user?.uid
        ) {
          arr.push({
            id: item.key,
            ...notification,
          });
        }
      });
      setNotification(arr);
    });
  }, [db, user]);

  return (
    <div className="bg-gradient-to-r from-purple-700 via-blue-600 to-blue-800 fixed w-full z-[999] font-secondary text-white py-4 shadow-md">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <Container>
        <Flex className="justify-center lg:justify-between gap-y-5 lg:gap-y-0">
          <Logo />

          <Flex>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-lg"
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <RiHome2Line /> Home
            </NavLink>

            {user ? (
              <>
                <NavLink
                  to="/notification"
                  className="flex relative items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
                >
                  {notification.length > 0 && (
                    <span className="w-4 h-4 flex justify-center items-center bg-red-600 text-white rounded-full absolute top-0 right-0 text-[11px] z-10">
                      {notification.length}
                    </span>
                  )}
                  <IoNotificationsOutline size={25} />
                </NavLink>

                <NavLink
                  to="/messages"
                  className="flex relative items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium text-white hover:bg-white/10 transition-all duration-200 hover:scale-105"
                >
                  {msgNotification.length > 0 && (
                    <span className="w-4 h-4 flex justify-center items-center bg-red-600 text-white rounded-full absolute top-0 right-0 text-[11px] z-10">
                      {msgNotification.length}
                    </span>
                  )}
                  <AiOutlineMessage size={25} />
                </NavLink>

                <NavLink
                  to={`/profile/${user?.uid}`}
                  className={({ isActive }) =>
                    `flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? "bg-white text-purple-800 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`
                  }
                >
                  <img
                    className="w-8 h-8 rounded-full border"
                    src={user?.photoURL}
                    alt=""
                  />
                </NavLink>

                <div
                  onClick={signOutHandler}
                  className="flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer hover:bg-red-600/20 hover:scale-105 transition-all duration-200"
                >
                  <BiLogOutCircle /> Logout
                </div>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? "bg-white text-blue-800 shadow-lg"
                      : "text-white hover:bg-white/10"
                  }`
                }
              >
                <RiLoginCircleFill /> Login
              </NavLink>
            )}
          </Flex>
        </Flex>
      </Container>
    </div>
  );
};

export default Navbar;
