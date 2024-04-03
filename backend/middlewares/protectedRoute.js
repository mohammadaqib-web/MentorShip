const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user_model');

const authenticate = async(req,res,next)=>{
    const authHeader = req.headers["authorization"];
    if(!authHeader){
        return res.status(400).json({message:"You are unauthorized!"});
    }

    const token = await authHeader.replace("Bearer ","");
    if(!token){
        return res.status(400).json({message:"You are unauthorized!"});
    }

    try {
        const decodedToken = await jwt.verify(token,process.env.JWT_SECRET);
        if(!decodedToken){
            return res.status(400).json({message:"You are unauthorized!"});
        }

        const user = await UserModel.findOne({email:decodedToken},{password:0});
        if(!user){
            return res.status(400).json({message:"You are unauthorized!"});
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({message:"Error Occurred!"});
    }
}

module.exports = authenticate;