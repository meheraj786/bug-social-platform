import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useNavigate } from "react-router";

  import { motion } from "motion/react";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const navigate= useNavigate()
  const [errors, setErrors] = useState({});
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;

  const signupChangeHandler = (e) => {
    
    const { name, value } = e.target;
    setSignupInfo({
      ...signupInfo,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

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
    setSignupInfo({
      ...signupInfo,
      imageUrl: result.secure_url,
    });
    setImgLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!signupInfo.name.trim()) newErrors.name = "Name is required";
    if (!signupInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupInfo.email))
      newErrors.email = "Email is invalid";
    if (!signupInfo.password) newErrors.password = "Password is required";
    else if (signupInfo.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!signupInfo.location.trim())
      newErrors.location = "Location is required";
    if (!signupInfo.bio.trim()) newErrors.bio = "Bio is required";
    if (!signupInfo.imageUrl)
      newErrors.imageUrl = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signupSubmitHandler = () => {
    const auth = getAuth();
    if (!validateForm()) return;

    setIsLoading(true);

    createUserWithEmailAndPassword(auth, signupInfo.email, signupInfo.password)
      .then(() => {
        return updateProfile(auth.currentUser, {
          displayName: signupInfo.name,
          photoURL: signupInfo.imageUrl,
        });
      })
      .then(() => {
        toast.success("Signup Successful", { duration: 2000 });

        const user = auth.currentUser;
        const db = getDatabase();

        set(ref(db, "users/" + user.uid), {
          username: user.displayName,
          email: user.email,
          phone: signupInfo.phone,
          location: signupInfo.location,
          bio: signupInfo.bio,
          imageUrl: signupInfo.imageUrl,
        });
        setTimeout(() => {
          setIsLoading(false);
          navigate("/login")
          toast.success("Signup Successful!");
        }, 3000);
        setSignupInfo({
          name: "",
          email: "",
          password: "",
          imageUrl: "",
          phone: "",
          location: "",
          bio: "",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  };


  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="min-h-screen bg-gradient-to-br font-secondary from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Toaster position="top-right"/>
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-blue-100 text-lg">Join our community today</p>
        </div>

        <div className="px-8 py-8">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden flex justify-center items-center border-4 border-white shadow-lg">
                {imgLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
                ) : signupInfo.imageUrl ? (
                  <img
                    src={signupInfo.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-500" />
                )}
              </div>

              <label
                htmlFor="file-upload"
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="w-6 h-6 text-white" />
              </label>

              <input
                id="file-upload"
                type="file"
                onChange={handleChangeImage}
                className="hidden"
                accept="image/*"
              />
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Click to upload profile picture
            </p>
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.imageUrl}
              </p>
            )}
            <p className="text-red-600 text-xs mt-2 bg-red-50 px-3 py-1 rounded-full">
              *You cannot change this info later
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={signupInfo.name}
                  onChange={signupChangeHandler}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.name
                      ? "border-red-300 focus:border-red-500"
                      : signupInfo.name
                      ? "border-green-300 focus:border-green-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {signupInfo.name && !errors.name && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={signupInfo.email}
                  onChange={signupChangeHandler}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : signupInfo.email &&
                        !/\S+@\S+\.\S+/.test(signupInfo.email)
                      ? "border-red-300 focus:border-red-500"
                      : signupInfo.email &&
                        /\S+@\S+\.\S+/.test(signupInfo.email)
                      ? "border-green-300 focus:border-green-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {signupInfo.email &&
                  /\S+@\S+\.\S+/.test(signupInfo.email) &&
                  !errors.email && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={signupInfo.password}
                  onChange={signupChangeHandler}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : signupInfo.password && signupInfo.password.length >= 6
                      ? "border-green-300 focus:border-green-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
              {signupInfo.password && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">
                    Password strength:
                  </div>
                  <div className="flex space-x-1">
                    <div
                      className={`h-1 flex-1 rounded ${
                        signupInfo.password.length >= 6
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        signupInfo.password.length >= 8 &&
                        /[A-Z]/.test(signupInfo.password)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <div
                      className={`h-1 flex-1 rounded ${
                        signupInfo.password.length >= 8 &&
                        /[A-Z]/.test(signupInfo.password) &&
                        /[0-9]/.test(signupInfo.password)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={signupInfo.phone}
                  onChange={signupChangeHandler}
                  placeholder="Your phone number"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={signupInfo.location}
                  onChange={signupChangeHandler}
                  placeholder="Your city, country"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.location
                      ? "border-red-300 focus:border-red-500"
                      : signupInfo.location
                      ? "border-green-300 focus:border-green-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {signupInfo.location && !errors.location && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="bio"
                  value={signupInfo.bio}
                  onChange={signupChangeHandler}
                  placeholder="Tell us about yourself..."
                  rows="3"
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                    errors.bio
                      ? "border-red-300 focus:border-red-500"
                      : signupInfo.bio
                      ? "border-green-300 focus:border-green-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {signupInfo.bio && !errors.bio && (
                  <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.bio && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.bio}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {signupInfo.bio.length}/200 characters
              </p>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={signupSubmitHandler}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={()=>navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
