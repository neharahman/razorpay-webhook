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
app.use('/',userRoutes)
app.listen(7000,()=>{
    console.log('listen to the server')
})