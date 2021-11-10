const Balance = require('../models/Balance')
const User = require('../models/User')

exports.createExpense = async (req, res) => {
    let { name, negativeBalanceUser, amount } = req.body;
    amount = Number(amount)
    const positiveBalanceUser = req.userId
    const newExpense = { positiveBalanceUser, negativeBalanceUser, amount, name }
    const positiveBalanceUserDoc = await User.findById(positiveBalanceUser)
    const negativeBalanceUserDoc = await User.findById(negativeBalanceUser)
    for (let i = 0; i < positiveBalanceUserDoc.balances.length; i++) {
        if (positiveBalanceUserDoc.balances[i].userId === negativeBalanceUser) {
            let balance = await Balance.findById(positiveBalanceUserDoc.balances[i].id);
            balance.expenses.push(newExpense);
            if (balance.positiveBalanceUser === positiveBalanceUser) {
                balance.amount += amount;
            }
            else {
                balance.amount -= amount;
                console.log(balance.amount)
                if (balance.amount < 0) {
                    balance.positiveBalanceUser = positiveBalanceUser;
                    balance.negativeBalanceUser = negativeBalanceUser;
                    balance.amount = -(balance.amount)
                    console.log(balance.amount)
                }
            }
            balance.save()
                .then(() => res.status(201).json("Added expense to balance"))
                .catch(() => console.log(err))
            return
        }
    }
    const newBalance = new Balance();
    newBalance.name = name;
    newBalance.negativeBalanceUser = negativeBalanceUser;
    newBalance.positiveBalanceUser = positiveBalanceUser;
    newBalance.amount = amount;
    newBalance.expenses.push(newExpense);
    newBalance.save()
        .then(async (bal) => {
            negativeBalanceUserDoc.balances.push({ id: bal._id, userId: positiveBalanceUser })
            await negativeBalanceUserDoc.save()
            positiveBalanceUserDoc.balances.push({ id: bal._id, userId: negativeBalanceUser })
            await positiveBalanceUserDoc.save()
            return res.status(201).json("Created new balance")
        })
        .catch((err) => console.log(err))
}


exports.getCurrentUserBalances = async (req, res) => {
    const user = await User.findById(req.userId);
    const userBalances = [];
    for (let i = 0; i < user.balances.length; i++) {
        const balance = await Balance.findById(user.balances[i].id);
        if(!balance) continue
        const amount = balance.amount * (req.userId === balance.positiveBalanceUser ? 1 : -1);
        const { firstname, lastname, username,_id } = req.userId === balance.positiveBalanceUser ? await User.findById(balance.negativeBalanceUser) : await User.findById(balance.positiveBalanceUser)
        let expenses = []
        for (let i = 0; i < balance.expenses.length; i++) {
            const expenseAmount = balance.expenses[i].amount * (req.userId === balance.expenses[i].positiveBalanceUser ? 1 : -1);
            const expenseName = balance.expenses[i].name
            const id = balance.expenses[i]._id
            expenses.push({ expenseAmount, expenseName, id })
        }
        userBalances.push({ userId:_id, expenses, amount, firstname, lastname, username, _id: balance._id })
    }
    res.status(200).json(userBalances)
}



exports.recordPayment = async (req, res) => {
    const { amountPaid } = req.body;
    const { balanceId } = req.params;
    const positiveBalanceUser = req.userId;
    let balance = await Balance.findById(balanceId)
    const negativeBalanceUser = positiveBalanceUser===balance.positiveBalanceUser? balance.negativeBalanceUser:balance.positiveBalanceUser

    if(balance.amount==amountPaid){
        console.log('equal')
        Balance.deleteOne(balance)
            .then(async ()=>{
                let positiveBalanceUserDoc = await User.findById(positiveBalanceUser)
                let negativeBalanceUserDoc = await User.findById(negativeBalanceUser)
                positiveBalanceUserDoc.balances = positiveBalanceUserDoc.balances.filter((bal)=> balanceId!==bal.id)
                negativeBalanceUserDoc.balances = negativeBalanceUserDoc.balances.filter((bal)=> balanceId!==bal.id)
                positiveBalanceUserDoc.save()
                negativeBalanceUserDoc.save()
                res.status(200).json("Balance settled")
            })
            .catch((err)=>{
                console.log(err)
            })

    }
    else{
        balance.amount -= amountPaid
        const newExpense = {
            positiveBalanceUser,
            negativeBalanceUser,
            amount:amountPaid,
            name:""
        }
        balance.expenses.push(newExpense)
        balance.save()
            .then(balance => res.status(200).json(balance))
            .catch(err => console.log(err))
    }
}