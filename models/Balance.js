const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    positiveBalanceUser:String,
    negativeBalanceUser:String,
    amount:Number,
    name:String
})

const balanceSchema = new mongoose.Schema({
    positiveBalanceUser:String,
    negativeBalanceUser:String,
    amount:Number,
    expenses:[expenseSchema]
})

const Balance = new mongoose.model('Balance',balanceSchema)

module.exports = Balance
