const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
    },
    description: {
      type: String,
     
    },
    averageRating: {
      type: Number,
     
    },
    imageUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Forza_Horizon_4_cover.jpg/220px-Forza_Horizon_4_cover.jpg",
    },
    category: {
      type: String,
     
    },
    countInStock: {
      type: String,
     
    },
    brand: {
      type: String,
     
    },
    price: {
      type: Number,
     
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);
