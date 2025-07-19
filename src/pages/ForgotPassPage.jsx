import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Button from "../layouts/Button";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";

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
      navigate("/auth")
      toast.success("Password Reset Code Send")

    } catch (err) {
      setError("Failed to send reset email. Please check the email address.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-white px-4">
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
      <div className="max-w-md w-full p-6 border border-gray-300 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Forgot Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-white hover:text-black border border-black transition duration-300"
          >
            Send Reset Link
          </Button>
        </form>

        {/* Success or Error Message */}
        {message && (
          <p className="text-green-600 text-sm mt-4 text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassPage;
