import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BiGlobe, BiImage, BiX, BiHeart, BiComment, BiShare, BiStar } from 'react-icons/bi';
import { useNavigate, useParams } from 'react-router';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { Camera, ThumbsUp, UserPlus, MessageCircle, Share2, UserRoundPlus, UserRoundX, MessageCircleCode } from "lucide-react";
import { FaImage, FaCalendar, FaBriefcase, FaShoppingCart, FaNewspaper } from 'react-icons/fa';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import Container from '../layouts/Container';
import BlogCard from '../components/blogCard/BlogCard';
import CustomToast from "../layouts/CustomToast";
import moment from 'moment';
import toast from 'react-hot-toast';

const PageProfile = () => {
  const [pageData, setPageData] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [description,setDescription]= useState("")
  const [preview, setPreview] = useState('');
  const user = useSelector((state) => state.user.user);
  const [blogList, setBlogList]= useState([])
  const db = getDatabase();
  const { id } = useParams();
  const [contentType, setContentType] = useState('general');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [followingId, setFollowingId] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [ownFollwers, setOwnFollowers] = useState([]);
  const navigate=useNavigate()
  const [ownFollowing, setOwnFollowing] = useState([]);

  // Content type options
  const contentTypes = [
    { value: 'general', label: 'General Post', icon: FaNewspaper },
    { value: 'event', label: 'Event', icon: FaCalendar },
    { value: 'job', label: 'Job Post', icon: FaBriefcase },
    { value: 'product', label: 'Product', icon: FaShoppingCart }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const sendMessageHandler=()=>{
    console.log("Message Send");
    navigate(`/messages/chat/${pageData?.id}`)
  }
  

  const handleSubmit = () => {
    const postData = {
      adminId: pageData?.adminId,
      bloggerId: pageData?.id,
      contentType: contentType,
      description: description,
      eventDate: contentType === 'event' ? eventDate : "",
      eventTime: contentType === 'event' ? eventTime : "",
      imageUrl: pageData?.image || "",
      jobSalary: contentType === 'job' ? jobSalary : "",
      name: pageData?.pageName,
      postImage: preview || "",
      postType: "pagePost",
      productPrice: contentType === 'product' ? productPrice : "",
      time: moment().format(),
    };

    set(push(ref(db, "blogs/")), postData).then(()=>{
      resetForm()
      toast.success("Post Successfully Published")
    })
    
  };

  const resetForm = () => {
    setDescription('');
    setPreview('');
    setContentType('general');
    setEventDate('');
    setEventTime('');
    setJobSalary('');
    setProductPrice('');
  };
  

  useEffect(() => {
    const requestRef = ref(db, 'page/' + id);
    onValue(requestRef, (snapshot) => {
      if (snapshot.exists()) {
        setPageData({ id: snapshot.key, ...snapshot.val(), posts: snapshot.val().posts || [] });
      }
    });
  }, [db, id]);
    useEffect(() => {
      const blogsRef = ref(db, "blogs/");
      onValue(blogsRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((blog) => {
          const content = blog.val();
          const blogId = blog.key;
          if (content.bloggerId == id) {
            arr.unshift({ ...content, id: blogId });
          }
        });
        setBlogList(arr);
      });
    }, [db, id]);


  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const follow = data.val();
        if (
          follow.followerid == user?.uid &&
          follow.followingid == pageData?.id
        ) {
          arr.push({ ...follow, id: data.key });
        }
      });
      setFollowers(arr);
    });
  }, [db, user, pageData]);
  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const follow = data.val();
        if (
          follow.followerid == user?.uid &&
          follow.followingid == pageData?.id
        ) {
          arr.push(follow.followingid);
        }
      });
      setFollowingId(arr);
    });
  }, [db, user, pageData]);
  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const follow = data.val();
        arr.push({ ...follow, id: data.key });
      });
      setOwnFollowers(
        arr.filter((follower) => follower.followingid == pageData?.id)
      );
      setOwnFollowing(
        arr.filter((follower) => follower.followerid == pageData?.id)
      );
    });
  }, [db, user, id, pageData]);

      const followHandler = (following) => {
        set(push(ref(db, "follow/")), {
          followerid: user?.uid,
          followername: user?.displayName,
          followingid: following.id,
          followerimg: user?.photoURL,
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
          content: `${user?.displayName} starts following your page ${following.pageName}!`,
        });
      };
      const unFollowHandler = (followId) => {
        followers.forEach((follow) => {
          if (follow.followerid == user?.uid && follow.followingid == followId.id) {
            remove(ref(db, "follow/" + follow.id));
            toast.success(`Your'e Unfollowing ${follow.name}`);
            toast.custom((t) => (
              <CustomToast
                t={t}
                img={followId.image}
                name={followId.pageName}
                content={`You unfollow${followId.pageName}`}
              />
            ));
          }
          set(push(ref(db, "notification/")), {
            notifyReciver: followId.adminId,
            type: "negative",
            time: moment().format(),
            content: `${user?.displayName} unfollow you!`,
          });
        });
      };

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading page...
      </div>
    );
  }
  return (
      <div className="bg-gradient-to-br font-secondary from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen ">
        {/* {unFriendPop && (
          <UnfriendPopup
            name={selectFriend.name}
            image={selectFriend.image}
            unfriendPopup={setUnfriendPop}
            unfriendHandler={unFriendHandler}
          />
        )}
        {friendsPop && (
          <FriendsModal
            setSelectFriend={setSelectFriend}
            setUnfriendPop={setUnfriendPop}
            friends={friends}
            setFriendsPop={setFriendsPop}
          />
        )}
        {followersPop && (
          <FollowersModal
            followingId={followingId}
            followers={ownFollwers}
            setFollowersPop={setFollowersPop}
          />
        )}
        {followingPop && (
          <FollowingModal
            following={ownFollowing}
            setFollowingPop={setFollowingPop}
          />
        )} */}
        {/* Cover Section with Glass Effect */}
        <div className="relative w-full h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full blur-lg animate-bounce"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full blur-md animate-ping"></div>
          </div>
        </div>
  
        <Container>
          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative -mt-8 mb-8"
          >
            <div className="w-40 absolute -top-20 left-5 z-50 h-40 rounded-3xl border-6 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <img
                src={pageData?.image}
                alt="profile"
                className="w-full rounded-2xl h-full object-cover"
              />
            </div>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex justify-between items-start flex-wrap gap-6 ml-48">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold font-primary bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                    {pageData?.pageName}
                  </h1>
                  <p className="text-lg text-gray-500 font-medium mb-4">
                    @{pageData?.pageName}
                  </p>
  
                  {/* Stats */}
                  <div className="flex gap-8 mb-4">
                    {/* Posts */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {blogList.length} 
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Posts
                      </div>
                    </div>
  
                    {/* Followers */}
                    <div
                      // onClick={() => setFollowersPop(true)} 0
                      className="text-center group cursor-pointer transition-colors duration-300"
                    >
                      <div
                        className="text-2xl font-bold text-gray-800 transition-all duration-300 
          group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 
          group-hover:bg-clip-text group-hover:text-transparent"
                      >
                        {ownFollwers.length} 
                      </div>
                      <div
                        className="text-sm font-medium text-gray-500 transition-all duration-300 
          group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 
          group-hover:bg-clip-text group-hover:text-transparent"
                      >
                        Followers
                      </div>
                    </div>
  

                  </div>
                </div>
  
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* {requestList.includes(currentUser.uid + id) ||
                  requestList.includes(id + currentUser.uid) ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={cancelRequest}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg flex items-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Request Pending
                      </button>
                    </div>
                  ) : friendList.includes(currentUser.uid + id) ||
                    friendList.includes(id + currentUser.uid) ? (
                    <div className="flex gap-3">
                      <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Friends
                      </button>
  
                      <Link to={`/messages/chat/${id}`}>
                        <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 font-semibold shadow-lg transition-all duration-300 flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Message
                        </button>
                      </Link>
                    </div>
                  ) : currentUser.uid !== id ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRequest(user)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <Plus />
                        Add Friend
                      </button>
                    </div>
                  ) : (
                    // <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                    //   <svg
                    //     className="w-5 h-5"
                    //     fill="none"
                    //     stroke="currentColor"
                    //     viewBox="0 0 24 24"
                    //   >
                    //     <path
                    //       strokeLinecap="round"
                    //       strokeLinejoin="round"
                    //       strokeWidth={2}
                    //       d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    //     />
                    //   </svg>
                    //   Edit Profile
                    // </button>
                    null
                  )} */}
                </div>
                {pageData.adminId !== user?.uid && !followingId.includes(pageData?.id) ? (
                  <button
                    onClick={() => followHandler(pageData)}
                    className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <UserRoundPlus />
                    Follow
                  </button>
                ) : id !== user?.uid && followingId.includes(pageData?.id) ? (
                  <>
                  <button
                    onClick={() => unFollowHandler(pageData)}
                    className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <UserRoundX />
                    Unfollow
                  </button>
                  <button
                    onClick={() => sendMessageHandler()}
                    className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <MessageCircleCode />
                    Message
                  </button>
                  
                  </>
                ) : null}
                {/* {
                  pageData.adminId !== user?.uid && <button
                    onClick={() => sendMessageHandler()}
                    className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 px-6 py-3 rounded-2xl text-gray-700 hover:text-blue-600 font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <MessageCircleCode />
                    Message
                  </button>
                } */}
                                  
              </div>
            </div>
          </motion.div>
  
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 pb-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full lg:w-1/3 space-y-6"
            >
              {/* About Card */}
              <div className="bg-white/80  backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-primary font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  About
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {pageData?.about || "No bio available"}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-medium">{pageData?.adminName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">
                        {/* {userProfile?.location || "Location not specified"} */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Friends Preview Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-primary font-bold text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Friends
                  </h3>
                  <span
                    // onClick={() => setFriendsPop(true)}
                    className="text-sm text-gray-500 hover:text-blue-500 cursor-pointer font-medium"
                  >
                    {/* {friends.length} friends */} 0
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {/* {friends.map((i) => (
                    <Link to={`/profile/${i.id}`}>
                      <div key={i} className="group cursor-pointer">
                        <img
                          src={i.image}
                          alt="friend"
                          className="w-full aspect-square rounded-2xl object-cover group-hover:scale-105 transition-transform duration-300 shadow-md"
                        />
                      </div>
                    </Link>
                  ))} */}
                </div>
                {/* <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-semibold text-sm py-2 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                See all friends
              </button> */}
              </div>
            </motion.div>
  
            {/* Posts Section */}
            <div className="w-full lg:w-2/3 space-y-6">
              {/* Create Post Card - Only for own profile */}
      {pageData?.adminId === user?.uid && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 max-w-2xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <img
              src={pageData.image}
              alt="Your avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="flex-1">
              {/* Content Type Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setContentType(type.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          contentType === type.value
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <IconComponent className="text-xs" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Description Textarea */}
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none resize-none font-medium placeholder-gray-500 bg-gray-50/50"
              />

              {/* Conditional Extra Fields */}
              {contentType === 'event' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Event Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm bg-gray-50/50"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Event Time
                      </label>
                      <input
                        type="time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm bg-gray-50/50"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {contentType === 'job' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(e.target.value)}
                    placeholder="e.g., $50,000 - $70,000"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm bg-gray-50/50"
                  />
                </motion.div>
              )}

              {contentType === 'product' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Product Price
                  </label>
                  <input
                    type="text"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="e.g., $299"
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none text-sm bg-gray-50/50"
                  />
                </motion.div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-6">
                  {/* Media Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-purple-600 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-blue-50 group/media">
                        <FaImage className="text-lg group-hover/media:scale-110 transition-transform duration-200" />
                        <span className="text-sm font-semibold">
                          Add Photo
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={!user}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={resetForm}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!description.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Post
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              {preview && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 relative group/preview"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-2xl w-full max-h-64 object-cover shadow-lg"
                  />
                  <button
                    onClick={() => setPreview("")}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                    Click × to remove
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
  
              {/* Posts */}
              <div className="space-y-6">
                {blogList.map((blog) => (
                  <BlogCard blog={blog} />
                ))}
              </div>
  
              {/* Empty State */}
              {blogList?.length === 0 && (
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No posts yet
                  </h3>
                  <p className="text-gray-600">
                    {user?.uid === pageData.adminId
                      ? "Share your first post!"
                      : "This user hasn't posted anything yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
};

export default PageProfile;
