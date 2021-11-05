const Router = require('express').Router();
const userController = require('../controllers/userController')

Router.post('/',userController.signup)
Router.post('/login',userController.login)

module.exports = Router;