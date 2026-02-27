import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderDetailsApi } from "../services/api";

const UserOrderDetails = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetailsApi(orderId);
        if (res.data.success) {
          setOrder(res.data.data);
        } else {
          toast.error(res.data.message);
          navigate("/orders");
        }
      } catch (err) {
        toast.error("Unable to fetch rental details");
        console.error(err);
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400 text-lg animate-pulse">
          Loading rental details...
        </p>
      </div>
    );

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-6 md:px-16 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Rental #{order.order_id}
            </h1>
            <p className="text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Payment Info
            </h2>
            <p className="text-gray-600">
              Method: <span className="font-medium">{order.payment_method}</span>
            </p>
            <p className="text-gray-600 mt-2">
              Status: <span className="font-medium">{order.payment_status}</span>
            </p>
            <p className="text-xl font-bold text-gray-800 mt-6">
              Total: Rs. {order.total_amount}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Delivery Info
            </h2>
            <p className="text-gray-600">{order.fullName}</p>
            <p className="text-gray-600">{order.phone}</p>
            <p className="text-gray-600 mt-2">
              {order.address}, {order.city}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Rented Equipment
          </h2>
          <div className="space-y-4">
            {order.order_items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-4"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Rs. {item.price} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  Rs. {item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/orders")}
            className="px-10 py-3 rounded-2xl bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            Back to Rentals
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;