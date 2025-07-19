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
import { useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";

const Profile = () => {
  const auth = getAuth();
  const user = useSelector((state) => state.user.user);
  const db = getDatabase();

  const [editMode, setEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    imageUrl: "",
    bio: "",
  });

  useEffect(() => {
    if (!user?.uid) return;
    const userRef = ref(db, `users/${user.uid}`);
    onValue(userRef, (snapshot) => {
      const res = snapshot.val();
      if (res) {
        setUserProfile({
          name: res.name || "",
          email: res.email || "",
          phone: res.phone || "",
          location: res.location || "",
          imageUrl: res.imageUrl || "",
          bio: res.bio || "",
        });
      }
    });
  }, [user?.uid]);

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "e-com app with firebase");
    data.append("cloud_name", "dlrycnxnh");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlrycnxnh/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const result = await res.json();

    await updateProfile(auth.currentUser, {
      photoURL: result.secure_url,
    });

    await update(ref(db, `users/${user.uid}`), {
      imageUrl: result.secure_url,
    });

    setUserProfile((prev) => ({
      ...prev,
      imageUrl: result.secure_url,
    }));
  };

  const handleSave = async () => {
    const updatedData = {
      name: userProfile.name,
      phone: userProfile.phone,
      location: userProfile.location,
      bio: userProfile.bio,
    };

    await update(ref(db, `users/${user.uid}`), updatedData);

    // Also update Firebase Auth displayName if name is updated
    await updateProfile(auth.currentUser, {
      displayName: userProfile.name,
    });

    setEditMode(false); // exit edit mode
  };

  return (
    <div className="bg-white text-black py-16 px-4 flex justify-center items-center font-sans">
      <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-2xl p-8 shadow-md">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-gray-300 mb-4 overflow-hidden">
            <img
              src={userProfile.imageUrl}
              className="w-28 h-28 object-cover rounded-full"
              alt="profile"
            />
          </div>
          {
          editMode && <input type="file" onChange={handleChangeImage} className="border mx-auto text-center w-full" />
          }
          
          <h2 className="text-2xl font-bold">{userProfile.name}</h2>
          <p className="text-gray-600">{userProfile.email}</p>
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
                  type="text"
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
          <button className="w-full flex items-center justify-center gap-2 py-2 border border-black text-black rounded-md hover:bg-gray-100 transition">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
