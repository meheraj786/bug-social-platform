import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { getDatabase, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Button from "../../layouts/Button";
import time from "../../layouts/time";
import { Link } from "react-router";
import moment from "moment";

const BlogPostForm = () => {
  
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
  const user = useSelector((state) => state.user.user);
  const [info, setInfo] = useState({
    description: "",
    descriptionErr: "",
    loading: false,
    imageUrl:""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imgLoading, setImgLoading]= useState(false)

  const handleChangeImage = async (e) => {
    setImgLoading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "e-com app with firebase");
    data.append("cloud_name", "dlrycnxnh");

    const res = await fetch(coudinaryApi, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    setInfo({
      ...setInfo,
      imageUrl: result.secure_url,
    });
    setPreview(result.secure_url)
    setImgLoading(false);
  };

  const handleSubmit = () => {
    if (!user) {
      toast.error("Please wait while we load your profile.");
      return;
    }

    if (info.description.trim() === "") {
      setInfo((prev) => ({
        ...prev,
        descriptionErr: "Enter your Description",
      }));
    } else {
      setInfo((prev) => ({
        ...prev,
        loading: true,
        descriptionErr: "",
      }));

      const db = getDatabase();

      const blogData = {
        name: user.displayName,
        description: info.description,
        time: moment().format(),
        bloggerId: user.uid,
        imageUrl: user.photoURL,
        postImage: info.imageUrl || "", 
      };

      set(push(ref(db, "blogs/")), blogData)
        .then(() => {
          toast.success("Blog Published Successfully!");
          setInfo({
            description: "",
            descriptionErr: "",
            loading: false,
          });
          setImage(null);
          setPreview(null);
        })
        .catch(() => {
          toast.error("Something went wrong!");
          setInfo((prev) => ({
            ...prev,
            loading: false,
          }));
        });
    }
  };

return (
  <div className="bg-white/90 font-secondary backdrop-blur-xl p-6 mt-10 rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 hover:border-purple-300 transition-all duration-500 w-full max-w-3xl mx-auto group">
    {/* Header Section */}
    <div className="flex items-center gap-4 mb-5">
      {user && (
        <img
          src={user.photoURL || "https://via.placeholder.com/48"}
          alt="Your avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 shadow-md"
        />
      )}
      <div className="flex-1">
        <h3 className="font-bold font-primary text-gray-800 text-lg">
          {user ? `What's on your mind, ${user.displayName?.split(' ')[0]}?` : "Share Something..."}
        </h3>
        <p className="text-sm text-gray-500">Share your thoughts with the world</p>
      </div>
    </div>

    {/* Textarea Section */}
    <div className="relative mb-4">
      {user ? (
        <textarea
          className="w-full resize-none border-2 border-gray-200 focus:border-purple-400 rounded-2xl outline-none text-gray-800 placeholder-gray-500 p-4 text-base focus:ring-4 focus:ring-purple-100 transition-all duration-300 font-medium bg-gray-50/50 focus:bg-white"
          placeholder="Share your thoughts, experiences, or ask a question..."
          maxLength={500}
          rows={4}
          value={info.description}
          onChange={(e) =>
            setInfo((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      ) : (
        <div className="w-full border-2 border-gray-200 rounded-2xl text-gray-500 p-4 text-base bg-gradient-to-r from-gray-100 to-gray-200 flex items-center gap-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="font-medium">Please signup or login to share your thoughts</span>
        </div>
      )}

      {/* Character count overlay */}
      {user && (
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200">
          {info.description?.length || 0}/500
        </div>
      )}
    </div>

    {/* Error Message */}
    {info.descriptionErr && (
      <div className="flex items-center gap-2 text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl border border-red-200">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {info.descriptionErr}
      </div>
    )}

    {/* Media Section */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-purple-600 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-blue-50 group/media">
          <FaImage className="text-lg group-hover/media:scale-110 transition-transform duration-200" />
          <span className="text-sm font-semibold">Add Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChangeImage}
            disabled={!user}
          />
        </label>
      </div>

      {/* Privacy Settings */}
      <div className="flex items-center gap-2 text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <select className="text-sm bg-transparent border-none outline-none cursor-pointer font-medium">
          <option>Public</option>
        </select>
      </div>
    </div>

    {/* Image Preview */}
    {preview && (
      <div className="mb-4 relative group/preview">
        <img
          src={preview}
          alt="Preview"
          className="rounded-2xl w-full max-h-64 object-cover shadow-lg"
        />
        <button className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
          Click to remove
        </div>
      </div>
    )}

    {/* Submit Section */}
    <div className="border-t border-gray-200 pt-4">
      {user ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={info.loading || !info.description?.trim()}
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700  text-white w-full py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {info.loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Share Post
            </>
          )}
        </button>
      ) : (
        <Link
          to="/login"
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white w-full py-3 rounded-2xl text-base font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Sign in to Share
        </Link>
      )}
    </div>
  </div>
);
};

export default BlogPostForm;
