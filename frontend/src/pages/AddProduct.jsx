import { useState } from "react";
import { addProductApi } from "../services/api";
import toast from "react-hot-toast";
import { Camera, Upload, ChevronRight, X } from "lucide-react";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    rentalPrice: "",
    stock: "",
    thumbnail: null,
  });

  const categories = ["Mirrorless", "DSLR", "Lenses", "Lighting", "Stabilizers"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      const file = files[0];
      setFormData({ ...formData, thumbnail: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.thumbnail || !formData.rentalPrice) {
      return toast.error("Please fill in the essential fields.");
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    try {
      await addProductApi(data);
      toast.success("Equipment registered successfully");
      setFormData({ name: "", brand: "", category: "", description: "", rentalPrice: "", stock: "", thumbnail: null });
      setPreview(null);
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white border border-gray-100 shadow-sm rounded-3xl p-8 md:p-12">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-full mb-4">
            <Camera className="text-gray-400" size={24} />
          </div>
          <h1 className="text-2xl font-light text-gray-900 tracking-tight">New Equipment</h1>
          <p className="text-gray-400 text-sm mt-1">Add gear to the ProLens rental catalog.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex justify-center">
            <div className="relative group">
              <label className="flex flex-col items-center justify-center w-40 h-40 bg-gray-50 border border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all overflow-hidden">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-300 mb-2" size={20} />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Thumbnail</span>
                  </div>
                )}
                <input type="file" name="thumbnail" onChange={handleChange} className="hidden" />
              </label>
              {preview && (
                <button 
                  onClick={() => {setPreview(null); setFormData({...formData, thumbnail: null})}}
                  className="absolute -top-2 -right-2 bg-white shadow-md border border-gray-100 rounded-full p-1 text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Model Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Sony Alpha A7" className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-colors" />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Canon, Nikon, etc." className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-colors" />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-colors appearance-none cursor-pointer">
                <option value="">Select Type</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Daily Rate (₹)</label>
              <input type="number" name="rentalPrice" value={formData.rentalPrice} onChange={handleChange} placeholder="0.00" className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Key features and kit contents..." className="bg-transparent border-b border-gray-200 py-2 outline-none focus:border-black transition-colors resize-none h-20" />
          </div>

          <button 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-medium tracking-widest py-4 rounded-full hover:bg-gray-900 transition-all disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "Add Equipment"}
            {!loading && <ChevronRight size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;