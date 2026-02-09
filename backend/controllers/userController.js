const User = require("../models/userModel.js");
const bcrypt = require('bcrypt');

const getUserProfile = async (req, res) => {
  try {
    // Check if req.user actually exists to prevent crashing
    if (!req.user) {
      return res.status(404).json({ message: "User not found in request" });
    }

    res.json({
      success: true,
      data: {
        username: req.user.username,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        address: req.user.address,
        dob: req.user.dob,
        gender: req.user.gender,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = req.user; 
    const { username, email, phoneNumber, address, dob, gender } = req.body;

    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.phoneNumber = phoneNumber ?? user.phoneNumber;
    user.address = address ?? user.address;
    user.dob = dob ?? user.dob;
    user.gender = gender ?? user.gender;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dob: user.dob,
      gender: user.gender,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {getUserProfile,updateUserProfile}

