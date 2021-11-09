const Router = require('express').Router();
const userController = require('../controllers/userController')
const auth = require('../auth')

Router.post('/login',userController.login)
Router.post('/',userController.signup)
Router.get('/search/:query',auth,userController.userSearch)
Router.get('/logout',userController.logout)
Router.get('/:id',auth,userController.getUserById)
Router.get('/',userController.getUserByToken)

module.exports = Router;