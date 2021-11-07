const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    username:{
        required:[true,'Username is required'],
        type:String,
        unique:true,
    },
    firstname:{
        type:String,
        required:[true,"Firstname is required"]
    },
    lastname:{
        type:String,
        required:[true,"Lastname is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        validate:[validator.isEmail,'Invalid email'],
    },
    password:{
        required:[true,'Password is required'],
        type:String
    },
    balances:[String]
})

userSchema.index({username: 'text',firstname:'text',lastname:'text'});


const User = new mongoose.model('User',userSchema);

module.exports = User;