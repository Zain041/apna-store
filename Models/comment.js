const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
      postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
     
    },
    userName: {
      type: String,
     
    },
   
    desc: {
      type: String,
     
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
module.exports = mongoose.model("Comment", commentSchema);
