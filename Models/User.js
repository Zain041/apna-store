const mongoose = require("mongoose")
var Schema = mongoose.Schema;


const userSchema = Schema({

    
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

