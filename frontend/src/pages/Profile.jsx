import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Phone, Calendar, MapPin, Camera, Edit3 } from "lucide-react";
import { getProfileApi } from "../services/api";
import HeaderCard from "../component/dashboard/HeaderCard";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    if (location.state?.updatedProfile) {
      setUser(location.state.updatedProfile);
    } else {
      const fetchProfile = async () => {
        try {
          const { data } = await getProfileApi();
          setUser({
            username: data.username || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            dob: data.dob || "",
            gender: data.gender || "",
          });
        } catch (error) {
          toast.error("Failed to load profile");
        }
      };
      fetchProfile();
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">

        <div className="md:w-1/4">
          <HeaderCard user ={user} />
        </div>

        <div className="md:w-3/4 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 border border-slate-200 shadow-sm">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src="/src/assets/user.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-8">
              <button
                onClick={() => navigate("/editprofile")}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95"
              >
                <Edit3 size={14} /> Edit your profile
              </button>
            </div>

            <div className="flex flex-col gap-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-950">
                {user.username}
              </h1>
              <p className="text-base text-slate-500 font-medium tracking-tight italic">
                {user.email}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
            <div className="mb-10">
              <h2 className="text-xl font-bold text-slate-950 uppercase tracking-widest">
                Personal Information
              </h2>
              <div className="h-1 w-12 bg-slate-900 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                { label: "Username", icon: <User size={14} />, value: user.username },
                { label: "Email Address", icon: <Mail size={14} />, value: user.email },
                { label: "Phone Number", icon: <Phone size={14} />, value: user.phoneNumber },
                { label: "Date of Birth", icon: <Calendar size={14} />, value: user.dob },
                { label: "Gender", icon: <Camera size={14} />, value: user.gender },
              ].map(({ label, icon, value }) => (
                <div key={label}>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black flex items-center gap-2 mb-3">
                    {icon} {label}
                  </label>
                  <p className="text-slate-800 font-semibold text-lg border-b border-slate-100 pb-2">
                    {value || "—"}
                  </p>
                </div>
              ))}
              <div className="md:col-span-2 group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black flex items-center gap-2 mb-3">
                  <MapPin size={14} /> Primary Address
                </label>
                <p className="text-slate-800 font-semibold text-lg border-b border-slate-100 pb-2">
                  {user.address || "No address provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;