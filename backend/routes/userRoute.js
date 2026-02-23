const express = require("express").Router();

const {loginUser,registerUser, forgetPassword, resetpassword,} = require("../controllers/authController");
const { getUserProfile, updateUserProfile, getAllUsers } = require("../controllers/userController");
const protect = require("../helpers/protect");
const authGuard = require("../helpers/authGuard");
const isAdmin = require("../helpers/isAdmin");



express.post("/register", registerUser);
express.post("/login", loginUser);


express.post("/forgetPassword",forgetPassword);    
express.post("/resetPassword",resetpassword); 
express.get("/profile",protect,getUserProfile);
express.put("/profile",protect,updateUserProfile);

express.get("/viewallusers",authGuard,isAdmin, getAllUsers)



module.exports = express;