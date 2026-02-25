const Cart = require('../models/cartModel');
const Product = require('../models/productModel');


const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required"
            })
        }
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const existingItem = await Cart.findOne({
            where: {
                user_id: userId,
                product_id: productId
            }
        })

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} items in stock`
                });
            }
            existingItem.quantity = newQuantity;
            await existingItem.save();
            return res.status(200).json({
                success: true,
                message: `Cart updated: ${newQuantity} item(s)`
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items in stock`
            });
        }

        await Cart.create({
            user_id: userId,
            product_id: productId,
            quantity
        });

        res.status(200).json({
            success: true,
            message: `${quantity} item(s) added to cart`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCartByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "rentalPrice", "thumbnail", "stock"],
          required: true,
        },
      ],
    });

    res.status(200).json({
      success: true,
      cartItems,
    });
  } catch (error) {
    console.error("getCartByUser error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports ={addToCart,getCartByUser}