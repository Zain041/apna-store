const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({

    
    fullName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    
    
    passwordResetToken: String,
    passwordResetExpires: Date
},
    {
        timestamps: true,
    }
)
module.exports = mongoose.model("User", userSchema)