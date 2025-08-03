import React, { useEffect, useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { setUser } from "../../features/user/userSlice";
import FollowerSuggestionSidebar from "../follower/FollowerSuggestionSidebar";

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
  return (
    <>
    <aside className="w-full lg:w-[400px]  bg-white border-r border-gray-200 p-6 shadow-md font-sans fixed mt-[80px] top-0 h-1/2 overflow-y-auto">
      <div className="flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-md">
          <img
            src={userProfile?.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-gray-800">
          {userProfile?.username}
        </h2>
        <p className="text-sm text-gray-500">{userProfile?.email}</p>
      </div>

      <div className="mt-8 space-y-4 text-left">
        <div className="flex items-center gap-3 text-gray-700">
          <FaUser className="text-purple-500" />
          <span className="text-sm">{userProfile?.username}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <FaPhone className="text-blue-500" />
          <span className="text-sm">{userProfile?.phone || "Not Provided"}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <FaMapMarkerAlt className="text-purple-500" />
          <span className="text-sm">{userProfile?.location || "Unknown"}</span>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-1">Bio</p>
          <p>{userProfile?.bio || "No bio added."}</p>
        </div>
      </div>
    </aside>
    <FollowerSuggestionSidebar/>
    </>
  );
};

export default ProfileSidebar;
