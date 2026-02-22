const Shipping = require("../models/shippingModel.js");

/**
 * @desc Save or Update Shipping/Logistics details for ProLens
 * @route POST /api/shipping/save
 */
const saveShippingDetails = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { fullName, phone, address, city } = req.body;

    // Validation matching the required fields in your ProLens frontend
    if (!fullName || !phone || !address || !city) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide all required delivery details." 
      });
    }

    // Check if the user already has logistics data saved
    let shipping = await Shipping.findOne({ where: { user_id } });

    if (shipping) {
      await shipping.update({
        fullName,
        phone,
        address,
        city,
      });
    } else {
      shipping = await Shipping.create({
        user_id,
        fullName,
        phone,
        address,
        city,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logistics details updated successfully ✨",
      data: shipping, 
    });
  } catch (error) {
    console.error("ProLens Backend Error [SaveShipping]:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error while saving logistics." 
    });
  }
};

/**
 * @desc Fetch the saved shipping details for the logged-in user
 * @route GET /api/shipping/get
 */
const getSavedShippingDetails = async (req, res) => {
  try {
    const userId = req.user.id; 

    const shipping = await Shipping.findOne({
      where: { user_id: userId },       
      order: [["updatedAt", "DESC"]], // Get the most recently updated entry
    });

    if (!shipping) {
      return res.status(200).json({
        success: false,
        message: "No saved address found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      data: shipping,
    });
  } catch (error) {
    console.error("ProLens Backend Error [GetSavedShipping]:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * @desc Admin only: View all shipping entries in the system
 * @route GET /api/shipping/all
 */
const getAllShippingEntries = async (req, res) => {
  try {
    const entries = await Shipping.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error("ProLens Backend Error [GetAllShipping]:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  saveShippingDetails,
  getSavedShippingDetails,
  getAllShippingEntries,
};