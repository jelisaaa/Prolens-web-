const express = require("express").Router();
const { getAllProducts,  addProduct, getRelatedProducts, getProductDetails, getCategories, getProductsByCategory, updateProduct, deleteProduct } = require("../controllers/productController");
const authGuard = require("../helpers/authGuard");
const isAdmin = require("../helpers/isAdmin");

const uploadProductImages = require("../helpers/multer");


express.get("/all", getAllProducts);
express.post("/addproduct",authGuard,isAdmin,uploadProductImages,addProduct);

express.get("/getcategories", getCategories)
express.get("/getproductsbycategory/:category", getProductsByCategory);

express.get("/relatedproducts", getRelatedProducts);
express.get("/:id", getProductDetails);
express.put("/updateProduct/:id",authGuard,isAdmin,uploadProductImages,updateProduct);
express.delete("/deleteproduct/:id",authGuard,isAdmin, deleteProduct)



module.exports = express;