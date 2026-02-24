const express = require("express").Router();
const { getAllProducts,  addProduct, getRelatedProducts, getProductDetails } = require("../controllers/productController");
const authGuard = require("../helpers/authGuard");
const isAdmin = require("../helpers/isAdmin");

const uploadProductImages = require("../helpers/multer");


express.get("/all", getAllProducts);

express.get("/relatedproducts", getRelatedProducts);
express.get("/:id", getProductDetails);

express.post("/addproduct",authGuard,isAdmin,uploadProductImages,addProduct);




module.exports = express;