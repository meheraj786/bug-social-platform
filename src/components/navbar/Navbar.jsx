import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import Flex from "../../layouts/Flex";
import { LuPenLine } from "react-icons/lu";
import { RiHome2Line, RiLoginCircleFill } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { FaPage4, FaPagelines, FaRegUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import Logo from "../../layouts/Logo";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { BiCog, BiHelpCircle, BiLogOutCircle, BiPlus, BiUser } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, signOut } from "firebase/auth";
import { IoChevronDownOutline, IoNotificationsOutline } from "react-icons/io5";
import { getDatabase, onValue, ref } from "firebase/database";
import { AiOutlineMessage } from "react-icons/ai";
import { PanelsTopLeft } from "lucide-react";

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

        if (
          notification.reciverid == user?.uid &&
          (friendList.includes(notification.senderid + user?.uid) ||
            friendList.includes(user?.uid + notification.senderid))
        ) {
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
  const [searchQuery, setSearchQuery] = useState("");

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
                      className={`transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white text-black rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      {/* User Profile Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {/* {(user?.displayName || "U").charAt(0).toUpperCase()} */}
                            <img src={user?.photoURL} className="w-11 h-11 rounded-full" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.displayName || "User Name"}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {user?.email || "user@example.com"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Your Profile */}
                        <NavLink
                          to={`/profile/${user?.uid}`}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-all duration-200 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
                            <BiUser className="text-base text-gray-600 group-hover:text-purple-600" />
                          </div>
                          <span className="font-medium">Your Profile</span>
                        </NavLink>

                        {/* Create Page */}
                        <NavLink
                          to="/create-pages"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
                            <PanelsTopLeft className="text-sm text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <span className="font-medium">Manage Your Pages</span>
                        </NavLink>

                        {/* Settings */}
                        <NavLink
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-all duration-200 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
                            <BiCog className="text-base text-gray-600 group-hover:text-green-600" />
                          </div>
                          <span className="font-medium">Settings</span>
                        </NavLink>

                        {/* Help & Support */}
                        <NavLink
                          to="/help"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200 group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-200">
                            <BiHelpCircle className="text-base text-gray-600 group-hover:text-indigo-600" />
                          </div>
                          <span className="font-medium">Help & Support</span>
                        </NavLink>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Sign Out */}
                        <button
                          onClick={signOutHandler}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors duration-200">
                            <BiLogOutCircle className="text-base text-gray-600 group-hover:text-red-600" />
                          </div>
                          <span className="font-medium">Sign Out</span>
                        </button>
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
