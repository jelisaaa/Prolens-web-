import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; 
import UserSearch from "../component/admin/UserSearch";
import { 
  FaPlusCircle, FaCamera, FaClipboardList, 
  FaUser, FaSignOutAlt, FaLock, FaUnlock 
} from "react-icons/fa";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

const ViewAllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // TOGGLE STATUS FUNCTION
  const toggleStatus = async (userId, currentStatus) => {
    if (!userId) {
      toast.error("Invalid User ID");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/user/update-status/${userId}`,
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Standardized to use user_id
        setCustomers(customers.map(c => 
          c.user_id === userId ? { ...c, is_active: !currentStatus } : c
        ));
        toast.success(`User ${!currentStatus ? 'Activated' : 'Suspended'}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/user/viewallusers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) setCustomers(response.data.data);
      } catch (err) {
        toast.error("Error fetching directory");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between sticky top-0 h-screen">
        <div>
          <div className="mb-10 px-2">
            <h1 className="text-xl font-bold tracking-tight text-black">
              ProLens <span className="text-blue-600 font-medium">Admin</span>
            </h1>
          </div>
          <nav className="space-y-1">
            <SidebarItem icon={<FaPlusCircle size={14}/>} label="Add Equipment" onClick={() => navigate("/addproduct")} />
            <SidebarItem icon={<FaCamera size={14}/>} label="Manage Gear" onClick={() => navigate("/viewproductlist")} />
            <SidebarItem icon={<FaClipboardList size={14}/>} label="Orders" onClick={() => navigate("/viewadminorder")} />
            <SidebarItem icon={<FaUser size={14}/>} label="Customers" active />
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-gray-500 hover:text-red-600 transition-all text-sm font-medium">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-semibold text-black tracking-tight">Customer Directory</h2>
            <p className="text-gray-500 text-sm">Real-time access control.</p>
          </div>
          <div className="w-80 bg-white rounded-xl border border-gray-200 p-1">
            <UserSearch query={searchTerm} setQuery={setSearchTerm} />
          </div>
        </header>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-400">Client</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-400">Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-400 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.user_id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-black text-sm font-semibold border border-gray-200">
                        {customer.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">{customer.username}</p>
                        <p className="text-[11px] text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                      customer.is_active 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {customer.is_active ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => toggleStatus(customer.user_id, customer.is_active)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                        customer.is_active 
                        ? "text-red-600 border-red-100 hover:bg-red-600 hover:text-white" 
                        : "text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {customer.is_active ? <><FaLock size={10}/> Suspend</> : <><FaUnlock size={10}/> Activate</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, onClick, active = false }) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm transition-all ${active ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 font-medium"}`}>
    <span>{icon}</span>{label}
  </button>
);

export default ViewAllCustomers;