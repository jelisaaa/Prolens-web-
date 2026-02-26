import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getCartByUserApi,
  placeOrderApi,
} from "../services/api";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    const savedShipping = JSON.parse(localStorage.getItem("shipping"));
    if (savedShipping) setShipping(savedShipping);
  }, []);


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartByUserApi();
        if (res.data.success) {
          setCartItems(res.data.cartItems);

          const total = res.data.cartItems.reduce(
            (acc, item) => acc + item.quantity * (item.product?.rentalPrice || 0),
            0
          );
          setTotalAmount(total);
        }
      } catch (err) {
        toast.error("Failed to fetch cart");
        setCartItems([]);
        setTotalAmount(0);
      }
    };
    fetchCart();
  }, []);


  const handlePlaceOrder = async () => {
    if (!cartItems.length) return toast.error("Cart is empty!");
    setLoading(true);
    const loadingToast = toast.loading("Placing your order...");

    try {
      const orderData = {
        order_items: cartItems.map(ci => ({
          productId: ci.product_id,
          quantity: ci.quantity,
        })),
        total_amount: totalAmount,
        fullName: shipping.fullName,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city,
        payment_method: "Cash on Delivery",
      };

      const res = await placeOrderApi(orderData);
      if (res.data.success) {
        toast.success("Order placed successfully! 📦", { id: loadingToast });
        setTimeout(() => navigate("/order-confirmation"), 1200);
      } else {
        toast.error(res.data.message || "Order failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error(err.message || "Order failed", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex justify-center items-start py-12 px-4">
      <Toaster position="bottom-center" />
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4 text-center">
            Shipping Details
          </h2>
          <div className="bg-[#ececec] p-6 rounded-xl flex flex-col gap-4">
            <p className="text-zinc-700">
              <span className="font-bold">Name:</span> {shipping.fullName}
            </p>
            <p className="text-zinc-700">
              <span className="font-bold">Phone:</span> {shipping.phone}
            </p>
            <p className="text-zinc-700">
              <span className="font-bold">Address:</span> {shipping.address}
            </p>
            <p className="text-zinc-700">
              <span className="font-bold">City:</span> {shipping.city}
            </p>
            <p className="text-zinc-900 font-bold mt-2">
              Payment: Cash on Delivery
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4 text-center">
            Cart Summary
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-zinc-400 text-center">Your cart is empty</p>
          ) : (
            <ul className="space-y-4 max-h-[500px] overflow-y-auto">
              {cartItems.map(item => (
                <li
                  key={item.cart_id}
                  className="flex items-center justify-between bg-[#f9f9f9] p-4 rounded-xl shadow-sm hover:bg-[#ececec] transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.thumbnail}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-semibold text-zinc-900">{item.product?.name}</p>
                      <p className="text-zinc-500 text-sm">
                        Qty: {item.quantity} × Rs. {item.product?.rentalPrice}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-zinc-900">
                    Rs. {item.quantity * (item.product?.rentalPrice || 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {cartItems.length > 0 && (
            <div className="mt-6 flex justify-between font-bold text-zinc-900 text-lg">
              <span>Total:</span>
              <span>Rs. {totalAmount}</span>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading || !cartItems.length}
            className={`mt-6 w-full py-4 rounded-xl font-bold transition
              ${loading
                ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
              }`}
          >
            {loading ? "Processing..." : `Place Order (Rs. ${totalAmount})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;