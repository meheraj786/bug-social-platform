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
import { BiLogOutCircle, BiUser } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";
import { IoChevronDownOutline, IoNotificationsOutline } from "react-icons/io5";
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
        navigate("/");
        dispatch(clearUser());
        localStorage.removeItem("user");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
    <div className="bg-gradient-to-r from-purple-700 via-blue-600 to-blue-800 fixed w-full z-[999] font-secondary text-white py-3 shadow-md">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <div className="md:max-w-[1450px] px-10 mx-auto">
        <Flex className="justify-center lg:justify-between gap-y-5 lg:gap-y-0">
          <Logo />
                        {/* <input
                type="text"
                placeholder="Search GitHub"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-64 bg-gradient-to-r from-purple-500 to-blue-500 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              /> */}

          <Flex>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex relative items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium  hover:bg-white/10 transition-all duration-200 hover:scale-105 ${
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
              className={({ isActive }) =>
                `flex relative items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium  hover:bg-white/10 transition-all duration-200 hover:scale-105 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-lg"
                    : "text-white hover:bg-white/10"
                }`
              }
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
              className={({ isActive }) =>
                `flex relative items-center gap-x-2 px-4 py-2 rounded-full text-sm font-medium mr-10  hover:bg-white/10 transition-all duration-200 hover:scale-105 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-lg"
                    : "text-white hover:bg-white/10"
                }`
              }
                >
                  {msgNotification.length > 0 && (
                    <span className="w-4 h-4 flex justify-center items-center bg-red-600 text-white rounded-full absolute top-0 right-0 text-[11px] z-10">
                      {msgNotification.length}
                    </span>
                  )}
                  <AiOutlineMessage size={25} />
                </NavLink>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-x-2 p-1 rounded-full text-sm font-medium text-white hover:border hover:border-white  border border-white/0 transition-all duration-200 focus:outline-none"
              >
                <img
                  className="w-7 h-7 rounded-full"
                  src={user?.photoURL}
                  alt="User Avatar"
                />
                <IoChevronDownOutline 
                  size={12}
                  className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-xl border border-purple-700 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-black font-medium">{user?.displayName || 'User'}</p>
                      <p className="text-xs text-gray-700">{user?.email || 'user@example.com'}</p>
                    </div>
                    <NavLink
                      to={`/profile/${user?.uid}`}
                      className="flex items-center gap-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <BiUser className="text-base" />
                      <span>Your profile</span>
                    </NavLink>
                    <div className="border-t border-gray-700">
                      <button
                        onClick={signOutHandler}
                        className="w-full flex items-center gap-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                      >
                        <BiLogOutCircle className="text-base" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
      </div>
    </div>
  );
};

export default Navbar;
