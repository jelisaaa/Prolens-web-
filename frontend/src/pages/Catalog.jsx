import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal, ShoppingCart } from "lucide-react";

const Catalog = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const inventory = [
    { 
      id: 1, 
      name: "Sony A7R V", 
      category: "Bodies", 
      price: 85, 
      brand: "Sony", 
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 2, 
      name: "Canon RF 50mm f/1.2", 
      category: "Lenses", 
      price: 45, 
      brand: "Canon", 
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 3, 
      name: "RED Komodo 6K", 
      category: "Bodies", 
      price: 250, 
      brand: "RED", 
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400" 
    },
  ];

  const filteredItems = inventory.filter(item => {
    const matchesFilter = filter === "All" || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-950 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <h1 className="text-4xl font-extrabold tracking-tight">Equipment Catalog</h1>
          </div>

          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search cameras, lenses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-400" />
          {["All", "Bodies", "Lenses"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                filter === cat ? "bg-slate-950 text-white shadow-lg" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/product/${item.id}`)}
              className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {item.brand}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.category}</p>
                <h3 className="text-lg font-bold text-slate-950 mb-4 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <p className="text-xl font-black text-slate-950">${item.price}<span className="text-xs font-medium text-slate-400">/day</span></p>
                  <div className="bg-slate-950 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;