const express = require('express')
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
const Razorpay = require('razorpay')
const bodyParser= require('body-parser')
require('dotenv').config()
const userRoutes = require('./routes/userRoutes.js')
//bodyparser


app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use(cors());

const db = process.env.DATABASE.replace('<username>',process.env.DATABASE_USERNAME).replace('<password>',process.env.DATABASE_PASSWORD)
mongoose.connect(db).then(()=>console.log('database connected')).catch((err)=>console.log('error in db connection',err))


app.get('/home',(req,res)=>{
    res.send('hello home')
})

app.use('/',userRoutes)























// app.get('/',(req,res)=>{
//     res.sendFile(`${__dirname}/index.html`)
// })

// app.post('/payment',async(req,res)=>{
//     try{
//         const {amount} =req.body
//         console.log('amount',amount)
//         var instance = new Razorpay({
//             key_id: process.env.RAZOR_PAY_key_id,
//             key_secret: process.env.RAZOR_PAY_key_secret
//         });
//         var options = {
//             amount: amount,  // amount in the smallest currency unit
//             currency: "INR",
//             receipt: "order_rcptid_11"
//         };
//         let order = await instance.orders.create(options)
//         order.razorpay_key=process.env.RAZOR_PAY_key_id
//         res.send(order)
//         // const {amount} = req.body
//         // var instances = new Razorpay({
//         //     key_id: process.env.RAZOR_PAY_key_id,
//         //     key_secret: process.env.RAZOR_PAY_key_secret
//         // })
//         // res.send('hello post')

//     }catch(err){
//         console.log('error inside payment api')
//         throw err
//     }

// })

// app.post('/payment/webhook/success',(req,res)=>{
//     try{
//         console.log('inside webhook success',req.body)
//         res.status(200).json({
//             status:'success',
//             message:'payment done successfully',
//             data:req.body
            
//         })

//     }catch(err){
//         console.log('error inside payment webhook success')
//     }
// })
// app.post('/payment/webhook/failure',(req,res)=>{
//     try{
//         console.log('inside webhook failure',req.body)
//         res.status(200).json({
//             status:'success',
//             message:'payment done successfully',
//             data:req.body
            
//         })

//     }catch(err){
//         console.log('error inside payment webhook failure')
//     }
// })

app.listen(7000,()=>{
    console.log('listen to the server')
})