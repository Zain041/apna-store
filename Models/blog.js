const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
    title: {
      type: String,
    },
    desc: {
      type: String,
      unique: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Forza_Horizon_4_cover.jpg/220px-Forza_Horizon_4_cover.jpg",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Blog", blogSchema);
