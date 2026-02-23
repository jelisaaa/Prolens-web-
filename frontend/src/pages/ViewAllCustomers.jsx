import React, { useState, useEffect } from "react";
import axios from "axios";
import UserSearch from "../component/admin/UserSearch";
import { FaPlusCircle, FaCamera, FaClipboardList, FaUser, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

const ViewAllCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        setError(err.response?.data?.message || "Error fetching customers");
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold text-gray-600">
        Loading Customers...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar on Left */}
      <div className="w-72 bg-gray-50 rounded-2xl shadow-md p-6 min-h-screen flex flex-col justify-between border border-gray-200">
        <div className="flex flex-col gap-3 text-gray-700">
          <button
            onClick={() => navigate("/addproduct")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition w-full"
          >
            <FaPlusCircle /> Add Equipment
          </button>

          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition w-full"
          >
            <FaCamera /> Manage Equipment
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition w-full"
          >
            <FaClipboardList /> Orders
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 transition w-full"
          >
            <FaUser /> Profile
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 text-red-600 transition w-full justify-center"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      <div className="flex-1 max-w-7xl mx-auto px-4 py-10 flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            Customers
          </h2>
          <p className="text-gray-500">Browse and manage all registered customers.</p>
        </div>

        <UserSearch query={searchTerm} setQuery={setSearchTerm} />

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        {filteredCustomers.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.user_id}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                    {customer.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {customer.username || "Unknown"}
                    </h3>
                    <p className="text-gray-500 text-sm">{customer.email}</p>
                  </div>
                </div>

                <div className="text-gray-600 text-sm">
                  <p><span className="font-semibold">Phone:</span> {customer.phoneNumber || "---"}</p>
                  <p><span className="font-semibold">Address:</span> {customer.address || "No address"}</p>
                </div>

                <div className="mt-auto">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      customer.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {customer.is_active ? "Active" : "Suspended"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-gray-400 italic">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllCustomers;