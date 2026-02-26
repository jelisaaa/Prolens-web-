import React, { useState, useEffect } from "react";
import { getAllOrdersAdminApi, updateOrderStatusApi } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const ViewAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = ["All", "Pending", "Shipped", "Cancelled", "Returned"];
  
  const allStatuses = ["Pending", "Shipped", "Returned", "Cancelled"];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrdersAdminApi(statusFilter);
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusUpdate = async (e, orderId, newStatus) => {
    e.stopPropagation(); 
    try {
      const res = await updateOrderStatusApi(orderId, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order #${orderId} updated to ${newStatus}`);
        fetchOrders(); 
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Returned":
        return "bg-green-100 text-green-700 border border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      default: 
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">ProLens Rental Orders</h1>
        </div>

        <div className="flex gap-6 border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`pb-3 text-sm font-semibold transition ${
                statusFilter === tab
                  ? "border-b-2 border-gray-800 text-gray-800"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading rental bookings...</p>
        ) : orders.length ? (
          <div className="divide-y">
            {orders.map((order) => (
              <div
                key={order.order_id}
                onClick={() => navigate(`/admin/order/${order.order_id}`)}
                className="grid md:grid-cols-6 gap-4 py-5 text-sm items-center cursor-pointer hover:bg-gray-50 transition px-2 rounded-lg"
              >
                <span className="font-semibold text-gray-800">#{order.order_id}</span>

                <div>
                  <p className="text-gray-800 font-medium">{order.fullName}</p>
                  <p className="text-gray-400 text-xs">{order.user?.email}</p>
                </div>

                <span className="text-gray-600">{order.product?.name}</span>

                <span className="text-gray-600">
                  {order.startDate} → {order.endDate}
                </span>

                <span className="font-semibold text-gray-800">Rs. {order.total_amount}</span>

                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(e, order.order_id, e.target.value)}
                    className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer outline-none ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s} className="bg-white text-gray-800">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10">No rental bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAdminOrders;