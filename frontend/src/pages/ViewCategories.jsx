import { useState, useEffect } from "react";
import {
  fetchCategories,
  fetchProducts,
  getProductDetailsApi,
  rentProductApi // dummy API for now
} from "../services/api";
import toast, { Toaster } from "react-hot-toast";

const ViewCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res.data.success) {
          setCategories(res.data.data.map(c => ({ id: c.id, name: c.category })));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        if (res.data.success) {
          const grouped = res.data.results.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
          }, {});
          setProductsByCategory(grouped);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  const handleDetails = async (id) => {
    if (!id) {
      console.error("Product ID is required");
      return;
    }
    try {
      setLoading(true);
      const res = await getProductDetailsApi(id);
      if (res.data.success) setSelectedProduct(res.data.product);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async () => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      const res = await rentProductApi(selectedProduct.product_id || selectedProduct.id);
      if (res.data.success) {
        toast.success("Gear rented successfully!");

        setSelectedProduct(null);

        setProductsByCategory(prev => {
          const category = selectedCategory;
          if (!prev[category]) return prev;

          const updatedProducts = prev[category].filter(
            p => (p.product_id || p.id) !== (selectedProduct.product_id || selectedProduct.id)
          );

          return {
            ...prev,
            [category]: updatedProducts,
          };
        });
      } else {
        toast.error(res.data.message || "Failed to rent gear");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error renting gear");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Explore Photography Gear
        </h1>

        <div className="flex justify-center gap-6 mb-10 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2 font-semibold transition-all border-b-2
                ${selectedCategory === cat.name ? 'border-green-500 text-green-600' : 'border-transparent text-gray-700 hover:text-green-500 hover:border-green-300'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {selectedCategory && productsByCategory[selectedCategory] ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productsByCategory[selectedCategory].map(product => (
              <div
                key={product.product_id || product.id || product.name} 
                className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all cursor-pointer"
                onClick={() => handleDetails(product.product_id || product.id)}
              >
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white text-lg font-bold">{product.name}</h3>
                  <p className="text-green-400 font-semibold">Rs. {product.rentalPrice} / day</p>
                </div>
              </div>
            ))}
          </div>
        ) : selectedCategory ? (
          <p className="text-center text-gray-500 mt-20 italic">No gear available in this category.</p>
        ) : (
          <p className="text-center text-gray-500 mt-20 italic">Select a category to view gear.</p>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 text-xl font-bold text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
              <img
                src={selectedProduct.thumbnail}
                alt={selectedProduct.name}
                className="w-full h-60 object-cover rounded-xl mb-5"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
              <p className="text-xl font-bold mb-5">Rs. {selectedProduct.rentalPrice} / day</p>
              <button
                onClick={handleRent} 
                className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 transition"
              >
                Rent This Gear
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <p className="bg-white px-6 py-3 rounded-xl">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCategories;