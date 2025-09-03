import React, { useEffect, useState } from "react";
import Container from "../../layouts/Container";
import { CgNotes } from "react-icons/cg";

import { getDatabase, ref, onValue } from "firebase/database";
import BlogCard from "../blogCard/BlogCard";
import BlogCardSkeleton from "../blogCardSkeleton/BlogCardSkeleton";
import NoBlog from "../noBlog/NoBlog";
import Flex from "../../layouts/Flex";
import { useSelector } from "react-redux";
import CustomLoader from "../../layouts/CustomLoader";

const BlogList = () => {
  const db = getDatabase();
  const user = useSelector((state) => state.user.user);
  const [followingId, setFollowingId] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [followBlogList, setFollowBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupId, setGroupId] = useState([]);
  const [groupPost, setGroupPost] = useState([]);
  const [activeTab, setActiveTab] = useState("global");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const followRef = ref(db, "member/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const member = data.val();
        if (member.memberId == user?.uid) {
          arr.push(member.groupId);
        }
      });
      setGroupId(arr);
    });
  }, [db, user]);

  useEffect(() => {
    const followRef = ref(db, "follow/");
    onValue(followRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((data) => {
        const follow = data.val();

        if (follow.followerid == user?.uid) {
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
        if (content.visibility != "private") {
          arr.unshift({ ...content, id: id });
        }
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
        if (
          (followingId.includes(content.bloggerId) &&
            content.visibility !== "private") ||
          (content.visibility !== "private" &&
            content.groupId &&
            !content.isAnonymous)
        ) {
          arr.unshift({ ...content, id: id });
        }
      });
      setIsLoading(false);
      setFollowBlogList(arr);
      
    });
  }, [db, followingId]);
  useEffect(() => {
    const blogsRef = ref(db, "blogs/");
    onValue(blogsRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((blog) => {
        const content = blog.val();
        const id = blog.key;
        if (groupId.includes(content.groupId)) {
          arr.unshift({ ...content, id: id });
        }
      });
      setIsLoading(false);
      setGroupPost(arr);
    });
  }, [db, groupId]);

  setTimeout(() => {
    setLoading(false);
  }, 1500);


  if (loading) return <CustomLoader/>

  return (
    <div className="py-3 font-secondary">
      <Container>
        {user && (
          <div className=" hidden xl:flex justify-center my-6 w-full">
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1.5 flex items-center shadow-xl border border-gray-200/50">
             
              <div
                className={`absolute top-1.5 bottom-1.5 w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg transition-all duration-500 ease-out ${
                  activeTab === "following"
                    ? "translate-x-full"
                    : activeTab === "groups"
                    ? "translate-x-[200%]"
                    : "translate-x-0"
                }`}
              />
              <button
                onClick={() => {
                  setActiveTab("global");
                  localStorage.setItem("activeTab", "global");
                }}
                className={`relative z-10 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-500 ease-out flex items-center gap-2 min-w-[120px] justify-center ${
                  activeTab === "global"
                    ? "text-white transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                🌍 <span>Global</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("following");
                  localStorage.setItem("activeTab", "following");
                }}
                className={`relative z-10 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-500 ease-out flex items-center gap-2 min-w-[120px] justify-center ${
                  activeTab === "following"
                    ? "text-white transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                👥 <span>Following</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("groups");
                  localStorage.setItem("activeTab", "groups");
                }}
                className={`relative z-10 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-500 ease-out flex items-center gap-2 min-w-[120px] justify-center ${
                  activeTab === "groups"
                    ? "text-white transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                🏠 <span>Groups</span>
              </button>
            </div>

            <div className="ml-6 flex items-center">
              <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2.5 rounded-full shadow-sm flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    activeTab === "global"
                      ? "bg-blue-500"
                      : activeTab === "following"
                      ? "bg-purple-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="font-medium">
                  Showing{" "}
                  {activeTab === "global"
                    ? "all posts"
                    : activeTab === "groups"
                    ? "group posts"
                    : "followed users"}
                </span>
              </div>
            </div>
          </div>
        )}
        {user && (
          <div className="flex xl:hidden flex-wrap justify-center my-6 w-full">
            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-1.5 flex items-center shadow-xl border border-gray-200/50">
              {/* Background slider */}
              <div
                className={`absolute top-1.5 bottom-1.5 w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg transition-all duration-500 ease-out ${
                  activeTab === "following"
                    ? "translate-x-full"
                    : activeTab === "groups"
                    ? "translate-x-[200%]"
                    : "translate-x-0"
                }`}
              />

              <button
                onClick={() => {
                  setActiveTab("global");
                  localStorage.setItem("activeTab", "global");
                }}
                className={`relative z-10 px-2 py-1 rounded-xl font-semibold text-sm transition-all duration-500 ease-out flex items-center gap-2 min-w-[120px] justify-center ${
                  activeTab === "global"
                    ? "text-white transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                🌍 <span>Global</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("following");
                  localStorage.setItem("activeTab", "following");
                }}
                className={`relative z-10 px-2 py-1 rounded-xl font-semibold text-sm transition-all duration-500 ease-out flex items-center gap-2 min-w-[120px] justify-center ${
                  activeTab === "following"
                    ? "text-white transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                👥 <span>Following</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("groups");
                  localStorage.setItem("activeTab", "groups");
                }}
                className={`relative z-10 px-2 py-1 rounded-xl font-semibold text-sm transition-all duration-500 ease-out flex items-center gap-2 min-w-[120px] justify-center ${
                  activeTab === "groups"
                    ? "text-white transform scale-105"
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                }`}
              >
                🏠 <span>Groups</span>
              </button>
            </div>

            <div className="ml-2 mt-2 flex items-center">
              <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200/50 px-4 py-2.5 rounded-full shadow-sm flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    activeTab === "global"
                      ? "bg-blue-500"
                      : activeTab === "following"
                      ? "bg-purple-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="font-medium">
                  Showing{" "}
                  {activeTab === "global"
                    ? "all posts"
                    : activeTab === "groups"
                    ? "group posts"
                    : "followed users"}
                </span>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <BlogCardSkeleton />
        ) : activeTab === "global" && blogList.length === 0 ? (
          <NoBlog />
        ) : activeTab === "following" && followBlogList.length === 0 ? (
          <NoBlog />
        ) : activeTab === "groups" && groupPost.length === 0 ? (
          <NoBlog />
        ) : activeTab === "global" ? (
          blogList.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : activeTab === "following" ? (
          followBlogList.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : activeTab === "groups" ? (
          groupPost.map((blog) => <BlogCard key={blog.id} blog={blog} />)
        ) : null}
      </Container>
    </div>
  );
};

export default BlogList;
