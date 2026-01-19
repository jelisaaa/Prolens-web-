import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import imageImage from "../assets/Image.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // 🔗 API call here later
      console.log("Login data:", formData);

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* LEFT SIDE: Brand at Top, Image Centered */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-gray-900 p-12 text-white">
        {/* Top: Branding */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">ProLens</h1>
          <p className="text-gray-400 mt-2 text-lg">
            Rent professional photography equipment with ease.
          </p>
        </div>

        {/* Middle: Perfectly Centered Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={imageImage}
            alt="Photography Equipment"
            className="max-w-full max-h-[500px] object-contain rounded-2xl shadow-2xl transition-transform hover:scale-105 duration-500"
          />
        </div>
        
      </div>

      {/* RIGHT SIDE: Centered Form on Grey Background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-8 lg:p-16">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" size="sm" className="text-sm font-medium text-gray-600 hover:text-black hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600 text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-black font-bold hover:underline">
              Create one for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;