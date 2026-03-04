import { useState, useEffect } from "react";
import { fetchProducts, deleteProductApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Grid, List, Trash2, Pencil, ShoppingCart, Camera } from "lucide-react";
import toast from "react-hot-toast";

const ViewProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const limit = 8;

  const [role] = useState(() => {
    const savedRole = localStorage.getItem("role");
    return savedRole ? savedRole.replace(/"/g, "").toLowerCase() : null;
  });

  const isAdmin = role === "admin";
  const isUser = role === "user";

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
      toast.error("Could not load equipment");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this equipment from the catalog?")) {
      try {
        const res = await deleteProductApi(id);
        if (res.data.success) {
          toast.success("Equipment deleted");
          fetchProductsList();
        }
      } catch (err) {
        toast.error("Delete failed. Check permissions.");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#0f1115] text-gray-100 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Camera className="text-blue-500" /> ProLens Inventory
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage and rent professional photography gear</p>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-800/50 p-1.5 rounded-xl border border-gray-700">
          <button 
            onClick={() => setView("grid")} 
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setView("list")} 
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500">Scanning inventory...</p>
        </div>
      ) : (
        <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "space-y-4"}>
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-[#1a1d23] border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="relative overflow-hidden h-52">
                <img 
                  src={product.thumbnail} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-widest text-blue-400 border border-blue-500/30">
                  {product.category}
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold truncate text-white group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-1 mt-1 mb-4">
                  <span className="text-xl font-black text-white">Rs. {product.rentalPrice}</span>
                  <span className="text-gray-500 text-xs">/ day</span>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/editproduct/${product.id}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-blue-600 py-2 rounded-lg text-xs font-bold text-white transition-all border border-gray-700 hover:border-blue-400"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      
                      <button
                        onClick={(e) => handleDelete(e, product.id)}
                        className="px-3 flex items-center justify-center bg-gray-800 hover:bg-red-600/20 hover:text-red-500 py-2 rounded-lg text-gray-400 transition-all border border-gray-700 hover:border-red-500/50"
                        title="Delete Gear"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}

                  {isUser && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                    >
                      <ShoppingCart size={16} /> Rent Gear
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
           {Array.from({ length: totalPages }, (_, i) => (
             <button
               key={i + 1}
               onClick={() => setPage(i + 1)}
               className={`w-10 h-10 rounded-lg font-bold transition-all ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
             >
               {i + 1}
             </button>
           ))}
        </div>
      )}
    </div>
  );
};

export default ViewProductList;