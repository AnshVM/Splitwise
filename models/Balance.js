const mongoose = require('mongoose')

const balanceSchema = new mongoose.Schema({
    positiveBalanceUser:String,
    negativeBalanceUser:String,
    balance:Number,
    name:String
})

const Balance = new mongoose.model('Balance',balanceSchema)

module.exports = Balance