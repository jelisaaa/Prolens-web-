import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, ReceiptText } from "lucide-react";

const MyRentals = () => {
  const rentals = [
    {
      id: "RL-8821",
      item: "Sony FE 24-70mm f/2.8 GM II",
      date: "Oct 12 - Oct 15",
      status: "Active",
      price: "$145.00",
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: "RL-7740",
      item: "Canon EOS R5 Body",
      date: "Sept 20 - Sept 22",
      status: "Returned",
      price: "$210.00",
      image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: "RL-9901",
      item: "DJI Ronin RS3 Pro",
      date: "Aug 05 - Aug 08",
      status: "Late",
      price: "$95.00",
      image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        
        <Link to="/userdash" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-950 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">My Rentals</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your active gear and view past rental history.</p>
        </header>

        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-slate-400">Equipment</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-slate-400">Duration</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-slate-400">Status</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-slate-400">Total</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest font-bold text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentals.map((rental) => (
                <tr key={rental.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={rental.image} alt={rental.item} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-950">{rental.item}</p>
                        <p className="text-xs text-slate-400">ID: {rental.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-medium">{rental.date}</td>
                  <td className="px-8 py-6">
                    <StatusBadge status={rental.status} />
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-950">{rental.price}</td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-950 transition-colors">
                      <ReceiptText className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-between items-center bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl shadow-slate-200">
           <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Account Standing</p>
              <p className="text-lg font-medium">All equipment returned on time this month. Keep it up!</p>
           </div>
           <div className="h-12 w-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
           </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-blue-50 text-blue-600 border-blue-100",
    Returned: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Late: "bg-rose-50 text-rose-600 border-rose-100"
  };

  const icons = {
    Active: <Clock className="w-3 h-3" />,
    Returned: <CheckCircle2 className="w-3 h-3" />,
    Late: <AlertCircle className="w-3 h-3" />
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

export default MyRentals;