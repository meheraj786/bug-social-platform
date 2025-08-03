import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Container from "../layouts/Container";
import BlogCard from "../components/blogCard/BlogCard";

export default function Profile() {
  const db = getDatabase();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [userProfile, setUserProfile] = useState(null);
  const [blogList, setBlogList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      snapshot.forEach((data) => {
        const userdb = data.val();
        if (id== data.key) {
          setUserProfile({...userdb, id:data.key});
          setIsLoading(false)
        }
      });
    });
  }, [db, id, user]);

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
      setIsLoading(false);
      setBlogList(arr);
    });
  }, [db, id]);

  return (
    <div className="bg-[#F0F2F5] min-h-screen">
      {/* Cover Photo */}
      <div className="w-full h-60 bg-gradient-to-r from-blue-500 to-purple-500">
        {/* Profile Image */}
        <Container>
          <div className="relative h-60">
        <div className="absolute -bottom-12 left-8">
          <img
            src={userProfile?.imageUrl}
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
          />
        </div>

          </div>

        </Container>
      </div>
      <Container>
      {/* Profile Header Info */}
      <div className="pt-16 pb-8 rounded-lg px-8 bg-white shadow-md">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{userProfile?.username}</h2>
            <p className="text-sm text-gray-600">@{userProfile?.username}</p>
          </div>
          {
            !isLoading && user?.uid !== id && (<div className="flex gap-3">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition">
              Follow
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition">
              Message
            </button>
          </div>)
          }
          
        </div>
      </div>


      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-6 p-8">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/3 space-y-4">
          {/* Intro/About */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Info</h3>
            <p className="text-sm font-medium text-gray-600">{userProfile?.bio}</p>
            <p className="text-sm text-gray-600">{userProfile?.email}</p>
            <p className="text-sm text-gray-600">{userProfile?.location}</p>
          </div>

          {/* Friends Preview */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Friends</h3>
            <div className="grid grid-cols-3 gap-2">
              {/* {blogList.map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/100?img=${i}`}
                  alt="friend"
                  className="w-full rounded-md"
                />
              ))} */}
            </div>
          </div>
        </div>

        {/* Right Main Posts */}
        <div className="w-full lg:w-2/3 space-y-4">
          {/* Create Post Box */}
          <div className="bg-white p-4 rounded-md shadow-sm">
            <textarea
              rows={3}
              placeholder="What's on your mind?"
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-between items-center">
              <div className="flex gap-4 text-blue-600">
                <button>📸 Photo</button>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                Post
              </button>
            </div>
          </div>

          {/* Post Cards */}
          {blogList.map((blog) => (
            <BlogCard blog={blog} key={blogList.id} />
          ))}
        </div>
      </div>

      </Container>

    </div>
  );
}
