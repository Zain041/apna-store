const mongoose = require("mongoose")

const Schema = mongoose.Schema
const PaymentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    userId: String,
    name: String,
    email: String,
    phone: Number,
    amount: Number,
    paymentMethod: String,
    startDate: String,
    endDate: String,
    Paid: {
        type: Boolean,
        default: false,
    },

    timeStamp: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Payment", PaymentSchema)