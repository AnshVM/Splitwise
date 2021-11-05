const Router = require('express').Router();
const userRoutes = require('./userRoutes');

Router.use('/user',userRoutes);

module.exports = Router;