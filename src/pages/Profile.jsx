import React, { useEffect, useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { clearUser } from "../features/user/userSlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import Container from "../layouts/Container";
import NoBlog from "../components/noBlog/NoBlog";
import BlogCard from "../components/blogCard/BlogCard";
import { CgNotes } from "react-icons/cg";
import ProfileSkeleton from "../components/profileSkeleton/ProfileSkeleton";

const Profile = () => {
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
        const user = data.val();
        if (id == data.key) {
          setUserProfile(user);
        }
      });
    });
  }, [db, id]);
  const signOutHandler = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        {
          dispatch(clearUser());
          navigate("/");
          toast.success("Logout Success");
          localStorage.removeItem("user");
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

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

  if (isLoading)
    return (
      <div className="bg-white text-black py-16 px-4 flex justify-center items-center font-sans">
        <ProfileSkeleton />;
      </div>
    );

  return (
    <>
      <div className="bg-white text-black py-16 px-4 flex justify-center items-center font-sans">
        <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-2xl p-8 shadow-md">
          {/* Profile Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gray-300 mb-2 overflow-hidden flex justify-center items-center relative border-2 border-black">
              <img
                src={userProfile?.imageUrl}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>

            {/* Name & Email */}
            <h2 className="text-xl font-semibold">{userProfile?.username}</h2>
            <p className="text-gray-600 text-sm">{userProfile?.email}</p>
          </div>

          {/* Info */}
          <div className="mt-10 space-y-4">
            {/* Name */}
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-base font-medium">{userProfile?.username}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <FaPhone className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-base font-medium">{userProfile?.phone}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-base font-medium">{userProfile?.location}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-sm text-gray-500 mb-1">Bio</p>
              <p className="text-base text-gray-700">{userProfile?.bio}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={signOutHandler}
              className="w-full flex items-center justify-center gap-2 py-2 border border-black text-black rounded-md hover:bg-gray-100 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
      {user?.uid !== id && (
        <div className="py-5 font-secondary bg-black">
          <Container>
            <h2 className="text-[32px] font-primary font-bold mb-4 text-white flex items-center gap-x-2">
              <CgNotes size={40} />
              Recent Blogs ({blogList.length})
            </h2>
            {blogList.length === 0 ? (
              <NoBlog />
            ) : (
              blogList.map((blog) => <BlogCard blog={blog} key={blog.id} />)
            )}
          </Container>
        </div>
      )}
    </>
  );
};

export default Profile;
