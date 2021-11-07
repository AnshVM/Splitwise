const Router = require('express').Router();
const balanceController = require('../controllers/balanceController')
const auth = require('../auth')

Router.post('/',auth,balanceController.createBalance);
Router.get('/',auth,balanceController.getCurrentUserBalances)

module.exports = Router;