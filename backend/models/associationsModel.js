const User = require('./userModel');
const Product = require('./productModel');
const Review = require('./reviewModel');

/**
 * ProLens Relationship Mapping
 */

// 1. User & Review Connection
// Allows us to see which photographer left which feedback
User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

// 2. Product & Review Connection
// Connects specific gear (lenses/cameras) to their field reports
Product.hasMany(Review, { foreignKey: 'product_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { User, Product, Review };