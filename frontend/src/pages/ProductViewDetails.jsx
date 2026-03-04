import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  addToCartApi,
  getProductDetailsApi,
  getRelatedProductsApi,
} from "../services/api";

// ✅ Import from the same folder (pages)
import ViewReview from "./ViewReview";

const ProductViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // --- Rental Duration States ---
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(1);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Calculate duration whenever dates change
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDuration(diffDays);
      } else {
        setDuration(1); // Default to 1 day if same day or invalid
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!product?.category) return;
    const fetchRelated = async () => {
      try {
        const res = await getRelatedProductsApi(id, product.category);
        if (res.data.success) setRelatedProducts(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch related products");
      }
    };
    fetchRelated();
  }, [product?.category, id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductDetailsApi(id);
      if (res.data.success) {
        setProduct(res.data.product);
        setMainImage(res.data.product.thumbnail);
      } else {
        toast.error(res.data.message || "Equipment not found");
        navigate("/");
      }
    } catch (err) {
      toast.error("Failed to load gear details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select rental dates");
      return;
    }

    try {
      const res = await addToCartApi({ 
        productId: product.id, 
        quantity,
        startDate,
        endDate,
        totalPrice: product.price * duration * quantity 
      });
      if (res.data.success) toast.success(res.data.message);
      else toast.error(res.data.message || "Failed to add to cart");
    } catch (err) {
      toast.error("Please login to reserve gear");
      navigate("/login");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-mono text-gray-400">
      INITIALIZING GEAR DATA...
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      Gear not found
    </div>
  );

  const stockCount = product.stock;
  const images = product.images?.length ? [product.thumbnail, ...product.images] : [product.thumbnail];
  const totalPrice = product.price * duration * quantity;

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Toaster />
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* --- Main Product Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12">
          
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                    mainImage === img ? "border-gray-900 scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between py-2">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">{product.name}</h1>

              <div className="mt-6 flex items-baseline gap-4">
                <span className="text-3xl font-mono font-bold text-gray-900">₹{product.price}</span>
                <span className="text-gray-400 text-sm">/ day</span>
              </div>

              {/* Rental Duration Picker */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-gray-50 pt-8">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Total for {duration} day(s)</h3>
                <p className="text-3xl font-bold text-gray-900">₹{totalPrice}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 bg-gray-50 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="px-6 font-bold font-mono text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                  className="px-5 py-3 bg-gray-50 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stockCount === 0}
                className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reserve Equipment
              </button>
            </div>
          </div>
        </div>

        {/* --- 2. Integrated Review Section --- */}
        <div className="mt-20">
             <ViewReview productId={id} />
        </div>

        {/* --- Related Equipment --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.4em] mb-10 text-center">Complementary Gear</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <div
                  key={p.product_id}
                  onClick={() => navigate(`/product/${p.product_id}`)}
                  className="group cursor-pointer bg-white p-2 rounded-2xl hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{p.name}</h3>
                    <p className="text-gray-400 font-mono text-xs mt-1 font-bold">₹{p.price}/day</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductViewDetails;