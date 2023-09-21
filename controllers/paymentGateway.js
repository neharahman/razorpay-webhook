const { verifyToken } = require("../other/jwtToken")

module.exports.paymentGateway = async (req,res) => {
    try{
        console.log('inside paymentGateway')
        const {authorization} = req.headers
        console.log(authorization)
        let token = await verifyToken(authorization)
        console.log(token)
        res.status(200).json({
            status:'success',
            message:'payment successfully received'
        })
    }catch(err){
        throw err
    }
}