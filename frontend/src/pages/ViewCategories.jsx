import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCategories,
  fetchProducts,
  getProductDetailsApi,
  rentProductApi 
} from "../services/api";
import toast, { Toaster } from "react-hot-toast";
import { ShoppingBag, X, Zap, Loader2, Plus, ArrowRight } from "lucide-react";

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await fetchCategories();
        if (catRes.data.success) {
          setCategories(catRes.data.data.map(c => ({ id: c.id, name: c.category })));
          if (catRes.data.data.length > 0) setSelectedCategory(catRes.data.data[0].category);
        }
        const prodRes = await fetchProducts();
        if (prodRes.data.success) {
          const grouped = prodRes.data.results.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
          }, {});
          setProductsByCategory(grouped);
        }
      } catch (err) { console.error(err); }
    };
    loadData();
  }, []);

  const handleDetails = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getProductDetailsApi(id);
      if (res.data.success) setSelectedProduct(res.data.product);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleRent = async () => {
    if (!selectedProduct) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book gear");
      return navigate("/login");
    }

    try {
      setLoading(true);
      const res = await rentProductApi({ productId: selectedProduct.product_id || selectedProduct.id });
      if (res.data.success) {
        toast.success("Booking request sent successfully");
        setSelectedProduct(null);
      }
    } catch (err) {
      toast.error("Failed to process booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#1F2937] font-sans selection:bg-blue-600 selection:text-white relative">
      
      <Toaster 
        toastOptions={{
          style: { background: '#FFF', color: '#1F2937', border: '1px solid #E5E7EB' }
        }} 
      />
      
      <header className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-4">
          <Zap size={14} fill="currentColor" /> ProLens Inventory
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Elite Gear <br />
          <span className="text-gray-400 font-light italic font-serif">Selection.</span>
        </h1>
      </header>

      <nav className="flex gap-4 mb-16 overflow-x-auto px-6 max-w-7xl mx-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id || cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-10 py-4 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 border
              ${selectedCategory === cat.name 
                ? 'bg-white text-blue-600 border-white shadow-lg shadow-blue-500/10' 
                : 'bg-gray-200/50 text-gray-500 border-transparent hover:bg-gray-200'}`}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      <main className="max-w-7xl mx-auto px-6 pb-32">
        {selectedCategory && productsByCategory[selectedCategory] ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {productsByCategory[selectedCategory].map((product) => (
              <div
                key={product.product_id || product.id} 
                className="group bg-white rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                onClick={() => handleDetails(product.product_id || product.id)}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gray-100">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                </div>
                
                <div className="mt-8 px-4 pb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <p className="text-blue-600 font-semibold mt-1">Rs. {product.rentalPrice} <span className="text-gray-400 text-[10px] uppercase tracking-tighter">/ day</span></p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-6" size={32} />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Catalog...</p>
          </div>
        )}
      </main>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setSelectedProduct(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] p-12 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100">
                  <img
                    src={selectedProduct.thumbnail}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">{selectedProduct.name}</h2>
                    <p className="text-gray-500 text-sm mb-10 leading-relaxed italic">
                        "{selectedProduct.description}"
                    </p>

                    <div className="bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Rate</span>
                            <span className="text-2xl font-black text-gray-900 tracking-tighter">Rs. {selectedProduct.rentalPrice}</span>
                        </div>
                    </div>

                    <button
                      onClick={handleRent} 
                      className="w-full py-6 rounded-full bg-gray-900 text-white font-bold text-xs tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-3"
                    >
                      Book Gear <ShoppingBag size={18} />
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCategories;