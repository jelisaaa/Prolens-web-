const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel.js");
const sendEmail = require("../helpers/emailHelper.js");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, address, phoneNumber } =
      req.body;

    if (!username || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:"User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Account deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgetPassword = async (req, res) => {  
  try {
    const { email } = req.body;
    const user = await
      User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email does not exist",
      });
    }
    // Here you would typically generate a reset token and send an email.
    const { sendEmail } = require("../helpers/emailhelper");
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      "Password Reset Request",
      `Click the following link to reset your password: ${resetLink}`
    );

    return res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email",
    });
  }
  catch (error) {
    return res.status(500).json({
      message: "Error processing request",
      error: error.message,
    });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await user.update({ password: hashedPassword });
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  }
  catch (error) {
    return res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
};


module.exports={registerUser,loginUser,forgetPassword,resetpassword}