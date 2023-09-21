const routes = require('express').Router()
const {signup,login} = require('../controllers/userController.js')
const {paymentGateway} = require('../controllers/paymentGateway.js')

routes.post('/user/signup',signup)
routes.post('/user/login',login)
routes.post('/user/payment',paymentGateway)

module.exports=routes