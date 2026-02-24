import { useState, useEffect } from "react";
import { fetchProducts } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Grid, List } from "lucide-react";

const ViewProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const limit = 8;

  useEffect(() => {
    fetchProductsList();
  }, [page]);

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const res = await fetchProducts();
      const allProducts = res.data.results || [];

      const startIndex = (page - 1) * limit;
      const paginatedProducts = allProducts.slice(startIndex, startIndex + limit);
      setProducts(paginatedProducts);
      setTotalPages(Math.ceil(allProducts.length / limit));
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-900 to-gray-800 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-100">Photography Equipment</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full font-medium transition ${
              view === "grid"
                ? "bg-gray-700 text-gray-100 shadow-md"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Grid size={16} /> Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full font-medium transition ${
              view === "list"
                ? "bg-gray-700 text-gray-100 shadow-md"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <List size={16} /> List
          </button>
        </div>
      </div>

      {loading && <p className="text-center text-gray-400 mt-12">Loading equipment...</p>}

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-400 mt-12">No equipment found.</p>
      )}

      {!loading && products.length > 0 && (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="relative cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all bg-gray-800 hover:bg-gray-700 hover:scale-105 duration-300"
            >
              <div className="relative">
                <img
                  src={product.thumbnail}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-t-xl"
                />
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock === 0 ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {product.stock === 0 ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-bold text-gray-100">{product.name}</h2>
                <p className="text-gray-300 font-semibold">Rs. {product.rentalPrice} / day</p>

                {view === "list" && (
                  <div className="bg-gray-900/70 backdrop-blur-md p-3 rounded-md">
                    <p className="text-gray-400 text-sm line-clamp-4">
                      {product.description || "No description available."}
                    </p>
                  </div>
                )}

                <button
                  className="mt-2 px-4 py-2 rounded-full bg-gray-700 text-gray-100 font-medium hover:bg-gray-600 transition"
                >
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 transition disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-full transition font-medium ${
                page === i + 1
                  ? "bg-gray-700 text-gray-100 shadow"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-full border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewProductList;