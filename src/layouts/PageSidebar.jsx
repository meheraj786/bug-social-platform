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
} from "lucide-react";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import CustomToast from "./CustomToast";
import { Link } from "react-router";

const PageSidebar = () => {
  const [followedPages, setFollowedPages] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const db = getDatabase();
  const currentUser = useSelector((state) => state.user.user);
  
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

  console.log(followedPages, " followedPages");
  
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

  // // Mock data for pages
  // const pagesList = [
  //   {
  //     id: 'page1',
  //     pageName: 'Tech Innovators',
  //     category: 'Technology',
  //     image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
  //     coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=150&fit=crop',
  //     followers: 45600,
  //     description: 'Latest tech news, innovations and startup stories.',
  //     location: 'Silicon Valley, CA',
  //     verified: true,
  //     isFollowing: false,
  //     posts: 234,
  //     engagement: '12.5K'
  //   },
  //   {
  //     id: 'page2',
  //     pageName: 'Urban Food Hub',
  //     category: 'Food & Dining',
  //     image: 'https://images.unsplash.com/photo-1514533212735-5df27d970db9?w=100&h=100&fit=crop',
  //     coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=150&fit=crop',
  //     followers: 23400,
  //     description: 'Delicious recipes, restaurant reviews and food culture.',
  //     location: 'New York, NY',
  //     verified: true,
  //     isFollowing: true,
  //     posts: 189,
  //     engagement: '8.2K'
  //   },
  //   {
  //     id: 'page3',
  //     pageName: 'Fitness Revolution',
  //     category: 'Health & Fitness',
  //     image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
  //     coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=150&fit=crop',
  //     followers: 67800,
  //     description: 'Transform your body and mind with our fitness programs.',
  //     location: 'Los Angeles, CA',
  //     verified: false,
  //     isFollowing: false,
  //     posts: 456,
  //     engagement: '18.9K'
  //   },
  //   {
  //     id: 'page4',
  //     pageName: 'Creative Studios',
  //     category: 'Design & Art',
  //     image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop',
  //     coverImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=150&fit=crop',
  //     followers: 34500,
  //     description: 'Inspiring designs, creative tutorials and art showcases.',
  //     location: 'London, UK',
  //     verified: true,
  //     isFollowing: true,
  //     posts: 312,
  //     engagement: '15.3K'
  //   },
  //   {
  //     id: 'page5',
  //     pageName: 'Travel Adventures',
  //     category: 'Travel & Tourism',
  //     image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop',
  //     coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=150&fit=crop',
  //     followers: 89200,
  //     description: 'Explore the world through our travel guides and stories.',
  //     location: 'Global',
  //     verified: true,
  //     isFollowing: false,
  //     posts: 567,
  //     engagement: '25.4K'
  //   },
  //   {
  //     id: 'page6',
  //     pageName: 'Business Growth',
  //     category: 'Business',
  //     image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  //     coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=150&fit=crop',
  //     followers: 56700,
  //     description: 'Strategies, tips and insights for business success.',
  //     location: 'Chicago, IL',
  //     verified: false,
  //     isFollowing: false,
  //     posts: 389,
  //     engagement: '11.8K'
  //   }
  // ];



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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full lg:w-[400px] h-[45%] fixed bottom-0 right-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 p-4 lg:p-6 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl py-4 px-2 lg:px-0 border-b border-gray-200/50 z-10">
        <h2 className="text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text font-bold text-xl">
          Discover Pages
        </h2>
        <span className="text-sm text-gray-500">
          {pagesList.length} pages found
        </span>
      </div>

      {/* Followed Pages */}
      {followedPages.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Following</h3>
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
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
                <div className="p-4 flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={page.followingimg}
                      alt={page.followingname}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/page-profile/${page.followingid}`}>
                    <h4 className="text-gray-900 font-semibold text-sm hover:text-green-600 truncate cursor-pointer">
                      {page.followingname}
                    </h4>
                    
                    </Link>
                  </div>
                  

                  <div className="flex flex-col gap-2">
                    <button
                      className="text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-1.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      Following
                    </button>
                    <Link to={`messages/chat/${page.followingid}`}>
                    <button
                      onClick={() => handleSendMessage(page)}
                      className="text-xs bg-white hover:bg-gray-50 border border-gray-300 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
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

      {/* Suggested Pages */}
      <div className="mt-6 space-y-4">
        {followedPages.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-800">Suggested Pages</h3>
          </div>
        )}

        {pagesList
          .filter((page) => !followedPages.includes(page.id))
          .map((page, idx) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden bg-gray-50 rounded-2xl border border-gray-200/50 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={page.image}
                    alt={page.pageName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  
                    <Link to={`/page-profile/${page.id}`}>
                  <h4 className="text-gray-900 font-semibold text-sm hover:text-purple-600 truncate cursor-pointer">
                    {page.pageName}
                  </h4>
                  </Link>
                  <div
                    className={`inline-block bg-gradient-to-r ${getCategoryColor(
                      page.category
                    )} text-white text-xs px-2 py-0.5 rounded-full font-medium mt-1`}
                  >
                    {page.category}
                  </div>
                </div>

                {
                  page.adminId==currentUser?.uid ? null :  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => followHandler(page)}
                      className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-1.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 font-medium flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Follow
                    </button>
                  
                </div>
                }

                
              </div>
            </motion.div>
          ))}
      </div>

      {/* Empty State */}
      {pagesList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium mb-2">No pages found</p>
          <p className="text-gray-400 text-sm">
            Check back later for new page suggestions!
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PageSidebar;
