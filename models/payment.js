// const { default: mongoose } = require('mongoose')
const {Schema, default: mongoose} = require('mongoose')

const paymentSchema = new Schema({
    _id:{
        type:String,
        unique: true,
        required: true
    },
    amount:{
        type:Number
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    receipt:{
        type:String
    },
    created_at:{
        type:String
    },
    flag:{
        type:Boolean,
        default:false
    }
})

const paymentModel = mongoose.model('payment',paymentSchema)
module.exports = paymentModel