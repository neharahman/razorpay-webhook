const { verifyToken } = require("../other/jwtToken")
const crypto = require('crypto')
const userModel = require("../models/userSchema")
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
        console.log(token)
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
        throw err
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
            res.status(200).json({
                status:'success',
                message:'payment done successfully',
                data:req.body
                
            })
        } 
        else {
        res.status(501).send('received but unverified resp')
        }

    }catch(err){
        console.log('error inside paymentSuccess')
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