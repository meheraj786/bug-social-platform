import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  LogIn,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { useNavigate } from "react-router";

  import { motion } from "motion/react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const loginChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!loginInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginInfo.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!loginInfo.password) {
      newErrors.password = "Password is required";
    } else if (loginInfo.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginSubmitHandler = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.password
      );

      const user = userCredential.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(setUser(userData));

      toast.success("Login Successful");
      setLoginInfo({ email: "", password: "" });

      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast(`Login with ${provider} is not implemented yet`);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}   
  transition={{ duration: 0.4, ease: "easeOut" }} className="min-h-screen font-secondary bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-4">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-100 text-lg">Sign in to your account</p>
          </div>

          <div className="px-8 py-8">
            <div className="space-y-3 mb-8">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"></div>
                <span className="font-semibold text-gray-700">
                  Continue with Google
                </span>
              </button>
              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="w-full bg-blue-600 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-blue-700 transition-colors duration-200"
              >
                <div className="w-5 h-5 bg-white rounded-full"></div>
                <span className="font-semibold text-white">
                  Continue with Facebook
                </span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={loginInfo.email}
                  onChange={loginChangeHandler}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-10 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : loginInfo.email && /\S+@\S+\.\S+/.test(loginInfo.email)
                      ? "border-green-300 focus:border-green-500 bg-green-50"
                      : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }`}
                />
                {loginInfo.email &&
                  /\S+@\S+\.\S+/.test(loginInfo.email) &&
                  !errors.email && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                {errors.email && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={loginInfo.password}
                  onChange={loginChangeHandler}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : loginInfo.password.length >= 6
                      ? "border-green-300 focus:border-green-500 bg-green-50"
                      : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-8">
              <button
                onClick={() => navigate("/forgotpassword")}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={loginSubmitHandler}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Signup Redirect */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Secure Login</p>
              <p className="text-xs text-gray-600 mt-1">
                Your data is protected with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
