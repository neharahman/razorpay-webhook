const jwt = require('jsonwebtoken');
require('dotenv').config()


module.exports.createToken=async (_id)=>{
    try{
        console.log('inside jwtToken',_id)
        let token=await jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:'1d'})
        return token
    }catch(err){
        console.log(err)
        throw err
    }
}

module.exports.verifyToken=async (_id)=>{
  try {
    let decoded=await jwt.verify(_id,process.env.JWT_SECRET)
    console.log('token verify successfully')
    return decoded
  } catch(err) {
    console.log('something went wrong during token verify',err)
    throw err
  }
}