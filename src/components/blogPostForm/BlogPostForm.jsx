import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { getDatabase, push, ref, set } from "firebase/database";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Button from "../../layouts/Button";
import time from "../../layouts/time";
import { Link } from "react-router";

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
        time: time(),
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
    <div className="bg-white p-4 rounded-2xl shadow-md  border-transparent hover:border-purple-400 transition duration-300 w-full max-w-xl mx-auto">
      {
        user ?       <textarea
        className="w-full resize-none border-none outline-none text-gray-800 placeholder-gray-500 p-2 text-sm focus:ring-0"
        placeholder="What's on your mind?"
        maxLength={500}
        rows={4}
        value={info.description}
        onChange={(e) =>
          setInfo((prev) => ({ ...prev, description: e.target.value }))
        }
      /> :       <textarea
        className="w-full resize-none border-none outline-none text-gray-800 placeholder-gray-500 p-2 text-sm focus:ring-0"
        placeholder="Please Signup or Login to Post Something"
        maxLength={500}
        rows={4}
        disabled
        value={info.description}
        onChange={(e) =>
          setInfo((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      }

      {info.descriptionErr && (
        <p className="text-xs text-red-500 mt-1">{info.descriptionErr}</p>
      )}

      <div className="flex items-center justify-between mt-3">
        <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-purple-600 transition">
          <FaImage />
          <span className="text-sm">Photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChangeImage}
          />
        </label>

        <span className="text-xs text-gray-500">
          {info.description?.length}/500
        </span>
      </div>

      {preview && (
        <div className="mt-3">
          <img
            src={preview}
            alt="Preview"
            className="rounded-lg w-full max-h-64 object-cover"
          />
        </div>
      )}

      {
        user ? <button
        type="button"
        onClick={handleSubmit}
        disabled={info.loading}
        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full py-2 rounded-xl text-sm font-medium transition-all"
      >
        {info.loading ? "Posting..." : "Post"}
      </button> : <button 
        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full py-2 rounded-xl text-sm font-medium transition-all">
<Link
      to="/login"
        
      >
        Please Login
      </Link>
      </button> 
      }

      
    </div>
  );
};

export default BlogPostForm;
