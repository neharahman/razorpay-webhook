const { verifyToken } = require("../other/jwtToken")
const crypto = require('crypto')
const userModel = require("../models/userSchema")
const paymentModel = require('../models/payment')
const Razorpay = require('razorpay')
const fs = require('fs')

module.exports.displayPayment = async (req,res) =>{
    const file = fs.readFileSync('./views/index.html','utf-8')
    res.send(file)
   
}

module.exports.paymentGateway = async (req,res) => {
    try{
        console.log('inside paymentGateway')
        const {amount} =req.body
        console.log('amount',amount)
        const {authorization} = req.headers
        console.log(authorization)
        //initialization razorpay
        var instance = new Razorpay({
            key_id: process.env.RAZOR_PAY_key_id,
            key_secret: process.env.RAZOR_PAY_key_secret
        });
        
        //token verify
        let token = await verifyToken(authorization)
        //console.log(token)
        //checking the user authentication
        const ifTokenValid = await userModel.findById({_id:token._id})
        if(ifTokenValid){
            var options = 
            {
                amount: amount,  // amount in the smallest currency unit
                currency: "INR",
                receipt: "order_rcptid_11"
            };
            let order = await instance.orders.create(options)
            console.log('order',order)
            let insertOrderIdInPaymentModel = new paymentModel({
                _id:order.id,
                user_id:token._id
            })
            const save_insertOrderIdInPaymentModel=await insertOrderIdInPaymentModel.save()
            console.log('inserted in payment table',save_insertOrderIdInPaymentModel)
            order.razorpay_key=process.env.RAZOR_PAY_key_id
            res.status(200).json({
                status:'success',
                message:'payment successfully received',
                name:ifTokenValid.name,
                mobile:ifTokenValid.mobile,
                order
            })
        }
        else{
            res.status(401).json({
                status:'failure',
                message:'please login to continue'
            })
        }
    }catch(err){
        console.log('err occurred inside payment gateway',err)
        res.send(err)
    }
}


//payment success webhook

module.exports.paymentSuccess = async (req,res) =>{
    try{
        console.log('inside paymentSuccess',req.body)
        const requestedBody = JSON.stringify(req.body)
        const receivedSignature = req.headers['x-razorpay-signature']
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(requestedBody).digest('hex')
        if (receivedSignature === expectedSignature) { 
        // Store in your DB
            console.log('inserted in db')
            if(req.body.event == 'payment.authorized'){
                let payment_data = await paymentModel.findById({_id:req.body.payload.payment.entity.order_id})
                console.log('payment_data',payment_data)
                if(payment_data && !payment_data.flag){
                    payment_data['amount']= req.body.payload.payment.entity.amount
                    payment_data['receipt'] = req.body.payload.payment.entity.id
                    payment_data['created_at'] = req.body.created_at
                    payment_data['flag'] = true
                    await paymentModel.update({_id:payment_data.id},payment_data)
                }
                res.status(200).json({
                    status:'success',
                    message:'payment done successfully',
                    data:payment_data
                })
            }
        } 
        else {
            res.status(501).send('received but unverified resp')
        }

    }catch(err){
        console.log('error inside paymentSuccess')
        res.send(err)
    }
}

module.exports.paymentFailure = async (req,res) =>{
    try{
        console.log('inside paymentFailure',req.body)
        res.status(200).json({
            status:'success',
            message:'payment done successfully',
            data:req.body
            
        })

    }catch(err){
        console.log('error inside paymentFailure')
    }
}