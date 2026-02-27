import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetailsAdminApi } from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const OrderDetailsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetailsAdminApi(id);
        if (res.data.success) {
          setOrder(res.data.data);
          toast.success("Order loaded successfully!");
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.error("Failed to load order:", err);
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading…</p>;
  if (!order) return <p className="text-center mt-10 text-red-500">Order not found</p>;

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Order #{order.order_id}</h1>
          <button
            onClick={() => navigate("/viewadminorder")}
            className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
            >
              {order.status}
            </span>
          </p>
          <p><strong>Total:</strong> Rs. {Number(order.total_amount).toLocaleString()}</p>
          <p><strong>Payment:</strong> {order.payment_method} ({order.payment_status})</p>
          <p><strong>User:</strong> {order.fullName} ({order.user?.email || "N/A"})</p>
          <p><strong>Address:</strong> {order.address}, {order.city}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Rented Items</h2>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3 text-center">Price (Rs.)</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-center">Total (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-center">{Number(item.price).toLocaleString()}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">{Number(item.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsAdmin;