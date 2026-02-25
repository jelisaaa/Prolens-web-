const { addToCart, getCartByUser } = require("../controllers/CartController");
const authGuard = require("../helpers/authGuard");
const express = require("express").Router();

express.post("/add", authGuard,addToCart);

express.get("/getCart",authGuard, getCartByUser,);



module.exports = express
