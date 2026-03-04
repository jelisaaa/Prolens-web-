import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Camera, ShieldCheck, Clock, ArrowRight, User, 
  LayoutDashboard, ShoppingBag, History, Settings, LogOut, Search,
  ShoppingCart // Added ShoppingCart icon
} from "lucide-react";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f1f3f5] flex font-sans selection:bg-slate-300">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-slate-950 text-slate-400 hidden lg:flex flex-col sticky top-0 h-screen p-6">
        <div className="flex items-center gap-2 mb-12 px-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Camera className="text-slate-950 w-5 h-5" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase italic">Prolens</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" active />
          <SidebarLink icon={<ShoppingBag size={20} />} label="Catalog" to="/catalog" />
          
          {/* --- NEW CART OPTION --- */}
          <SidebarLink icon={<ShoppingCart size={20} />} label="My Cart" to="/viewcart" />
          
          <SidebarLink icon={<History size={20} />} label="My Rentals" to="/vieworderhistory" />
          <SidebarLink icon={<User size={20} />} label="Profile" to="/profile" />
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

    
      <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8">
     
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
            <p className="text-slate-500 text-sm">Welcome back, check your gear status.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search gear..." 
                className="pl-10 pr-4 py-2 bg-slate-200/50 border-none rounded-full text-sm focus:ring-2 ring-slate-400 outline-none w-64 transition-all"
              />
            </div>
            
           
            <Link to="/viewcart" className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors relative">
              <ShoppingCart size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Active Rentals" value="02" sub="Next return in 3 days" />
          <StatCard label="Reward Points" value="1,240" sub="Gold Member Status" />
          <StatCard label="Protection" value="Plus" sub="All gear fully covered" />
        </div>

      
        <section className="relative group mb-12">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 aspect-[16/7] md:aspect-[21/7]">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=2000"
              alt="Photography gear"
              className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/40 to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400 font-bold mb-4">Limited Edition Release</span>
              <h3 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 max-w-xl">
                Experience the <br /> <span className="text-slate-400 italic font-light">Leica M11</span> Monochrom
              </h3>
              <Link
                to="/catalog"
                className="w-fit flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-2xl"
              >
                Book Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <h4 className="text-lg font-bold text-slate-900 mb-6">The Prolens Edge</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ShieldCheck size={28} />}
            title="Premium Protection"
            desc="Comprehensive damage waivers for every rental. Total peace of mind."
          />
          <FeatureCard
            icon={<Clock size={28} />}
            title="Flex-Return"
            desc="Extend your rental period instantly through the app with one tap."
          />
          <FeatureCard
            icon={<Camera size={28} />}
            title="Pro Maintenance"
            desc="20-point inspection and sensor cleaning on every unit before dispatch."
          />
        </div>
      </main>
    </div>
  );
};


const SidebarLink = ({ icon, label, to = "#", active = false }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
      ? "bg-slate-800 text-white shadow-lg shadow-black/20" 
      : "hover:bg-slate-900 hover:text-slate-200"
    }`}
  >
    {icon}
    <span className="text-sm font-semibold tracking-wide">{label}</span>
  </Link>
);

const StatCard = ({ label, value, sub }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-3xl font-black text-slate-900 mb-1">{value}</h4>
    <p className="text-slate-400 text-xs font-medium">{sub}</p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <article className="group p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-slate-950 transition-all duration-500">
    <div className="w-14 h-14 bg-slate-100 text-slate-950 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-950 mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-700">
      {desc}
    </p>
  </article>
);

export default UserDashboard;