const Router = require('express').Router();
const userController = require('../controllers/userController')
const auth = require('../auth')

Router.post('/',userController.signup)
Router.post('/login',userController.login)
Router.get('/:query',auth,userController.userSearch)
Router.get('/:id',auth,userController.getUserById)

module.exports = Router;