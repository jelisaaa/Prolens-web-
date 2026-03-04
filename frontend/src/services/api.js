import axios from 'axios';
const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
    headers:{
        "Content-Type":"multipart/form-data",
    },
});

const Api=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers:{
        "Content-Type":"application/json"
    }
});

const authConfig = {
    headers:{
        'authorization': `Bearer ${localStorage.getItem("token")||""}`,
    }
}



export const createUserApi = (data) => Api.post("/api/user/register",data);

export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const fetchProducts = () => Api.get("/api/products/all");

export const getProductDetailsApi = (id) => {
  if (!id) throw new Error("Product ID is required");
  return Api.get(`/api/products/${id}`, authConfig);
};

export const forgetPassword = (data) => Api.post('/api/user/forgetPassword', data);
export const resetPassword = (data) => Api.post('/api/user/resetPassword', data);

export const getProfileApi = () => Api.get("/api/user/profile", authConfig);
export const updateProfileApi = (data) => Api.put("/api/user/profile", data, authConfig);

export const addProductApi = (data) => ApiFormData.post("/api/products/addproduct", data, authConfig);

export const saveShippingApi = (data) => Api.post(`/api/shipping/saveShipping`, data, authConfig);
export const getAllShippingApi =() => Api.get(`/api/shipping/getAllShipping`, authConfig);
export const getSavedShippingApi = () => Api.get("/api/shipping/getsavedshipping", authConfig);

export const getAllUsersApi = (role) => Api.get(`/api/user/viewallusers`, {params: {role}, ...authConfig});

export const placeOrderApi = (data) => Api.post("/api/order/place", data, authConfig);

export const getCartByUserApi = () => Api.get("/api/cart/getCart", authConfig);

export const getOrdersApi = () => Api.get("/api/order/getorders", authConfig);
export const getAllOrdersAdminApi = (status) => Api.get("/api/order/get-all", { params: { status }, ...authConfig });
export const updateOrderStatusApi = (id, data) => Api.put(`/api/order/update-status/${id}`, data, authConfig);
export const getOrderDetailsApi = (orderId) => Api.get("/api/order/getorder", { params: { orderId }, ...authConfig});

export const getOrderDetailsAdminApi = (orderId) =>
  Api.get(`/api/order/details/${orderId}`, authConfig);




export const updateCartQuantity = (productId, quantity ) => Api.put(`/api/cart/updateCart/${productId}`, { quantity }, authConfig);
export const addToCartApi = (data) => Api.post("/api/cart/add", data, authConfig);
export const clearCartApi = () => Api.delete("/api/cart/clearcart", authConfig);

export const removeFromCartApi = (productId) =>
  Api.delete(`/api/cart/remove/${productId}`, authConfig);


export const deleteProductApi = (id) => Api.delete(`/api/products/deleteproduct/${id}`, authConfig)

export const updateProductApi = (id, data) => ApiFormData.put(`/api/products/updateProduct/${id}`, data, authConfig);

export const createReviewApi = (data) => Api.post("/api/review/createreview", data, authConfig);
export const getProductReviewsApi = (productId) => Api.get(`/api/review/getreview/${productId}`, authConfig);
export const getReviewByIdApi = (reviewId) => Api.get(`/api/review/getreview-by-id/${reviewId}`, authConfig);
export const updateReviewApi = (reviewId, data) => Api.put(`/api/review/updatereview/${reviewId}`, data, authConfig);
export const deleteReviewApi = (reviewId) => Api.delete(`/api/review/deletereview/${reviewId}`, authConfig);



export const getRelatedProductsApi = (id, category) => 
  Api.get("/api/products/relatedproducts", {
    params: { id, category }
  });

export const fetchCategories = () => Api.get("/api/products/getcategories");
export const fetchProductsByCategory = (category) => 
    Api.get(`/api/products/getproductsbycategory/${category}`);



export const rentProductApi = async (productId) => {
  console.log("Renting product:", productId);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    data: {
      success: true,
      message: "Product rented successfully",
    },
  };
};

