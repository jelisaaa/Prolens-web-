import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { saveShippingApi, getSavedShippingApi } from "../services/api";

const EnterShippingDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        const response = await getSavedShippingApi();
        if (response.data.success && response.data.data) {

            const { fullName, phone, address, city } = response.data.data;
          setFormData({ fullName, phone, address, city });
        }
      } catch (err) {
        console.error("ProLens Logistics: Error fetching data", err);
      }
    };
    fetchShipping();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Verifying delivery point...");

    try {
      const response = await saveShippingApi(formData);
      if (response.data.success) {
        toast.success("Logistics Updated", { id: loadingToast });
        setTimeout(() => navigate("/placeorders"), 1000);
      } else {
        toast.error(response.data.message || "Failed to update", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f4f5] flex items-center justify-center p-4">
      <Toaster position="bottom-center" />

      <div className="w-full max-w-4xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col md:flex-row overflow-hidden border border-zinc-200">
                <div className="w-full md:w-1/3 bg-[#ececec] p-10 flex flex-col justify-between border-r border-zinc-200">
          <div>
            <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-6">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 tracking-tight leading-none">
              ProLens <br /> Delivery
            </h2>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              Precision equipment requires secure delivery. Please ensure your contact details are active for the courier.
            </p>
          </div>
          
          <div className="mt-8">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Step 2 of 3</div>
            <div className="flex gap-1">
              <div className="h-1 w-8 bg-zinc-800 rounded-full"></div>
              <div className="h-1 w-8 bg-zinc-800 rounded-full"></div>
              <div className="h-1 w-8 bg-zinc-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 p-10 md:p-14 bg-white">
          <form onSubmit={handleSaveDetails} className="space-y-6">
            <div className="space-y-6">
              
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Full Name</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f9f9f9] border border-zinc-200 px-4 py-3 rounded-lg focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400 outline-none transition-all text-zinc-800"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f9f9f9] border border-zinc-200 px-4 py-3 rounded-lg focus:ring-1 focus:ring-zinc-400 outline-none transition-all text-zinc-800"
                  placeholder="+1 (000) 000-0000"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Street Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full bg-[#f9f9f9] border border-zinc-200 px-4 py-3 rounded-lg focus:ring-1 focus:ring-zinc-400 outline-none transition-all text-zinc-800 resize-none"
                  placeholder="Studio, Building, or Home Address"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">City</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f9f9f9] border border-zinc-200 px-4 py-3 rounded-lg focus:ring-1 focus:ring-zinc-400 outline-none text-zinc-800"
                  placeholder="Enter your city"
                />
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-4 py-4 rounded-xl font-bold tracking-tight transition-all
                ${loading 
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" 
                  : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"}`}
            >
              {loading ? "Confirming..." : "Proceed to Checkout"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterShippingDetails;