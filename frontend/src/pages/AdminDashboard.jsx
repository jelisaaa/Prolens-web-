import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Package, Settings, PlusCircle, Search, 
  LayoutDashboard, ShoppingBag, Truck, LogOut, 
  Camera, ChevronRight, Bell, Layers
} from "lucide-react";

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#F4F4F7] font-sans text-[#2D2D32]">
      
      <aside className="w-64 flex flex-col sticky top-0 h-screen bg-[#F4F4F7] border-r border-[#E5E5E9]">
        <div className="p-8">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="bg-[#2D2D32] p-2 rounded-xl shadow-sm">
              <Camera className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#1A1A1E]">ProLens</span>
          </div>

          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard size={19} />} label="Overview" active onClick={() => navigate("/admin/dashboard")} />
            <SidebarItem icon={<ShoppingBag size={19} />} label="Inventory" onClick={() => navigate("/viewproductlist")} />
            <SidebarItem icon={<Users size={19} />} label="Customers" onClick={() => navigate("/viewallusers")} />
            <SidebarItem icon={<Truck size={19} />} label="Rentals" onClick={() => navigate("/viewadminorder")} />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[#E5E5E9]">
          <SidebarItem icon={<Settings size={19} />} label="Settings" onClick={() => navigate("/admin/settings")} />
          <SidebarItem 
            icon={<LogOut size={19} />} 
            label="Logout" 
            color="text-red-500" 
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }} 
          />
        </div>
      </aside>


      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-16">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A9] w-4 h-4" />
            <input
              type="text"
              placeholder="Search gear..."
              className="bg-[#EBEBEF] border-none rounded-2xl py-2.5 pl-10 pr-6 text-sm focus:ring-1 focus:ring-[#D1D1D6] transition-all outline-none w-64 md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="text-[#636366] hover:text-black transition-colors relative">
              <Bell size={21} strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#FF3B30] rounded-full ring-2 ring-[#F4F4F7]"></span>
            </button>
            <div className="w-[1px] h-6 bg-[#E5E5E9]"></div>
            <div className="h-9 w-9 rounded-full bg-white border border-[#E5E5E9] p-0.5 cursor-pointer hover:shadow-sm transition-shadow">
               <img src="https://ui-avatars.com/api/?name=Admin&background=fff&color=000" className="rounded-full" alt="admin" />
            </div>
          </div>
        </header>

        {/* HERO */}
        <div className="mb-14 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1E]">Studio Overview</h1>
            <p className="text-[#8E8E93] mt-1 font-medium">Control center for your professional assets.</p>
          </div>
          <button 
            onClick={() => navigate("/addproduct")}
            className="bg-[#1A1A1E] text-white px-7 py-3 rounded-2xl text-sm font-semibold hover:bg-[#2D2D32] transition-all shadow-lg shadow-black/5 active:scale-95 flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add Gear
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Live Revenue" value="Rs. 1.2M" sub="+Rs. 42k today" />
          <StatCard label="Field Units" value="84" sub="12 returning soon" />
          <StatCard label="Client Base" value="952" sub="8 new this week" />
          <StatCard label="Stock Alert" value="03" sub="Review required" isAlert />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionBox 
            title="Rental Logistics" 
            desc="Manage current gear in the field, process returns, and track deliveries." 
            label="Open Orders"
            onClick={() => navigate("/viewadminorder")}
          />
          <ActionBox 
            title="Fleet Audit" 
            desc="Inspect item conditions, update stock counts, and edit catalog details." 
            label="View Inventory"
            onClick={() => navigate("/viewproductlist")}
          />
        </div>
      </main>
    </div>
  );
};



const SidebarItem = ({ icon, label, active, onClick, color = "text-[#636366]" }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
      active 
      ? 'bg-white text-[#1A1A1E] shadow-sm ring-1 ring-[#E5E5E9]' 
      : `${color} hover:text-[#1A1A1E] hover:bg-[#EBEBEF]`
    }`}
  >
    {icon} {label}
  </button>
);

const StatCard = ({ label, value, sub, isAlert }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-[#E5E5E9] shadow-sm hover:shadow-md transition-shadow">
    <span className="text-[10px] font-bold text-[#A1A1A9] uppercase tracking-[0.1em] block mb-2">{label}</span>
    <span className={`text-2xl font-bold block mb-1 ${isAlert ? 'text-[#FF3B30]' : 'text-[#1A1A1E]'}`}>{value}</span>
    <span className="text-xs text-[#8E8E93] font-medium">{sub}</span>
  </div>
);

const ActionBox = ({ title, desc, label, onClick }) => (
  <div 
    onClick={onClick}
    className="group bg-white p-10 rounded-[2.5rem] border border-[#E5E5E9] hover:border-[#D1D1D6] hover:shadow-xl hover:shadow-black/[0.02] transition-all duration-500 cursor-pointer"
  >
    <div className="w-12 h-12 bg-[#F4F4F7] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
      <Layers className="text-[#1A1A1E] w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-[#1A1A1E] mb-3">{title}</h3>
    <p className="text-[#8E8E93] text-[15px] leading-relaxed mb-8">{desc}</p>
    <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1E]">
      {label} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default AdminDashboard;