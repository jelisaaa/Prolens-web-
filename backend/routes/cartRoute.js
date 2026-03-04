const { addToCart, getCartByUser, updateCartQuantity, clearCart, removeCartItem } = require("../controllers/CartController");
const authGuard = require("../helpers/authGuard");
const express = require("express").Router();

express.post("/add", authGuard,addToCart);

express.get("/getCart",authGuard, getCartByUser,);

express.put("/updatecart/:productId",authGuard, updateCartQuantity);
express.delete("/clearcart",authGuard, clearCart);
// Add this line below your other routes
express.delete("/remove/:productId", authGuard, removeCartItem);



module.exports = express
