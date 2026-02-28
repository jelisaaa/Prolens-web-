import React, { useState, useEffect } from "react";
import { getOrdersApi } from "../services/api"; 
import { Hash, Calendar, ArrowRight, Box, ChevronRight, Activity } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [loading, setLoading] = useState(false);

  const tabs = ["Pending", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getOrdersApi();
        let userOrders = res.data.orders || [];
        setOrders(userOrders.filter(o => o.status === activeTab));
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] antialiased selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-6xl mx-auto px-6 py-20">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Order Management</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight text-slate-900">
              Your <span className="font-bold">Rental History</span>
            </h1>
          </div>

          <nav className="flex bg-slate-200/50 p-1 rounded-full border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-xs font-semibold rounded-full transition-all ${
                  activeTab === tab 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-40">
              <Activity className="animate-spin text-blue-500 mb-4" size={32} />
              <p className="text-[10px] uppercase tracking-widest font-bold">Fetching Records</p>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div 
                key={order.order_id} 
                className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-16 w-16 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <Hash size={20} className="text-slate-400 group-hover:text-blue-500" />
                </div>

                <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reference</p>
                    <p className="text-sm font-semibold text-slate-900">#{order.order_id.toString().padStart(5, '0')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-sm font-semibold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="md:text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Valuation</p>
                    <p className="text-lg font-bold text-slate-900">Rs. {Number(order.total_amount).toLocaleString()}</p>
                  </div>
                </div>


                <div className="hidden md:block">
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-white border border-dashed border-slate-200 rounded-3xl">
              <Box size={48} strokeWidth={1} className="text-slate-200 mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 italic">No activity logs found for {activeTab}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;