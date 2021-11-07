const Balance = require('../models/Balance')
const User = require('../models/User')

exports.createBalance = async (req,res) => {
    const {name,negativeBalanceUser,balance} = req.body;
    const positiveBalanceUser = req.userId
    const newBalance = {name,negativeBalanceUser,positiveBalanceUser,balance};
    console.log(balance)
    Balance.create(newBalance,async (err,balance)=>{
        if(err) console.log(err)
        const negativeBalanceUserDoc = await User.findById(negativeBalanceUser)
        negativeBalanceUserDoc.balances.push(balance._id)
        negativeBalanceUserDoc.save()
            .catch((err)=>console.log(err))
        const positiveBalanceUserDoc = await User.findById(positiveBalanceUser)
        positiveBalanceUserDoc.balances.push(balance._id)
        positiveBalanceUserDoc.save()
            .catch((err)=>console.log(err))

    })
    return res.status(201).json("Balance created")
}

exports.getCurrentUserBalances = async (req,res) => {
    const user = await User.findById(req.userId);
    const userBalances = [];
    for(let i=0;i<user.balances.length;i++){
        const balance = await Balance.findById(user.balances[i]);
        userBalances.push(balance)
    }
    res.status(200).json(userBalances)
}