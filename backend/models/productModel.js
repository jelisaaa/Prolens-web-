const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      "Mirrorless", 
      "DSLR", 
      "Lenses", 
      "Lighting", 
      "Stabilizers", 
      "Audio",
      "Accessories"
    ),
    allowNull: false,
  },
  rentalPrice: { 
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  specifications: { 
    type: DataTypes.TEXT,
  },
  includedItems: { 
    type: DataTypes.TEXT,
  },
  thumbnail: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: { 
    type: DataTypes.JSON, 
    defaultValue: [],
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  }
});

module.exports = Product;