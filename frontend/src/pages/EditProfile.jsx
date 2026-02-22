import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProfileApi, updateProfileApi } from "../services/api";
import toast from "react-hot-toast";
import HeaderCard from "../component/dashboard/HeaderCard";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    if (location.state?.initialData) {
      setFormData(location.state.initialData);
    }
    const fetchProfile = async () => {
      try {
        const response = await getProfileApi();
        setFormData(response.data.data);
      } catch (error) {
        toast.error("Failed to sync profile data");
      }
    };

    fetchProfile();
  }, [location.state?.initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await updateProfileApi(formData);
      console.log("Updated profile response:",response.data);
      toast.success("ProLens profile updated!");
      navigate("/profile",{ state: {updatedProfile:response.data.updatedUser} });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating equipment rental profile"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        
        <div className="md:w-1/4">
          <HeaderCard user ={formData}/>
        </div>

        <div className="md:w-3/4 space-y-6">
          
          <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold tracking-tight">Lensman Settings</h1>
              <p className="opacity-70 mt-1">Keep your rental and contact details sharp.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              <div>
                <label className="text-slate-500 text-sm font-medium mb-2 block">
                  User Handle
                </label>
                <input
                  name="username"
                  placeholder="e.g. shutter_pro"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                />
              </div>
              <div>
                <label className="text-slate-500 text-sm font-medium mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-slate-500 text-sm font-medium mb-2 block">
                  Contact Number
                </label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-slate-500 text-sm font-medium mb-2 block">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 text-slate-600"
                />
              </div>

              <div>
                <label className="text-slate-500 text-sm font-medium mb-2 block">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50 text-slate-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-slate-500 text-sm font-medium mb-2 block">
                  Equipment Pickup/Delivery Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-slate-50/50"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-12 border-t border-slate-100 pt-8">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={handleSave}
                className="px-8 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 shadow-md shadow-slate-200 transition-all flex-1 sm:flex-none"
              >
                Save ProLens Profile
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;