const Product  = require("../models/productModel");
const { Op } = require("sequelize");

const addProduct = async (req, res) => {
  try {
   
    console.log("Admin User:", req.user);
    console.log("Gear Details:", req.body);
    console.log("Uploaded Files:", req.files);

    const { 
      name, 
      brand, 
      category, 
      description, 
      rentalPrice, 
      stock, 
      specifications, 
      includedItems 
    } = req.body;

    if (!name || !description || !rentalPrice || !stock || !req.files?.thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Model name, description, rental price, stock, and gear thumbnail are required"
      });
    }

    const thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;

    const images = req.files?.images 
      ? req.files.images.map(f => `/uploads/${f.filename}`) 
      : [];

    const product = await Product.create({
      name,
      brand: brand || "Generic",
      category: category || "Camera Gear", 
      description,
      rentalPrice: Number(rentalPrice), 
      stock: Number(stock),
      specifications, 
      includedItems,  
      thumbnail,
      images,
    });

    return res.status(201).json({
      success: true,
      message: `${name} has been added to the rental fleet`,
      product
    });

  } catch (error) {
    console.error("ProLens addProduct error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error while adding equipment",
      error: error.message 
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
        if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const userRole = req.user.role;

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admins only"
      });
    }
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await product.destroy();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error); 
    
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message 
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }

    const thumbnail = req.files?.thumbnail
      ? `/uploads/${req.files.thumbnail[0].filename}`
      : product.thumbnail;

    const images = req.files?.images?.length
      ? req.files.images.map(file => `/uploads/${file.filename}`)
      : product.images;

    const { 
      name, 
      rentalPrice, 
      description, 
      category, 
      stock, 
      brand, 
      condition, 
      specifications 
    } = req.body;


    await product.update({
      name: name || product.name,
      rentalPrice: rentalPrice || product.rentalPrice,
      description: description || product.description,
      category: category || product.category,
      countInStock: stock || product.countInStock, 
      brand: brand || product.brand,
      condition: condition || product.condition,
      specifications: specifications || product.specifications,
      thumbnail,
      images,
    });

    res.json({
      success: true,
      message: "Equipment updated successfully",
      product,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = "http://localhost:5000"; 

    const formattedProducts = products.map(p => {
     
      const product = p.get({ plain: true });
      product.thumbnail = product.thumbnail ? `${baseUrl}${product.thumbnail}` : null;
      return product;
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      results: formattedProducts,
    });

  } catch (error) {
    
    console.error("DETAILED ERROR:", error); 
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Product.findByPk(id);
    if (!entry) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const product = entry.toJSON();
    const baseUrl = "http://localhost:5000";
    product.thumbnail = product.thumbnail ? `${baseUrl}${product.thumbnail}` : null;
    product.images = Array.isArray(product.images)
      ? product.images.map(img => `${baseUrl}${img}`)
      : [];

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { id, category } = req.query;
    console.log("HIT getRelatedProducts", req.query);

    if (!id || !category) {
      return res.status(400).json({
        success: false,
        message: "Product id and category are required",
      });
    }

    const products = await Product.findAll({
      where: {
        category,
         id: { [Op.ne]: id },
      },
      limit: 8,
      order: [["createdAt", "DESC"]],
    });

    const baseUrl = "http://localhost:5000";
    const formattedProducts = products.map(p => {
      const product = p.toJSON();
      product.thumbnail = product.thumbnail
        ? `${baseUrl}${product.thumbnail}`
        : null;
      return product;
    });

    res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Related products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch related products",
    });
  }
};


const getCategories = async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      raw:true
    });

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error("getCategories error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const products = await Product.findAll({
      where: { category },
      order: [["createdAt", "DESC"]],
      raw:true
    });

    const baseUrl = "http://localhost:5000";
    const formattedProducts = products.map(p => {
      p.thumbnail = p.thumbnail ? `${baseUrl}${p.thumbnail}` : null;
      return p;
    });

    res.status(200).json({
      success: true,
      results: formattedProducts,
    });
  } catch (error) {
    console.error("getProductsByCategory error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {addProduct,deleteProduct,updateProduct,getAllProducts,getProductDetails,getRelatedProducts,getCategories,getProductsByCategory
};