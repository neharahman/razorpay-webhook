const {Schema, default: mongoose} = require('mongoose')

const userSchema = new Schema({
    name:{
        type:String
    },
    mobile:{
        type:Number,
        unique:true
    },
    password:{
        type:String
    }
})

const userModel = mongoose.model('user',userSchema)
module.exports=userModel