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
    specifications: "",
    thumbnail: null,
  });

  // ✅ MATCH DATABASE ENUM EXACTLY
  const categories = ["DSLR", "Mirrorless", "Lens", "Accessories"];
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
          name: product.name || "",
          category: product.category || "",
          description: product.description || "",
          rentalPrice: product.rentalPrice || "",
          brand: product.brand || "",
          condition: product.condition || "Excellent",
          stock: product.stock || "",
          specifications: product.specifications || "",
          thumbnail: null,
        });

        if (product.thumbnail) {
          setPreview(`${import.meta.env.VITE_API_BASE_URL}${product.thumbnail}`);
        }
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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("rentalPrice", Number(formData.rentalPrice));
    data.append("brand", formData.brand);
    data.append("condition", formData.condition);
    data.append("stock", Number(formData.stock));
    data.append("specifications", formData.specifications);

    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    try {
      const response = await updateProductApi(id, data);

      if (response.data.success) {
        toast.success("Equipment updated successfully");
        navigate("/admindash");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-bold">
        Loading Gear Details...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Equipment
            </h1>
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
                <label className="font-semibold">Equipment Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                >
                  {conditions.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold">Rental Price *</label>
                <input
                  type="number"
                  name="rentalPrice"
                  value={formData.rentalPrice}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                  required
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                  required
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold">Specifications</label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold">Update Image</label>
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-32 w-48 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-bold"
            >
              Update Equipment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;