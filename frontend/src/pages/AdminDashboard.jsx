import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { 
  Users, Package, BarChart3, ArrowUpRight, 
  Settings, PlusCircle, Search, Bell, 
  LayoutDashboard, ShoppingBag, Truck, LogOut 
} from "lucide-react";

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 

  const handleAddProductClick = () => {
    navigate("/addproduct");
  };

  return (
    <div className="flex min-h-screen bg-[#f1f3f5] font-sans text-slate-900">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-slate-950 p-2 rounded-xl">
              <Package className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-950">PROLENS.</span>
          </div>

          <nav className="space-y-2">
            <SidebarLink icon={<LayoutDashboard size={20}/>} label="Overview" active onClick={() => navigate("/admin/dashboard")} />
            <SidebarLink icon={<ShoppingBag size={20}/>} label="Inventory" onClick={() => navigate("/admin/inventory")} />
            <SidebarLink icon={<Users size={20}/>} label="Customers" onClick={() => navigate("/admin/users")} />
            <SidebarLink icon={<Truck size={20}/>} label="Live Rentals" onClick={() => navigate("/admin/rentals")} />
            <SidebarLink icon={<BarChart3 size={20}/>} label="Analytics" onClick={() => navigate("/admin/analytics")} />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <SidebarLink icon={<Settings size={20}/>} label="Settings" onClick={() => navigate("/admin/settings")} />
          <SidebarLink icon={<LogOut size={20}/>} label="Logout" color="text-red-500" onClick={() => console.log("Logout Logic")} />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        
        <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search gear, user ID, or order..." 
              className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-slate-950 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden cursor-pointer" onClick={() => navigate("/admin/profile")}>
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff" alt="Admin" />
            </div>
          </div>
        </div>

        <div className="p-10 max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight text-slate-950">Dashboard Overview</h1>
            <p className="text-slate-500 mt-2 font-medium">Monitoring system performance and rental logistics.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <MetricCard label="Net Revenue" value="Rs. 1,24.5k" trend="+14%" isPositive />
            <MetricCard label="Active Bookings" value="84" trend="+3%" isPositive />
            <MetricCard label="Pending Returns" value="12" trend="-2" />
            <MetricCard label="Out of Stock" value="05" trend="Critical" isAlert />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Inventory Velocity</h3>
                    <select className="bg-slate-50 border-slate-200 rounded-lg text-sm font-semibold p-1">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-64 w-full bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-medium">Chart Visualization: [Revenue vs Utilization]</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleAddProductClick}
                className="w-full text-left block p-1 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2rem] shadow-lg hover:shadow-slate-300 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
              >
                 <div className="p-8 text-center text-white">
                    <PlusCircle className="w-10 h-10 mx-auto mb-4 opacity-80" />
                    <h4 className="text-lg font-bold">List New Gear</h4>
                    <p className="text-slate-400 text-sm mt-1">Add items to public catalog</p>
                 </div>
              </button>
              
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-6">Recent Logins</h3>
                <div className="space-y-4">
                  <UserActivity name="Siddharth M." time="2 mins ago" status="Online" />
                  <UserActivity name="Anjali R." time="45 mins ago" status="Offline" />
                  <UserActivity name="Karan W." time="1 hour ago" status="Online" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, color = "text-slate-600", onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active ? 'bg-slate-950 text-white shadow-lg' : `${color} hover:bg-slate-100`}`}
  >
    {icon} {label}
  </button>
);

const MetricCard = ({ label, value, trend, isPositive, isAlert }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <p className="text-slate-500 text-[11px] uppercase tracking-widest font-bold mb-3">{label}</p>
    <div className="flex items-end justify-between">
      <h2 className="text-3xl font-black text-slate-950">{value}</h2>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isAlert ? 'bg-red-100 text-red-600' : isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
        {trend}
      </span>
    </div>
  </div>
);

const UserActivity = ({ name, time, status }) => (
  <div className="flex items-center justify-between group cursor-default">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-800">{name}</p>
        <p className="text-[10px] text-slate-400">{time}</p>
      </div>
    </div>
    <span className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
  </div>
);

export default AdminDashboard;