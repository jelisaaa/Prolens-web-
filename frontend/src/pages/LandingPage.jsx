import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Play, Award, 
  Layers, Disc, ChevronRight 
} from "lucide-react";

const LandingPageBody = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartExploring = () => {
    navigate("/products");
  };

  return (
    <div className="bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-3 px-3 py-1 border-l-2 border-blue-600 bg-slate-50">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">
                Premium Optics & Cinema
              </span>
            </div>
            
            <h1 className="text-7xl md:text-[90px] font-extrabold tracking-tighter leading-[0.9] text-slate-900">
              Vision <br />
              <span className="text-blue-600 font-serif italic font-light">Defined.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-md font-light leading-relaxed">
              The industry's most trusted source for professional imaging tools. From Netflix originals to indie breakthroughs.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <button 
                onClick={handleStartExploring}
                className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-blue-600 transition-all flex items-center gap-3 shadow-2xl shadow-slate-200 active:scale-95"
              >
                Enter the Vault <ArrowRight size={16} />
              </button>
              <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-400 hover:text-slate-900 transition-colors">
                <Play size={14} fill="currentColor" /> Watch Reel
              </button>
            </div>
          </div>

          <div className="relative h-[600px] lg:h-[800px] w-full">
            <div className="absolute inset-0 rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group">
              <img 
                src="https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
                alt="Cinema Camera Lens"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hidden md:block max-w-[280px] animate-bounce-slow">
              <Award className="text-blue-600 mb-4" size={32} />
              <p className="text-sm font-bold text-slate-900 mb-1">Optically Guaranteed</p>
              <p className="text-xs text-slate-400 leading-relaxed">Every sensor is lab-calibrated and every lens bench-tested daily.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-xs font-black tracking-[0.4em] text-blue-600 uppercase mb-4">The Collection</h2>
              <p className="text-4xl md:text-5xl font-bold tracking-tight">Hand-picked for <br />high-stakes production.</p>
            </div>
            <button 
              onClick={handleStartExploring}
              className="text-sm font-bold border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
            >
              Explore Full Inventory
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 relative rounded-[3rem] overflow-hidden group h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt="Lenses"
              />
              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="text-3xl font-bold mb-2">Vintage Glass</h3>
                <p className="text-white/70 text-sm tracking-widest uppercase font-medium">Character over perfection</p>
              </div>
            </div>

            {/* Small Feature Item */}
            <div className="md:col-span-4 relative rounded-[3rem] overflow-hidden group h-[500px] bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1617631725450-70f44358a970?q=80&w=2000&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                alt="Lighting"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
                <Layers className="mb-4 text-blue-400" size={30} />
                <h3 className="text-2xl font-bold mb-2">Lighting Kits</h3>
                <p className="text-white/50 text-xs tracking-widest uppercase font-medium">Control the mood</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ICONIC BENEFITS --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <Disc className="text-slate-200" size={60} strokeWidth={1} />
            <h4 className="text-2xl font-bold">Raw Precision</h4>
            <p className="text-slate-500 leading-relaxed font-light">Our cameras are configured to industry standard RAW formats, ready for immediate color grading integration.</p>
          </div>
          <div className="space-y-6">
            <Award className="text-slate-200" size={60} strokeWidth={1} />
            <h4 className="text-2xl font-bold">Award-Winning Support</h4>
            <p className="text-slate-500 leading-relaxed font-light">On-set technical emergencies? Our engineers are available 24/7 via secure line for your production peace of mind.</p>
          </div>
          <div className="space-y-6">
            <Layers className="text-slate-200" size={60} strokeWidth={1} />
            <h4 className="text-2xl font-bold">Global Shipping</h4>
            <p className="text-slate-500 leading-relaxed font-light">Custom flight cases and GPS-tracked logistics ensure your gear arrives at any location worldwide, safely.</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div 
          className="max-w-7xl mx-auto rounded-[4rem] bg-slate-950 p-16 md:p-32 text-center text-white relative overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        >
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              Capture the <br /> <span className="font-serif italic text-blue-500 font-light">Unforgettable.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
              Don't let equipment limits dictate your story. Access the ProLens vault and start creating today.
            </p>
            <button 
              onClick={handleStartExploring}
              className="bg-white text-slate-900 px-14 py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Start Your Shoot
            </button>
          </div>
          
          <div className="absolute top-10 right-10 w-32 h-32 border border-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 border border-white/5 rounded-full animate-pulse delay-700"></div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageBody;