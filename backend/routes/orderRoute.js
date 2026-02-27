const { placeOrder, getOrders, getAllOrdersAdmin, getOrderDetailsAdmin, getOrderDetails, updateOrderStatus } = require("../controllers/orderController");
const express = require("express").Router();

const authGuard = require("../helpers/authGuard");


express.post("/place",authGuard,placeOrder);  //userplaceorder
express.get("/getorders",authGuard, getOrders); //usergetallorders
express.get("/getorder",authGuard,getOrderDetails); //usergetorderdetails

express.get("/get-all",authGuard,  getAllOrdersAdmin); //admin gets all users order
express.get("/details/:id", authGuard, getOrderDetailsAdmin);
express.put("/update-status/:id", authGuard, updateOrderStatus);


module.exports = express;
