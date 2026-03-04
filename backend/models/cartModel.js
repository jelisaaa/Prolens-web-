const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");
const Product = require("./productModel");

const Cart = sequelize.define(
  "Cart",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    // ✅ Added for ProLens Rental Tracking
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true, 
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    }
  },
  {
    tableName: "cart_details",
    timestamps: true,
  }
);

Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

module.exports = Cart;