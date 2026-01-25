import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Added for navigation after success

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    // --- UPDATED START: Talking to Backend ---
    try {
      // Calling your backend API to trigger the OTP generation and database update
      const response = await fetch("http://localhost:5000/api/user/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email!");
        // Navigate to the reset-password page and pass the email in 'state'
        navigate("/reset-password", { state: { email } });
      } else {
        // This catches errors like "User not found" sent from your controller
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      // This catches connection issues (e.g., backend server is not running)
      console.error("Connection Error:", error);
      toast.error("Server is not responding. Check your backend!");
    } finally {
      setLoading(false);
    }
    // --- UPDATED END ---
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ProLens</h1>
          <h2 className="text-xl font-semibold text-gray-700">Forgot Password?</h2>
          <p className="text-gray-500 mt-2 text-sm">
            No worries! Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link 
            to="/login" 
            className="text-sm font-bold text-black hover:underline flex items-center justify-center gap-1"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;