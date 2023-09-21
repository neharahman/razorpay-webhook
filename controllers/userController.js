const userModel = require("../models/userSchema")
const { verifyToken } = require("../other/jwtToken")
const { createToken } = require("../other/jwtToken")

module.exports.signup = async (req,res) =>{
    try{
        const {name,mobile,password} = req.body
        console.log('inside signup',name,mobile,password)
        const insert_userModel = await userModel ({name,mobile,password})
        const user = await insert_userModel.save()
        const jwtToken= await createToken(user._id)
        res.status(200).json({
            status:'success',
            message:'succefully signup',
            token:jwtToken,
            user
        })
    }catch(err){
        throw Error(err)
    }
}

module.exports.login = async (req,res) =>{
    console.log('inside login')
    const {mobile,password} =req.body
    let isMobileExist_in_userModel = await userModel.findOne({mobile:mobile})
    console.log(isMobileExist_in_userModel)
    if(isMobileExist_in_userModel && isMobileExist_in_userModel.password==password){

        const jwtToken = await createToken(isMobileExist_in_userModel._id)
        res.status(200).json({
            status:'success',
            message:'successfully login',
            token:jwtToken
        })
    }
    res.send('hello login')
}