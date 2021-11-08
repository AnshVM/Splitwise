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
        const name = balance.name;
        const amount = balance.balance * (req.userId===balance.positiveBalanceUser?1:-1);
        const {firstname,lastname,username} = req.userId===balance.positiveBalanceUser?await User.findById(balance.negativeBalanceUser):await User.findById(balance.positiveBalanceUser)                      
        userBalances.push({name,amount,firstname,lastname,username})
    }
    res.status(200).json(userBalances)
}

//name, amount(+,-), other user fname,lname,uname

// positiveBalanceUser:String,
// negativeBalanceUser:String,
// balance:Number,
// name:String