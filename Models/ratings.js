const mongoose = require("mongoose")



const ratingsSchema = new mongoose.Schema({

    
    userName: {
        type: String,
    },
    feedback: {
        type: String,
       
    },
    ratings: {
        type: Number,
        required:true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    
    
   
},
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("Rating", ratingsSchema)