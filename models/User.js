const mongoose = require('mongoose')
const uniqueVlidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username:{
        required:[true,'Username is required'],
        type:String,
        unique:true,
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