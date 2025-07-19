import React, { useState } from "react";
import Container from "../layouts/Container";
import Flex from "../layouts/Flex";
import Button from "../layouts/Button";
import Logo from "../layouts/Logo";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { getDatabase, ref, set } from "firebase/database";

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(false);
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
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
const signupSubmitHandler = () => {
  const auth = getAuth();

  if (!signupInfo.name || !signupInfo.email || !signupInfo.password) {
    toast.error("Please fill in all fields");
    return;
  }

  createUserWithEmailAndPassword(auth, signupInfo.email, signupInfo.password)
    .then(() => {
      return updateProfile(auth.currentUser, {
        displayName: signupInfo.name,
      });
    })
    .then(() => {
      toast.success("Signup Successful", { duration: 2000 });

      const user = auth.currentUser; 
      const db = getDatabase();

      set(ref(db, "users/" + user.uid), {
        username: user.displayName,
        email: user.email,
      phone:"",
      location:"",
      bio:"",
      imageUrl:""
      });

      setSignupInfo({
        name: "",
        email: "",
        password: "",
      });
      setIsLogin(true);
    })
    .catch((error) => {
      toast.error(error.message);
    });
};


  const loginSubmitHandler = () => {
    const auth = getAuth();

    if (!loginInfo.email || !loginInfo.password) {
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
          navigate("/profile");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="font-secondary">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <Container>
        <Flex className="relative overflow-hidden rounded-4xl border">
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
            <input
              value={loginInfo.password}
              onChange={(e) => loginChangeHandler(e)}
              type="text"
              name="password"
              placeholder="Enter Your Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Button onClick={loginSubmitHandler}>Log in</Button>
            <p className="text-center text-medium">
              Don't have Account?{" "}
              <span
                className="text-orange-500 cursor-pointer"
                onClick={loginStateHandler}
              >
                Sign up
              </span>
            </p>
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
            <label htmlFor="">Your Name</label>
            <input
              value={signupInfo.name}
              onChange={(e) => signupChangeHandler(e)}
              type="text"
              name="name"
              placeholder="Enter Your Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label htmlFor="">Your Email</label>
            <input
              value={signupInfo.email}
              onChange={(e) => signupChangeHandler(e)}
              type="text"
              name="email"
              placeholder="Enter Your Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label htmlFor="">Your Password</label>
            <input
              value={signupInfo.password}
              onChange={(e) => signupChangeHandler(e)}
              type="text"
              name="password"
              placeholder="Enter Your Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <Button onClick={signupSubmitHandler}>Sign Up</Button>
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
