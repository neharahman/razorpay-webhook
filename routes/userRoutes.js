const routes = require('express').Router()
const {signup,login} = require('../controllers/userController.js')
const {paymentGateway,displayPayment, paymentSuccess, paymentFailure} = require('../controllers/paymentGateway.js')

routes.post('/user/signup',signup)
routes.post('/user/login',login)
routes.post('/user/payment',paymentGateway)
routes.get('/user/display/payment',displayPayment)
routes.post('/user/payment/success',paymentSuccess)
routes.post('/user/payment/failure',paymentFailure)

module.exports=routes