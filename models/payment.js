const { default: mongoose } = require('mongoose')
const Schema = require('mongoose')

const paymentSchema = new Schema({
    payment_id:{
        type:String
    },
    amount:{
        type:Number
    },
    user_id:{
        type:String
    },
    receipt:{
        type:String
    },
    created_at:{
        type:String
    }
})

const paymentModel = mongoose.model('payment')