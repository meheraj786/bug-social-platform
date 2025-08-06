import React, { useEffect, useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { setUser } from "../../features/user/userSlice";
import FollowerSuggestionSidebar from "../friends/Friends";
import Flex from "../../layouts/Flex";
import { motion } from "motion/react";

const ProfileSidebar = () => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((data) => {
        const userdb = data.val();
        console.log("dbdata", data.val());
        console.log("key", data.key);
        if (user?.uid === data.key) {
          setUserProfile(userdb);
        }
      });
    });
  }, [db, user]);

  const signOutHandler = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(setUser(null));
        navigate("/");
        toast.success("Logout Success");
        localStorage.removeItem("user");
      })
      .catch((error) => console.log(error.message));
  };
  if (!user) return
  
return (
  <>
    <motion.aside initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="w-full lg:w-[400px] font-secondary bg-white/80 backdrop-blur-xl mb-10 border border-gray-200/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300  fixed mt-[80px] top-0 h-[55%] overflow-y-auto">
      {/* Profile Section */}
      <div className="flex flex-col items-center text-center">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-500 to-pink-500 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <img
              src={userProfile?.imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h2 className="mt-4 font-primary text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {userProfile?.username}
        </h2>
        <p className="text-sm text-gray-500 font-medium">{userProfile?.email}</p>
      </div>

      {/* Stats Section */}
      <div className="flex gap-3 mt-6">
        <div className="flex-1 text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl border border-purple-200/50 transition-all duration-300 hover:scale-105 cursor-pointer">
          <div className="text-2xl font-bold text-purple-700">10</div>
          <div className="text-sm font-medium text-purple-600 capitalize">Friends</div>
        </div>
        <div className="flex-1 text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl border border-blue-200/50 transition-all duration-300 hover:scale-105 cursor-pointer">
          <div className="text-2xl font-bold text-blue-700">20</div>
          <div className="text-sm font-medium text-blue-600 capitalize">Followers</div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50 min-h-[100px] flex items-center justify-center">
        <p className="text-gray-700 text-sm leading-relaxed text-center font-medium">
          {userProfile?.bio || "No bio available"}
        </p>
      </div>

      {/* Action Button */}
      <Link to={`/profile/${user?.uid}`}>
        <button className="mt-6 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300/50">
          <span className="flex items-center justify-center gap-2">
            View Profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </Link>
    </motion.aside>
    <FollowerSuggestionSidebar/>
  </>
);
};

export default ProfileSidebar;
