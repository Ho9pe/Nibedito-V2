const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  variant: {
    type: Schema.Types.ObjectId,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },

  cost: {
    type: Number,
    default: 0,
  },
});

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [cartItemSchema],

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema);
module.exports = Cart;
