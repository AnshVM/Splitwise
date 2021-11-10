const Router = require('express').Router();
const balanceController = require('../controllers/balanceController')
const auth = require('../auth')

Router.post('/',auth,balanceController.createExpense);
Router.get('/',auth,balanceController.getCurrentUserBalances)
Router.put('/:balanceId',auth,balanceController.recordPayment)

module.exports = Router;