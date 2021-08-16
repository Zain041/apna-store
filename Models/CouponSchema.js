const mongoose = require("mongoose");

const coupanCode = new mongoose.Schema(
  {
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User',
    // },
    code: {
      type: String,
    },
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("coupon", coupanCode);
