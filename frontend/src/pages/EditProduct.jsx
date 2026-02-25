import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetailsApi, updateProductApi } from "../services/api";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    rentalPrice: "", 
    brand: "",       
    condition: "Excellent", 
    stock: "",
    images: [],
    specifications: "", 
    thumbnail: null,
  });

  const categories = ["Cameras", "Lenses", "Lighting", "Stabilizers", "Audio", "Accessories"];
  const conditions = ["New", "Excellent", "Good", "Fair"];

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await getProductDetailsApi(id);
      if (res.data.success) {
        const product = res.data.product;
        setFormData({
          name: product.name,
          category: product.category,
          description: product.description,
          rentalPrice: product.rentalPrice,
          brand: product.brand || "",
          condition: product.condition || "Excellent",
          stock: product.stock,
          images: product.images || [],
          specifications: product.specifications || "",
          thumbnail: null,
        });
        setPreview(`${import.meta.env.VITE_API_BASE_URL}${product.thumbnail}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load equipment details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      setFormData({ ...formData, thumbnail: files[0] });
      if (files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(files[0]);
      }
    } else if (name === "images") {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("rentalPrice", Number(formData.rentalPrice));
    data.append("brand", formData.brand);
    data.append("condition", formData.condition);
    data.append("stock", Number(formData.stock));
    data.append("specifications", formData.specifications);

    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
    if (Array.isArray(formData.images)) {
      formData.images.forEach((img) => {
        if (img instanceof File) data.append("images", img);
      });
    }

    try {
      const response = await updateProductApi(id, data);
      if (response.data.success) {
        toast.success("Equipment updated successfully");
        navigate("/admindash"); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading Gear Details...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Equipment</h1>
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-black transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Equipment Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Rental Price (Per Day) *</label>
                <input
                  type="number"
                  name="rentalPrice"
                  value={formData.rentalPrice}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Quantity Available *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-4 bg-gray-50 p-4 rounded-xl">
                <label className="font-semibold text-gray-700">Update Main Image</label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                />
                {preview && (
                  <div className="relative w-48">
                    <img src={preview} alt="Preview" className="h-32 w-48 object-cover rounded-lg border shadow-sm" />
                    <p className="text-xs text-center mt-1 text-gray-500">Current Image</p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Description *</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                  required
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold text-gray-700">Technical Specifications</label>
                <textarea
                  name="specifications"
                  rows="3"
                  placeholder="e.g. 4K Video, Full Frame Sensor, EF Mount..."
                  value={formData.specifications}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-xl p-3"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:bg-gray-400 text-lg shadow-lg"
              >
                {loading ? "Saving Changes..." : "Update Equipment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;