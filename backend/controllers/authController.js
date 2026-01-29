const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const OTP = require("../models/otpModel.js");
const sendEmail = require("../helpers/emailUtils");
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

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await OTP.destroy({ where: { email } });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await OTP.create({ email, otp: otpCode, expiresAt, verified: false });

    try {
      await sendEmail(
        email,
        "Password Reset OTP",
        `Your OTP is ${otpCode}. It expires in 2 minutes.`
      );
    } catch (err) {
      console.error("Failed to send email:", err);
      // Email failed, but OTP is still created, so continue
    }

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};




const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const record = await OTP.findOne({ where: { email, otp } });
        if (!record)
            return res.status(400).json({ message: "Invalid OTP" });

        if (record.expiresAt < new Date())
            return res.status(400).json({ message: "OTP expired" });

        await record.update({ verified: true });

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};



const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (!email || !password || !confirmPassword)
            return res.status(400).json({ message: "All fields required" });

        if (password !== confirmPassword)
            return res.status(400).json({ message: "Passwords do not match" });

        if (password.length < 8)
            return res.status(400).json({ message: "Password too short" });

        const otpRecord = await OTP.findOne({
            where: { email, verified: true }
        });

        if (!otpRecord)
            return res.status(403).json({ message: "OTP not verified" });

        const hashed = await bcrypt.hash(password, 10);

        await User.update(
            { password: hashed },
            { where: { email } }
        );

        await OTP.destroy({ where: { email } });

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports={registerUser,loginUser,sendOtp,resetPassword,verifyOtp}