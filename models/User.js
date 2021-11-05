const mongoose = require('mongoose')
const uniqueVlidator = require('mongoose-unique-validator');
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
    expenses:[String]
})

userSchema.plugin(uniqueVlidator);

const User = new mongoose.model('User',userSchema);

module.exports = User;