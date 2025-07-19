import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSignOutAlt,
  FaSave,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, onValue, update, set } from "firebase/database";
import { clearUser, setUser } from "../features/user/userSlice";
import toast from "react-hot-toast";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router";

const Profile = () => {
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imgLoading, setImgLoading] = useState(false);
  const auth = getAuth();
  const user = useSelector((state) => state.user.user);

  const db = getDatabase();

  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user.displayName,
    email: user.email,
    phone: "",
    location: "",
    imageUrl: "",
    bio: "",
  });

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
    if (!user?.uid) return;
    const userRef = ref(db, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const res = snapshot.val();
      if (res) {
        setUserProfile({
          name: user.displayName || "",
          email: user.email || "",
          phone: res.phone || "",
          location: res.location || "",
          imageUrl: res.imageUrl || "",
          bio: res.bio || "",
        });
      }
    });

    return () => unsubscribe();
  }, [user?.uid, db, user.displayName, user.email]);

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

    await updateProfile(auth.currentUser, {
      photoURL: result.secure_url,
    });

    await update(ref(db, `users/${user.uid}`), {
      imageUrl: result.secure_url,
    });
    toast.success("Image Successfully Uploaded");

    setUserProfile((prev) => ({
      ...prev,
      imageUrl: result.secure_url,
    }));
    setImgLoading(false);
  };

  const handleSave = async () => {
    const updatedData = {
      name: userProfile.name,
      phone: userProfile.phone,
      location: userProfile.location,
      bio: userProfile.bio,
    };

    await update(ref(db, `users/${user.uid}`), updatedData);

    await updateProfile(auth.currentUser, {
      displayName: userProfile.name,
    });

    const updatedUser = {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: userProfile.name,
      photoURL: auth.currentUser.photoURL,
      emailVerified: auth.currentUser.emailVerified,
    };
    dispatch(setUser(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));

    const blogRef = ref(db, "blogs/");
    onValue(blogRef, (snapshot) => {
      snapshot.forEach((blog) => {
        const data = blog.val();
        if (data.bloggerId == user.uid) {
          set(ref(db, "blogs/" + blog.key), {
            ...data,
            name: userProfile.name,
            imageUrl: auth.currentUser.photoURL,
          });
        }
      });
    });

    // Update comments
    const commentRef = ref(db, "comments/");
    onValue(commentRef, (snapshot) => {
      snapshot.forEach((comment) => {
        const data = comment.val();
        if (data.commenterId == user.uid) {
          set(ref(db, "comments/" + comment.key), {
            ...data,
            name: userProfile.name,
            imageUrl: auth.currentUser.photoURL,
          });
        }
      });
    });
    setEditMode(false);
  };

  return (
    <div className="bg-white text-black py-16 px-4 flex justify-center items-center font-sans">
      <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-2xl p-8 shadow-md">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-gray-300 mb-2 overflow-hidden flex justify-center items-center relative border-2 border-black">
            {imgLoading ? (
              <MoonLoader />
            ) : (
              <img
                src={userProfile.imageUrl}
                className="w-full h-full object-cover"
                alt="profile"
              />
            )}

            {/* Upload File Label */}
            {editMode && (
              <div className="absolute bg-gray-400/5 backdrop-blur w-full bottom-0">
                <label
                  htmlFor="file-upload"
                  className="block text-center text-sm cursor-pointer text-black px-4 py-2 rounded-lg  hover:bg-black hover:text-white font-semibold transition-all duration-300"
                >
                  Upload
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleChangeImage}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Name & Email */}
          <h2 className="text-xl font-semibold">{userProfile.name}</h2>
          <p className="text-gray-600 text-sm">{userProfile.email}</p>
        </div>

        {/* Info */}
        <div className="mt-10 space-y-4">
          {/* Name */}
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              {editMode ? (
                <input
                  type="text"
                  className="border p-1 rounded-md w-full"
                  value={userProfile.name}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, name: e.target.value })
                  }
                />
              ) : (
                <p className="text-base font-medium">{userProfile.name}</p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3">
            <FaPhone className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              {editMode ? (
                <input
                  type="tel"
                  className="border p-1 rounded-md w-full"
                  value={userProfile.phone}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, phone: e.target.value })
                  }
                />
              ) : (
                <p className="text-base font-medium">{userProfile.phone}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              {editMode ? (
                <input
                  type="text"
                  className="border p-1 rounded-md w-full"
                  value={userProfile.location}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, location: e.target.value })
                  }
                />
              ) : (
                <p className="text-base font-medium">{userProfile.location}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Bio</p>
            {editMode ? (
              <textarea
                className="w-full border rounded-md p-1"
                rows={3}
                value={userProfile.bio}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, bio: e.target.value })
                }
              ></textarea>
            ) : (
              <p className="text-base text-gray-700">{userProfile.bio}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          {editMode ? (
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
            >
              <FaSave />
              Save
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white rounded-md hover:bg-opacity-80 transition"
            >
              <FaEdit />
              Edit Profile
            </button>
          )}
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
  );
};

export default Profile;
