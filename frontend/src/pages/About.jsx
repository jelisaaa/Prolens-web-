import React from 'react';
import { Camera, Shield, Zap, Globe, Award, ChevronRight } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#FFFFFF] text-[#1a1a1a] selection:bg-black selection:text-white">
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-4 block">
              ESTABLISHED 2024
            </span>
            <h1 className="text-6xl md:text-7xl font-light tracking-tight leading-[1.1] mb-8">
              The standard for <br />
              <span className="font-serif italic text-blue-600">Cinematic</span> excellence.
            </h1>
            <p className="text-xl text-gray-500 font-light leading-relaxed max-w-lg mb-10">
              ProLens provides the world's most advanced imaging tools to creators who refuse to compromise. We bridge the gap between creative vision and technical reality.
            </p>
            <div className="flex items-center gap-8">
              <button className="group flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-sm tracking-widest hover:bg-gray-900 transition-all">
                VIEW COLLECTION <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 border border-gray-100 rounded-[40px] -rotate-3"></div>
            <img 
              src="https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=2070&auto=format&fit=crop" 
              alt="Professional Camera" 
              className="relative z-10 rounded-[30px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 object-cover h-[600px] w-full"
            />
          </div>
        </div>
      </section>

      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-1">
              <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-gray-400 mb-6">Our Philosophy</h2>
              <p className="text-3xl font-light leading-tight">
                Gear is temporary. <br />
                <span className="text-blue-600">Vision is permanent.</span>
              </p>
            </div>
            <div className="md:col-span-2 text-xl text-gray-500 font-light leading-relaxed">
              We believe that access to professional equipment should not be a barrier to entry. ProLens curates a high-performance inventory ranging from Arri and Sony cinema bodies to rare vintage glass, ensuring that every frame you capture meets the highest industry standards.
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
            {[
              {
                icon: <Shield size={24} strokeWidth={1.5} />,
                title: "Asset Protection",
                desc: "Every rental is backed by our comprehensive coverage, allowing you to focus purely on the craft."
              },
              {
                icon: <Globe size={24} strokeWidth={1.5} />,
                title: "Global Logistics",
                desc: "With 15+ hubs, we manage equipment delivery and pickup across major production centers."
              },
              {
                icon: <Zap size={24} strokeWidth={1.5} />,
                title: "Elite Calibration",
                desc: "Every sensor is cleaned and every lens is bench-tested before it leaves our facility."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-12 hover:bg-gray-50 transition-colors">
                <div className="mb-8 text-blue-600">{feature.icon}</div>
                <h3 className="text-lg font-medium mb-4 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative rounded-[40px] overflow-hidden h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=2070&auto=format&fit=crop" 
              alt="Lens detail" 
              className="w-full h-full object-cover grayscale brightness-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
              <Award className="mb-6 opacity-50" size={40} />
              <h2 className="text-4xl font-light tracking-tighter mb-4">Trusted by the Industry's Best</h2>
              <p className="text-gray-300 max-w-xl font-light">From Netflix originals to indie breakthroughs, our gear has been behind some of the most compelling stories of the decade.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 text-center">
        <h2 className="text-sm uppercase tracking-[0.5em] text-gray-400 mb-8 font-bold">Ready to Create?</h2>
        <a href="/catalog" className="text-6xl md:text-8xl font-light tracking-tighter hover:text-blue-600 transition-colors duration-500">
          Start your shoot <span className="font-serif italic">→</span>
        </a>
      </section>
    </div>
  );
};

export default About;