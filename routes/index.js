const Router = require('express').Router();
const userRoutes = require('./userRoutes');
const balanceRoutes = require('./balanceRoutes')

Router.use('/user',userRoutes);
Router.use('/balance',balanceRoutes)

module.exports = Router;
