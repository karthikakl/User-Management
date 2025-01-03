const jwt=require('jsonwebtoken')
const User=require('../model/userModel')

const protect = async(req,res,next)=>{
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        try {
            //getting token from header
            token= req.headers.authorization.split(' ')[1]

            const decoded=jwt.verify(token,process.env.JWT_SECRET)

            //getting user from token

            req.user=await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error ('Not authorized')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized,no token')
    }
}



module.exports={protect}