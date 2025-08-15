import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BiGlobe, BiImage, BiX, BiHeart, BiComment, BiShare, BiStar } from 'react-icons/bi';
import { Link, useNavigate, useParams } from 'react-router';
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
import FollowersModal from '../layouts/FollowersModal.jsx'

const PageProfile = () => {
  const [pageData, setPageData] = useState(null);
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
  const [ownFollowers, setOwnFollowers] = useState([]);
  const navigate=useNavigate()
  const [ownFollowing, setOwnFollowing] = useState([]);
  const [followersPop, setFollowersPop]= useState(false)
  

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

      // const followHandler = (following) => {
      //   set(push(ref(db, "follow/")), {
      //     followerid: user?.uid,
      //     followername: user?.displayName,
      //     followingid: following.id,
      //     followerimg: user?.photoURL,
      //     followingname: following.pageName,
      //     followingimg: following.image,
      //     adminid: following.adminId,
      //     time: moment().format(),
      //   });
      //   toast.custom((t) => (
      //     <CustomToast
      //       t={t}
      //       img={following.image}
      //       name={following.pageName}
      //       content={`You're Following ${following.pageName}`}
      //     />
      //   ));
      //   set(push(ref(db, "notification/")), {
      //     notifyReciver: following.adminId,
      //     type: "positive",
      //     time: moment().format(),
      //     content: `${user?.displayName} starts following your page ${following.pageName}!`,
      //   });
      // };
      // const unFollowHandler = (followId) => {
      //   followers.forEach((follow) => {
      //     if (follow.followerid == user?.uid && follow.followingid == followId.id) {
      //       remove(ref(db, "follow/" + follow.id));
      //       toast.success(`Your'e Unfollowing ${follow.name}`);
      //       toast.custom((t) => (
      //         <CustomToast
      //           t={t}
      //           img={followId.image}
      //           name={followId.pageName}
      //           content={`You unfollow${followId.pageName}`}
      //         />
      //       ));
      //     }
      //     set(push(ref(db, "notification/")), {
      //       notifyReciver: followId.adminId,
      //       type: "negative",
      //       time: moment().format(),
      //       content: `${user?.displayName} unfollow you!`,
      //     });
      //   });
      // };

  // if (!pageData) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-gray-500">
  //       Loading page...
  //     </div>
  //   );
  // }
return (
  <div className="bg-gradient-to-br font-secondary from-gray-50 via-blue-50/30 to-purple-50/30 min-h-screen">
    {/* Followers Modal Dummy */}
    {/* <FollowersModal /> */}

    {/* Cover Section with Glass Effect */}
    <div className="relative w-full h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full blur-lg animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full blur-md animate-ping"></div>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4">
      {/* Profile Info Card */}
      <div className="relative -mt-8 mb-8">
        <div className="w-40 absolute -top-20 left-5 z-50 h-40 rounded-3xl border-6 border-white shadow-2xl">
          <img
            src="https://via.placeholder.com/150"
            alt="profile"
            className="w-full rounded-2xl h-full object-cover"
          />
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex justify-between items-start flex-wrap gap-6 ml-48">
            <div className="flex-1">
              <h1 className="text-4xl font-bold font-primary bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Dummy Page Name
              </h1>
              <p className="text-lg text-gray-500 font-medium mb-4">@dummypage</p>

              {/* Stats */}
              <div className="flex gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">12</div>
                  <div className="text-sm text-gray-500 font-medium">Posts</div>
                </div>

                <div className="text-center cursor-pointer">
                  <div className="text-2xl font-bold text-gray-800">34</div>
                  <div className="text-sm font-medium text-gray-500">Followers</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl text-gray-700 font-semibold shadow-lg flex items-center gap-2">
                Follow
              </button>
              <button className="bg-white border-2 border-gray-200 px-6 py-3 rounded-2xl text-gray-700 font-semibold shadow-lg flex items-center gap-2">
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 pb-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* About Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <h3 className="text-xl font-primary font-bold text-gray-800 mb-4 flex items-center gap-2">
              About
            </h3>
            <p className="text-gray-700 font-medium">This is a dummy about section.</p>
          </div>

          {/* Followers Preview */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-primary font-bold text-gray-800">Friends</h3>
              <span className="text-sm text-gray-500 cursor-pointer">34 Followers</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <img
                    src="https://via.placeholder.com/80"
                    alt="friend"
                    className="w-full aspect-square rounded-2xl object-cover shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Create Post Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6">
            <div className="flex items-start gap-4">
              <img
                src="https://via.placeholder.com/50"
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
              />
              <textarea
                rows={3}
                placeholder="What's on your mind?"
                className="w-full p-4 rounded-2xl border-2 border-gray-200 bg-gray-50/50"
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button className="bg-gray-200 px-6 py-3 rounded-2xl font-semibold">Clear</button>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold">
                Post
              </button>
            </div>
          </div>

          {/* Post List */}
          {[1, 2].map((post) => (
            <div key={post} className="bg-white/80 p-6 rounded-3xl shadow-xl">
              <h4 className="font-bold text-lg mb-2">Dummy Post Title {post}</h4>
              <p className="text-gray-600">
                This is a dummy post description. Replace it with your actual data.
              </p>
            </div>
          ))}

          {/* Empty State Example */}
          {/* <div className="bg-white/80 p-12 text-center rounded-3xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600">This user hasn't posted anything yet.</p>
          </div> */}
        </div>
      </div>
    </div>
  </div>
);

};

export default PageProfile;
