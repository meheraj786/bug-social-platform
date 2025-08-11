import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Button from "../layouts/Button";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, Mail } from "lucide-react";

const ForgotPassPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate= useNavigate()

  const handleReset = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link sent to your email.");
      navigate("/login")
      toast.success("Password Reset Code Send")

    } catch (err) {
      setError("Failed to send reset email. Please check the email address.");
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500 opacity-10 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Glass Card */}
      <div className="relative w-full max-w-md">
        <div className=" bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-white text-opacity-70 text-sm">
              Don't worry, we'll send you reset instructions
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-white text-opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-transparent bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-opacity-15"
              />
            </div>

            <button
              onClick={handleReset}
              className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500 hover:shadow-opacity-25 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                  <>
                    <span>Send Reset Link</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                
              </div>
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className="mt-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-xl backdrop-blur-sm">
              <p className="text-green-300 text-sm text-center font-medium">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-xl backdrop-blur-sm">
              <p className="text-red-300 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <button className="text-white text-opacity-70 text-sm hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">
              <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Back to Login</span>
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-bounce"></div>
      </div>
    </div>
  );
};


export default ForgotPassPage;
