import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";

const Profile = () => {
  return (
    <div className=" bg-white text-black py-16 px-4 flex justify-center items-center font-sans">
      <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-2xl p-8 shadow-md">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full bg-gray-300 mb-4"></div>
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-600">johndoe@example.com</p>
        </div>

        {/* User Info Sections */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-3">
            <FaUser className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base font-medium">johndoe</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium">johndoe@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaPhone className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium">+880123456789</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-base font-medium">Dhaka, Bangladesh</p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Bio</p>
            <p className="text-base text-gray-700">
              Passionate developer with a love for building beautiful and functional web applications.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white rounded-md hover:bg-opacity-80 transition">
            <FaEdit />
            Edit Profile
          </button>
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
