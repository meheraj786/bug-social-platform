import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Plus,
  UserCheck,
  MapPin,
  Calendar,
  Eye,
  Star,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  MoveDiagonal2,
} from "lucide-react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import CustomToast from "./CustomToast";
import { Link, Navigate } from "react-router";

const PageSidebar = () => {
  const [followedPages, setFollowedPages] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);
  const [listLoad, setListLoad]= useState(3)
  const [listLoadSuggested, setListLoadSuggested]= useState(3)
  
  const [followedPageId, setFollowedPageId]= useState([])



  useEffect(() => {
    const requestRef = ref(db, "page/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const page = item.val();
        if (!followedPageId.includes(item.key)) {
          arr.push({ ...page, id: item.key });
        }
      });
      setPagesList(arr);
    });
  }, [db, followedPageId]);
  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const follow = data.val();
        if (follow.followerid==currentUser?.uid && follow.adminid) {
          arr.push({ ...follow, id: data.key });
        }
      });
      setFollowedPages(arr);
      setFollowedPageId(arr.map((f)=>f.followingid))
    });
  }, [db]);

  
      const followHandler = (following) => {
        set(push(ref(db, "follow/")), {
          followerid: currentUser?.uid,
          followername: currentUser?.displayName,
          followingid: following.id,
          followerimg: currentUser?.photoURL,
          followingname: following.pageName,
          followingimg: following.image,
          adminid: following.adminId,
          time: moment().format(),
        });
        toast.custom((t) => (
          <CustomToast
            t={t}
            img={following.image}
            name={following.pageName}
            content={`You're Following ${following.pageName}`}
          />
        ));
        set(push(ref(db, "notification/")), {
          notifyReciver: following.adminId,
          type: "positive",
          time: moment().format(),
          content: `${currentUser?.displayName} starts following your page ${following.pageName}!`,
        });
      };





  const handleSendMessage = (page) => {
    console.log(`Sending message to ${page.pageName}`);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "bg-gradient-to-r from-blue-500 to-cyan-500",
      "Food & Dining": "bg-gradient-to-r from-orange-500 to-red-500",
      "Health & Fitness": "bg-gradient-to-r from-green-500 to-emerald-500",
      "Design & Art": "bg-gradient-to-r from-purple-500 to-pink-500",
      "Travel & Tourism": "bg-gradient-to-r from-teal-500 to-blue-500",
      Business: "bg-gradient-to-r from-green-600 to-green-800",
      Brand: "bg-gradient-to-r from-blue-600 to-blue-800",
      Education: "bg-gradient-to-r from-blue-500 to-blue-500",
      Entertainment: "bg-gradient-to-r from-pink-500 to-red-500",
      Sports: "bg-gradient-to-r from-green-400 to-lime-500",
      "Fashion & Lifestyle": "bg-gradient-to-r from-pink-400 to-purple-400",
      "Finance & Banking": "bg-gradient-to-r from-yellow-500 to-orange-500",
      "Marketing & Advertising":
      "bg-gradient-to-r from-purple-500 to-indigo-500",
      "News & Media": "bg-gradient-to-r from-gray-500 to-gray-700",
      Automotive: "bg-gradient-to-r from-red-400 to-red-600",
      "Real Estate": "bg-gradient-to-r from-green-600 to-teal-500",
      Music: "bg-gradient-to-r from-indigo-400 to-pink-500",
      Science: "bg-gradient-to-r from-cyan-500 to-blue-500",
      "Non-Profit": "bg-gradient-to-r from-rose-400 to-fuchsia-500",
      Gaming: "bg-gradient-to-r from-purple-600 to-pink-600",
    };

    return colors[category] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };
  if (!currentUser) {
  return <Navigate to="/"/>;
}
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full lg:w-[400px] h-[32%] static my-5 xl:my-0 xl:fixed bottom-0 left-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 p-4 lg:p-2 lg:px-4 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-white backdrop-blur-xl py-2 px-2 lg:px-0 border-b border-gray-200/50 z-10">
        <h2 className="text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text font-bold text-lg">
          Discover Pages
        </h2>
        <span className="text-[12px] text-gray-500">
          {pagesList.length} pages found
        </span>
      </div>

      {/* Followed Pages */}
      {followedPages.length > 0 && (
        <div className="mt-2 hidden xl:block space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Following</h3>
            <span className="bg-green-500 text-white text-[12px] px-2 py-0.5 rounded-full font-medium">
              {followedPages.length}
            </span>
          </div>

          {followedPages.map((page, idx) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative overflow-hidden bg-gradient-to-r from-green-50/80 to-blue-50/80 rounded-2xl border border-green-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
              >
                {/* Content */}
                <div className="p-2 flex items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <img
                      src={page.followingimg}
                      alt={page.followingname}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/page-profile/${page.followingid}`}>
                    <h4 className="text-gray-900 font-semibold text-[12px] hover:text-green-600 truncate cursor-pointer">
                      {page.followingname}
                    </h4>
                    
                    </Link>
                  </div>
                  

                  <div className="flex flex-col gap-1">
                    <button
                      className="text-[12px] bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 py-1 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      Following
                    </button>
                    <Link to={`messages/chat/${page.followingid}`}>
                    <button
                      onClick={() => handleSendMessage(page)}
                      className="text-[12px] bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      )}
      {followedPages.length > 0 && (
        <div className="mt-2 xl:hidden space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Following</h3>
            <span className="bg-green-500 text-white text-[12px] px-2 py-0.5 rounded-full font-medium">
              {followedPages.length}
            </span>
          </div>

          {followedPages.slice(0,listLoad).map((page, idx) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative overflow-hidden bg-gradient-to-r from-green-50/80 to-blue-50/80 rounded-2xl border border-green-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
              >
                {/* Content */}
                <div className="p-2 flex items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <img
                      src={page.followingimg}
                      alt={page.followingname}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/page-profile/${page.followingid}`}>
                    <h4 className="text-gray-900 font-semibold text-[12px] hover:text-green-600 truncate cursor-pointer">
                      {page.followingname}
                    </h4>
                    
                    </Link>
                  </div>
                  

                  <div className="flex flex-col gap-1">
                    <button
                      className="text-[12px] bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-2 py-1 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      Following
                    </button>
                    <Link to={`messages/chat/${page.followingid}`}>
                    <button
                      onClick={() => handleSendMessage(page)}
                      className="text-[12px] bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 hover:text-blue-600 px-2 py-1 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
                  {
        followedPages.length <= listLoad && followedPages.length > 3 ? <button onClick={()=>setListLoad(3)} className="px-3 py-1 rounded-lg bg-gradient-to-l text-sm from-purple-500 to-blue-500 flex items-center justify-center gap-x-2 text-white"> <MoveDiagonal2 />Load Less</button> : followedPages.length > 3 ? <button onClick={()=>setListLoad((prev)=>prev+3)} className="px-3 py-1 rounded-lg bg-gradient-to-l text-sm from-purple-500 to-blue-500 flex items-center justify-center gap-x-2 text-white"> <MoveDiagonal2 />Load More</button> : null
      }
        </div>
      )}
      

      {/* Suggested Pages */}
      <div className="mt-3 space-y-2">
        {followedPages.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Suggested Pages</h3>
          </div>
        )}

        {pagesList
          .filter((page) => !followedPages.includes(page.id)).slice(0,listLoadSuggested)
          .map((page, idx) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden bg-gray-50 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-3 flex items-center gap-2">
                <div className="relative flex-shrink-0">
                  <img
                    src={page.image}
                    alt={page.pageName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  
                    <Link to={`/page-profile/${page.id}`}>
                  <h4 className="text-gray-900 font-semibold text-[12px] hover:text-purple-600 truncate cursor-pointer">
                    {page.pageName}
                  </h4>
                  </Link>
                  <div
                    className={`inline-block bg-gradient-to-r ${getCategoryColor(
                      page.category
                    )} text-white text-[12px] px-2 py-0.5 rounded-full font-medium mt-1`}
                  >
                    {page.category}
                  </div>
                </div>

                {
                  page.adminId==currentUser?.uid ? null :  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => followHandler(page)}
                      className="text-[12px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-1 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Follow
                    </button>
                  
                </div>
                }
              </div>
            </motion.div>
          ))}
                            {
        pagesList
          .filter((page) => !followedPages.includes(page.id)).length <= listLoad && pagesList
          .filter((page) => !followedPages.includes(page.id)).length > 3 ? <button onClick={()=>setListLoad(3)} className="px-3 py-1 rounded-lg bg-gradient-to-l text-sm from-purple-500 to-blue-500 flex items-center justify-center gap-x-2 text-white"> <MoveDiagonal2 />Load Less</button> : pagesList
          .filter((page) => !followedPages.includes(page.id)).length > 3 ? <button onClick={()=>setListLoad((prev)=>prev+3)} className="px-3 py-1 rounded-lg bg-gradient-to-l text-sm from-purple-500 to-blue-500 flex items-center justify-center gap-x-2 text-white"> <MoveDiagonal2 />Load More</button> : null
      }
      </div>

      {/* Empty State */}
      {pagesList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium mb-2">No pages found</p>
          <p className="text-gray-400 text-[12px]">
            Check back later for new page suggestions!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PageSidebar;
