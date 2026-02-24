import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  addToCartApi,
  getProductDetailsApi,
  getRelatedProductsApi,
} from "../services/api";

const ProductViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

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
      const res = await getProductDetailsApi(id);
      if (res.data.success) {
        setProduct(res.data.product);
        setMainImage(res.data.product.thumbnail);
      } else {
        toast.error(res.data.message || "Product not found");
        navigate("/");
      }
    } catch (err) {
      toast.error("Failed to load product");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const res = await addToCartApi({ productId: product.id, quantity });
      if (res.data.success) toast.success(res.data.message);
      else toast.error(res.data.message || "Failed to add to cart");
    } catch (err) {
      toast.error("Please login to add to cart");
      navigate("/login");
    }
  };

  if (loading) return <p className="text-center mt-20 text-gray-500">Loading...</p>;
  if (!product) return <p className="text-center mt-20 text-gray-500">Product not found</p>;

  const stockCount = product.stock;
  const images = product.images?.length ? [product.thumbnail, ...product.images] : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster />
      <div className="max-w-6xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white shadow-xl rounded-3xl p-8 md:p-12">
                    <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-md">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 ${mainImage === img ? "border-blue-500 shadow-lg" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 mt-2">{product.category}</p>

              <div className="mt-4 flex items-center gap-4">
                <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
                {product.oldPrice && <span className="text-gray-400 line-through">₹{product.oldPrice}</span>}
              </div>

              <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>

              <p className={`mt-4 font-semibold ${stockCount > 0 ? "text-green-600" : "text-red-600"}`}>
                {stockCount > 0 ? `In Stock (${stockCount} available)` : "Out of Stock"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              
              <div className="flex items-center border rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-100 rounded-l-lg hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-4 font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                  className="px-3 py-2 bg-gray-100 rounded-r-lg hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stockCount === 0}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Related Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.product_id}
                  onClick={() => navigate(`/product/${p.product_id}`)}
                  className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
                >
                  <img
                    src={p.thumbnail}
                    alt={p.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-blue-600 font-bold">₹{p.price}</p>
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