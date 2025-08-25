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
import GroupListSidebar from "../../layouts/GroupListSidebar";
import CustomLoader from "../../layouts/CustomLoader";

const ProfileSidebar = () => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [userProfile, setUserProfile] = useState(null);
  const [followers, setFollowers]= useState([])
  const [loading, setLoading]= useState(true)
  
    const [friendList, setFriendList] = useState([]);
    useEffect(() => {
      const requestRef = ref(db, "friendlist/");
      onValue(requestRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((item) => {
          const request = item.val();
          if (request.senderid === user.uid || request.reciverid === user.uid) {
            const isSender = request.senderid === user.uid;
            const friendId = isSender ? request.reciverid : request.senderid;
            const friendName = isSender ? request.recivername : request.sendername;
            const friendEmail = isSender ? request.reciveremail : request.senderemail;
            const friendImage = isSender ? request.reciverimg : request.senderimg;
  
            arr.push({
              id: friendId,
              name: friendName,
              email: friendEmail,
              image: friendImage,
              listId: item.key,
            });
          }
        });
        setFriendList(arr);
      });
    }, []);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((data) => {
        const userdb = data.val();
        if (user?.uid === data.key) {
          setUserProfile(userdb);
          setLoading(false)
        }
      });
    });
  }, [db, user]);
  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((data) => {
        const follow = data.val();
        if (follow.followingid==user?.uid) {
          arr.push({...follow, id:data.key})
        }
        setFollowers(arr)
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

  if (loading) return <CustomLoader/>



  if (!user) return
  
return (
  <>
    <motion.aside initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="w-full lg:w-[400px] font-secondary bg-white/80 backdrop-blur-xl mb-10 border border-gray-200/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300  fixed mt-[80px] top-0 h-auto overflow-y-auto">
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
        
        <h2 className="mt-2 font-primary text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {userProfile?.username}
        </h2>
        <p className="text-sm text-gray-500 font-medium">{userProfile?.email}</p>
      </div>



      {/* Action Button */}
      <Link to={`/profile/${user?.uid}`}>
        <button className="mt-3 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white w-full py-2 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300/50">
          <span className="flex items-center justify-center gap-2">
            View Profile
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </Link>
    </motion.aside>
    {/* <FollowerSuggestionSidebar/> */}
  </>
);
};

export default ProfileSidebar;
