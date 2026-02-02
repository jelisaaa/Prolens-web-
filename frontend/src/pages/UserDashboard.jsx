import React from "react";
import { Link } from "react-router-dom";
import { Camera, Calendar, Rocket, ArrowRight, ShieldCheck, Clock } from "lucide-react";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 selection:bg-gray-200 font-sans">
      {/*  Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-200/40 to-transparent -z-10" />

      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/*Header Section*/}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-10 bg-slate-400"></span>
            <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500 font-bold">
              Prolens • Professional Equipment
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.1]">
                Welcome Back,<br />
                <span className="text-slate-400 font-light italic">Capture Greatness.</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                Your creative studio, simplified. Rent the world's best photography gear with zero friction.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="group flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-slate-200 active:scale-95"
              >
                Browse Catalog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/my-rentals"
                className="px-8 py-4 border border-slate-300 bg-white/80 backdrop-blur-md text-slate-950 rounded-full text-sm font-bold hover:bg-white transition-all shadow-sm"
              >
                View My Rentals
              </Link>
            </div>
          </div>
        </header>

        {/*Visual Section */}
        <section className="relative mb-24 group">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent z-10"></div>
            <img
              src="/src/assets/prolens-dashboard.jpg"
              alt="Photography equipment"
              className="w-full h-[450px] md:h-[550px] object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            
            <div className="absolute bottom-10 left-6 md:left-12 z-20">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 text-white max-w-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">New Arrival</span>
                </div>
                <h2 className="text-2xl font-bold">Phase One XF System</h2>
                <p className="mt-2 text-sm text-slate-100/80 leading-relaxed">
                  Experience 150MP medium format detail. Available for weekend bookings in select regions.
                </p>
              </div>
            </div>
          </div>
        </section>

       {/* FeaturesGrid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Premium Protection"
            desc="Comprehensive damage waivers available for every rental. Shoot with total peace of mind."
          />
          <FeatureCard 
            icon={<Clock className="w-6 h-6" />}
            title="Flex-Return"
            desc="Running late on a shoot? Extend your rental period instantly through the app with one tap."
          />
          <FeatureCard 
            icon={<Camera className="w-6 h-6" />}
            title="Pro Maintenance"
            desc="Our technicians perform a 20-point inspection and sensor cleaning on every unit before dispatch."
          />
        </section>
      </main>
    </div>
  );
};


const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-10 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500 group-hover:rotate-[10deg]">
      {icon}
    </div>
    <h3 className="text-xl font-extrabold text-slate-950 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm group-hover:text-slate-600 transition-colors">
      {desc}
    </p>
  </div>
);

export default UserDashboard;