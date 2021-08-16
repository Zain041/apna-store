const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const BilingInfoSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  firstname: String,
  lastname: String,
  email: String,
  phone: Number,
  country: String,
  city: String,
  state: String,
  address: String,
  zip: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("bilinginfo", BilingInfoSchema);
