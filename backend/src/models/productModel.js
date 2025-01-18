const { Schema, model } = require("mongoose");

// color, size, quantity of a product variant
const variantSchema = new Schema({
  color: {
    type: String,
  },

  size: {
    type: String,
  },

  quantity: {
    type: Number,
    default: 0,
    required: [true, "Variant quantity is required"],
    validate: {
      validator: (v) => v > 0,
      message: (props) => `${props.value} should be greater than 0!`,
    },
  },
});

//name, slug, description, price, quantity, sold, shipping, category, image
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => `${props.value} should be greater than 0!`,
      },
    },

    variants: {
      type: [variantSchema],
      required: [
        true,
        "Product variants are required. As in: color, size, quantity",
      ],
    },

    sold: {
      type: Number,
      default: 0,
    },

    shipping: {
      type: Number,
      default: 0,
    },

    image: {
      type: [String],
      required: [true, "Product image is required"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
