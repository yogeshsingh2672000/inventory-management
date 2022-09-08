const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});
const Product = mongoose.model("products", productSchema);
module.exports = Product;
