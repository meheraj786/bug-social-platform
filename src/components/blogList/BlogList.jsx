import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import { CgNotes } from "react-icons/cg";

import { getDatabase, ref, onValue } from "firebase/database";
import BlogCard from "../blogCard/BlogCard";
import BlogCardSkeleton from "../blogCardSkeleton/BlogCardSkeleton";
import NoBlog from "../noBlog/NoBlog";
import Flex from "../../layouts/Flex";
import { useSelector } from "react-redux";

const BlogList = () => {
  const db = getDatabase();
  const user = useSelector((state) => state.user.user);
  const [followingId, setFollowingId]= useState([])
  const [blogList, setBlogList] = useState([]);
  const [followBlogList, setFollowBlogList]= useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global');

    useEffect(() => {
      const followRef = ref(db, "follow/");
      onValue(followRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((data) => {
          const follow = data.val();
          if (
            follow.followerid == user?.uid
          ) {
            arr.push(follow.followingid);
          }
        });
        setFollowingId(arr);
      });
    }, [db, user]);

  useEffect(() => {
    const blogsRef = ref(db, "blogs/");
    onValue(blogsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((blog) => {
        const content = blog.val();
        const id = blog.key;
        arr.unshift({ ...content, id: id });
      });
      setIsLoading(false);
      setBlogList(arr);
    });
  }, [db]);
  useEffect(() => {
    const blogsRef = ref(db, "blogs/");
    onValue(blogsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((blog) => {
        const content = blog.val();
        const id = blog.key;
        if (followingId.includes(content.bloggerId)) {
          arr.unshift({ ...content, id: id });
        }
      });
      setIsLoading(false);
      setFollowBlogList(arr);
    });
  }, [db, followingId]);
  console.log(followBlogList, "followBlog");
  




return (
  <div className="py-5 font-secondary">
    <Container>
<div className="flex justify-center my-8 w-full">
      <div className="relative bg-gray-100  rounded-full p-1 flex items-center shadow-lg">
        {/* Background slider */}
        <div 
          className={`absolute top-1 bottom-1 w-1/2 bg-white  rounded-full shadow-md transition-all duration-300 ease-out ${
            activeTab === 'following' ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        
        {/* Global Button */}
        <button
          onClick={() => setActiveTab('global')}
          className={`relative z-10 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ease-out ${
            activeTab === 'global'
              ? 'text-blue-600 '
              : 'text-gray-600  hover:text-gray-800 '
          }`}
        >
          🌍 Global
        </button>
        
        {/* Following Button */}
        <button
          onClick={() => setActiveTab('following')}
          className={`relative z-10 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ease-out ${
            activeTab === 'following'
              ? 'text-blue-600 '
              : 'text-gray-600  hover:text-gray-800 '
          }`}
        >
          👥 Following
        </button>
      </div>
      
      {/* Optional: Show current selection */}
      <div className="ml-4 flex items-center">
        <div className="text-xs text-gray-500  bg-gray-100  px-3 py-2 rounded-full">
          Showing {activeTab === 'global' ? 'all posts' : 'followed users'}
        </div>
      </div>
    </div>
      {isLoading ? (
        <BlogCardSkeleton />
      ) : blogList.length === 0 ? (
        <NoBlog />
      ) : (blogList.map((blog) => (
              <BlogCard blog={blog} />
          ))
      )}
    </Container>
  </div>
);

};

export default BlogList;
