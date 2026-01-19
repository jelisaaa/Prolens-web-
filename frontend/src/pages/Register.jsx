import React, { useState } from "react";
import toast from "react-hot-toast";
import { createUserApi } from "../services/api";
import { useNavigate } from "react-router-dom";

import cameraImage from "../assets/Camera.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.username) {
      toast.error("Full name is required");
      return false;
    }

    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await createUserApi(formData);

      if (response.data.success) {
        toast.success("Account created successfully");
        navigate("/login");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* LEFT SIDE – IMAGE SECTION */}
      <div className="hidden lg:flex flex-1 bg-gray-900 relative">
        <img
          src={cameraImage}
          alt="Photography Equipment"
          /* object-cover ensures the image fills the area; 
             h-full and w-full ensure it takes the whole left side */
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay for the text shown in your target design */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-12">
          <h1 className="text-5xl font-bold text-white mb-2">Capture moments.</h1>
          <p className="text-gray-200 text-lg">Rent premium photography equipment.</p>
        </div>
      </div>

      {/* RIGHT SIDE – FORM SECTION */}
      {/* Changed bg-gray-50 to bg-gray-100 for a deeper grey */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 px-6 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-700 focus:outline-none bg-white"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-700 focus:outline-none bg-white"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-700 focus:outline-none bg-white"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-700 focus:outline-none bg-white"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-700 focus:outline-none bg-white"
            />

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-700 focus:outline-none bg-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#111827] text-white py-3 rounded-lg font-medium hover:bg-black transition-colors mt-4"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-8 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-gray-900 font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
