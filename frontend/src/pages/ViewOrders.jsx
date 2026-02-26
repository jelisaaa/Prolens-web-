import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersApi } from "../services/api";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const tabs = ["ALL", "Pending", "Completed"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrdersApi();
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Error fetching rental orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((order) => order.status === filter);

  const pendingCount = orders.filter(o => o.status === "Pending").length;
  const completedCount = orders.filter(o => o.status === "Completed").length;

  return (
    <div className="min-h-screen bg-gray-100 px-6 md:px-16 py-12">

      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Rental Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your photography equipment rentals
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <div className="bg-white p-6 rounded-3xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Rentals</p>
          <h2 className="text-3xl font-bold text-gray-800">
            {orders.length}
          </h2>
        </div>

        <div className="bg-yellow-50 p-6 rounded-3xl shadow hover:shadow-lg transition">
          <p className="text-yellow-600">Pending Rentals</p>
          <h2 className="text-3xl font-bold text-yellow-700">
            {pendingCount}
          </h2>
        </div>

        <div className="bg-green-50 p-6 rounded-3xl shadow hover:shadow-lg transition">
          <p className="text-green-600">Completed Rentals</p>
          <h2 className="text-3xl font-bold text-green-700">
            {completedCount}
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              filter === tab
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-400 text-lg animate-pulse">
            Loading rental orders...
          </p>
        ) : filteredOrders.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.order_id}
                onClick={() => navigate(`/order/${order.order_id}`)}
                className="cursor-pointer bg-white rounded-3xl p-6 shadow hover:shadow-xl transition-all border border-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    #{order.order_id}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p className="text-xl font-bold text-gray-800">
                  Rs. {order.total_amount}
                </p>

                <button className="mt-6 w-full py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl">📷</p>
            <p className="text-gray-500 mt-4 font-semibold">
              No rentals found
            </p>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto mt-16 text-center">
        <button
          onClick={() => navigate("/viewproductlist")}
          className="px-10 py-3 rounded-2xl bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          Browse Equipment
        </button>
      </div>
    </div>
  );
};

export default ViewOrders;