const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        res.json({ message: "Added to cart", cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate("items.product");

        if (!cart) {
            return res.json({ items: [] });
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    exports.updateCart = async (req, res) => {
        try {
            const { productId, quantity } = req.body;

            const cart = await Cart.findOne({ user: req.user.id });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            const item = cart.items.find(
                (i) => i.product.toString() === productId
            );

            if (!item) {
                return res.status(404).json({ message: "Item not in cart" });
            }

            item.quantity = quantity;
            await cart.save();

            res.json({ message: "Cart updated", cart });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

};

exports.updateCart = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
  
      const cart = await Cart.findOne({ user: req.user.id });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      const item = cart.items.find(
        (i) => i.product.toString() === productId
      );
  
      if (!item) {
        return res.status(404).json({ message: "Item not in cart" });
      }
  
      item.quantity = quantity;
      await cart.save();
  
      res.json({ message: "Cart updated", cart });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  


  exports.removeFromCart = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const cart = await Cart.findOne({ user: req.user._id });
  
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
  
      await cart.save();
  
      const updatedCart = await Cart.findOne({ user: req.user._id })
        .populate("items.product");
  
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  
  const Order = require("../models/Order");

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orders = [];

    for (const item of cart.items) {
      const product = item.product;

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      const totalPrice = item.quantity * product.price;

      const order = await Order.create({
        customerId: req.user.id,
        productId: product._id,
        quantity: item.quantity,
        totalPrice,
        status: "pending",
      });

      product.quantity -= item.quantity;
      await product.save();

      orders.push(order);
    }

    // clear cart
    cart.items = [];
    await cart.save();

    res.json({
      message: "Order placed successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
