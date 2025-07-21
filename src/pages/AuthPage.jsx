import React, { useState } from "react";
import Container from "../layouts/Container";
import Flex from "../layouts/Flex";
import Button from "../layouts/Button";
import Logo from "../layouts/Logo";
import { BeatLoader } from "react-spinners";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { getDatabase, ref, set } from "firebase/database";
import { MoonLoader } from "react-spinners";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const AuthPage = () => {
  const coudinaryApi = import.meta.env.VITE_CLOUDINARY_API;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    imageUrl: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const loginStateHandler = () => {
    setIsLogin(!isLogin);
    setLoginInfo({
      email: "",
      password: "",
    });
    setSignupInfo({
      name: "",
      email: "",
      password: "",
    });
  };
  const signupChangeHandler = (e) => {
    setSignupInfo({
      ...signupInfo,
      [e.target.name]: e.target.value,
    });
  };
  const loginChangeHandler = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
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
  const signupSubmitHandler = () => {
    const auth = getAuth();
    setIsLoading(true);

    if (
      !signupInfo.name ||
      !signupInfo.email ||
      !signupInfo.password ||
      !signupInfo.imageUrl ||
      !signupInfo.bio ||
      !signupInfo.location
    ) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

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

        setSignupInfo({
          name: "",
          email: "",
          password: "",
          imageUrl: "",
          phone: "",
          location: "",
          bio: "",
        });
        setIsLogin(true);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  };

  const loginSubmitHandler = () => {
    setIsLoading(true);
    const auth = getAuth();

    if (!loginInfo.email || !loginInfo.password) {
      setIsLoading(false);
      toast.error("Please enter email and password");
      return;
    }

    signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(setUser(user));

        toast.success("Login Successful");
        setLoginInfo({
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="font-secondary">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <Container>
        <Flex className="relative overflow-hidden rounded-4xl shadow-lg">
          {/* Left Block */}
          <div className="w-1/2 py-[100px]  flex  flex-col gap-y-3 p-10  z-10 text-left">
            <div className="text-center text-[32px] font-bold font-primary">
              log in
            </div>
            <label htmlFor="">Your Email</label>
            <input
              value={loginInfo.email}
              onChange={(e) => loginChangeHandler(e)}
              type="text"
              name="email"
              placeholder="Enter Your Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label htmlFor="">Your Password</label>
            <div className="relative">
            <input
              value={loginInfo.password}
              onChange={(e) => loginChangeHandler(e)}
              type={showPass ? "text":"password"}
              name="password"
              placeholder="Enter Your Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
                        {
              showPass ? <FaRegEye onClick={()=>setShowPass(false)} className="absolute right-3 top-1/2 -translate-y-1/2" /> : <FaRegEyeSlash onClick={()=>setShowPass(true)} className="absolute right-3 top-1/2 -translate-y-1/2" /> 
            }

            </div>
            {isLoading ? (
              <BeatLoader className="text-center mx-auto" />
            ) : (
              <Button onClick={loginSubmitHandler}>Log in</Button>
            )}

            <p className="text-center text-medium">
              Don't have Account?{" "}
              <span
                className="text-orange-500 cursor-pointer"
                onClick={loginStateHandler}
              >
                Sign up
              </span>
            </p>
            <Link
              to="/forgotpassword"
              className="text-center text-red-500 text-medium"
            >
              Forgot Password
            </Link>
          </div>

          {/* Sliding Black Panel */}
          <div
            className={`w-1/2 py-[100px] p-10 absolute top-0 left-0 h-full bg-black text-white z-20  transition-all duration-500 ease-in flex justify-center items-center flex-col`}
            style={{
              transform: isLogin ? "translateX(100%)" : "translateX(0%)",
            }}
          >
            {isLogin ? (
              <>
                <Logo />
                <h2 className="text-[32px] font-bold font-primary mb-10 mt-5">
                  Login
                </h2>
                <p className="">
                  "Where thoughts become stories. Stay updated."
                </p>
              </>
            ) : (
              <>
                <Logo />
                <h2 className="text-[32px] font-bold font-primary mb-10 mt-5">
                  SignUp
                </h2>
                <p className="">"Your next favorite read is a signup away."</p>
              </>
            )}
          </div>

          {/* Right Block */}
          <div className="w-1/2 flex  flex-col gap-y-3 p-10  z-10 text-left">
            <div className="text-center text-[32px] font-bold font-primary">
              Sign Up
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full bg-gray-300 mb-2 overflow-hidden flex justify-center items-center relative border-2 border-black">
                {imgLoading ? (
                  <MoonLoader />
                ) : (
                  <img
                    src={signupInfo.imageUrl}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Upload File Label */}
                <div className="absolute overflow-hidden backdrop-blur bottom-2">
                  <label
                    htmlFor="file-upload"
                    className="block text-center text-sm cursor-pointer text-black  rounded-lg   hover:text-white font-semibold transition-all duration-300"
                  >
                    Upload
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleChangeImage}
                    className="hidden"
                    required
                  />
                </div>
              </div>
              <p className="text-red-600 text-[14px] my-3">
                *You can not change those info later
              </p>
            </div>
            <label htmlFor="">Your Name</label>
            <input
              required
              value={signupInfo.name}
              onChange={(e) => signupChangeHandler(e)}
              type="text"
              name="name"
              placeholder="Enter Your Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label htmlFor="">Your Email</label>
            <input
              required
              value={signupInfo.email}
              onChange={(e) => signupChangeHandler(e)}
              type="text"
              name="email"
              placeholder="Enter Your Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label htmlFor="">Your Password</label>
            <div className="relative">
            <input
              required
              value={signupInfo.password}
              onChange={(e) => signupChangeHandler(e)}
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter Your Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {
              showPass ? <FaRegEye onClick={()=>setShowPass(false)} className="absolute right-3 top-1/2 -translate-y-1/2" /> : <FaRegEyeSlash onClick={()=>setShowPass(true)} className="absolute right-3 top-1/2 -translate-y-1/2" /> 
            }
              
              


            </div>
            <label htmlFor="">Your Phone</label>
            <input
              value={signupInfo.phone}
              onChange={(e) => signupChangeHandler(e)}
              type="tel"
              name="phone"
              placeholder="Enter Your Phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label htmlFor="">Your Location</label>
            <input
              required
              value={signupInfo.location}
              onChange={(e) => signupChangeHandler(e)}
              type="text"
              name="location"
              placeholder="Enter Your Location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label htmlFor="">Your Bio</label>
            <input
              required
              value={signupInfo.bio}
              onChange={(e) => signupChangeHandler(e)}
              type="text"
              name="bio"
              placeholder="Enter Your Short Bio"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            {isLoading ? (
              <BeatLoader className="text-center mx-auto" />
            ) : (
              <Button onClick={signupSubmitHandler}>Sign Up</Button>
            )}
            <p className="text-center text-medium">
              Already Have Account?{" "}
              <span
                className="text-orange-500 cursor-pointer"
                onClick={loginStateHandler}
              >
                Login
              </span>
            </p>
          </div>
        </Flex>
      </Container>
    </div>
  );
};

export default AuthPage;
