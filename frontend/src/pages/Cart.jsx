import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ChevronLeft, ShoppingBag, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { getCartByUserApi, updateCartQuantity, removeFromCartApi } from "../services/api";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const IMAGE_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const res = await getCartByUserApi();
        setCartItems(res.data.cartItems || []);
      } catch (err) {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const updateQty = async (cartId, change) => {
    const item = cartItems.find((i) => i.cart_id === cartId);
    if (!item || !item.product) return;
    const newQty = item.quantity + change;
    if (newQty < 1 || newQty > item.product.stock) return;

    try {
      await updateCartQuantity(item.product_id, newQty);
      setCartItems(prev => prev.map(i => i.cart_id === cartId ? { ...i, quantity: newQty } : i));
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const removeItem = async (cartId) => {
    try {
      const item = cartItems.find((i) => i.cart_id === cartId);
      if (item) {
        await removeFromCartApi(item.product_id);
        setCartItems(prev => prev.filter(i => i.cart_id !== cartId));
        toast.success("Removed from basket");
      }
    } catch (err) {
      toast.error("Removal failed");
    }
  };

  const totalPrice = cartItems.reduce((sum, i) => sum + (i.product?.rentalPrice || 0) * i.quantity, 0);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-6 py-12">
        

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-slate-800/60 pb-8">
          <div>
            <h1 className="text-3xl font-light tracking-tight">
              Rental <span className="font-semibold text-white">Basket</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium italic">Professional Gear Selection</p>
          </div>
          <button 
            onClick={() => navigate("/catalog")}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ChevronLeft size={14} /> Continue Browsing
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-slate-800/50 rounded-2xl bg-slate-900/20">
            <ShoppingBag className="text-slate-700 mb-4" size={40} strokeWidth={1} />
            <p className="text-slate-400 font-medium">Your basket is currently empty</p>
            <button onClick={() => navigate("/catalog")} className="mt-6 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4">Explore Catalog</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* List */}
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item) => (
                <div key={item.cart_id} className="flex gap-6 group border-b border-slate-800/40 pb-8 last:border-0">
                  <div className="w-36 h-36 bg-slate-900 rounded-sm overflow-hidden border border-slate-800 shrink-0 relative">
                    <img 
                      src={`${IMAGE_BASE_URL}${item.product?.thumbnail}`} 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                      alt={item.product?.name}
                    />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">{item.product?.name}</h3>
                        <p className="text-slate-400 text-sm mt-1 uppercase tracking-tighter">Rs. {item.product?.rentalPrice} <span className="text-slate-600">/ Day</span></p>
                      </div>
                      <button onClick={() => removeItem(item.cart_id)} className="text-slate-600 hover:text-white transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-slate-950 border border-slate-800 rounded-sm">
                        <button onClick={() => updateQty(item.cart_id, -1)} className="p-2 text-slate-400 hover:text-white transition-colors"><Minus size={14}/></button>
                        <span className="w-10 text-center text-sm font-mono text-white">{item.quantity}</span>
                        <button onClick={() => updateQty(item.cart_id, 1)} className="p-2 text-slate-400 hover:text-white transition-colors"><Plus size={14}/></button>
                      </div>
                      <p className="font-semibold text-slate-200">Rs. {item.product?.rentalPrice * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-sm sticky top-12 shadow-2xl shadow-black/50">
                <h2 className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-8 border-b border-slate-800 pb-4">Order Summary</h2>
                
                <div className="space-y-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">Subtotal</span>
                    <span className="text-slate-200">Rs. {totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-light">Service Fee</span>
                    <span className="text-blue-400 font-medium italic">Complimentary</span>
                  </div>
                  <div className="pt-6 mt-4 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-white text-base">Total</span>
                    <span className="text-2xl font-bold text-white font-mono">Rs. {totalPrice}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate("/shipping")}
                  className="w-full mt-10 bg-white hover:bg-slate-200 text-black py-4 rounded-sm font-bold uppercase tracking-widest text-xs transition-all active:translate-y-[1px]"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-8 flex flex-col items-center gap-3">
                    <div className="h-px w-8 bg-slate-800"></div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-600">
                        <ShieldCheck size={12} className="text-blue-500" /> Fully Encrypted
                    </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;